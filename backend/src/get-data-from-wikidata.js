import { WBK } from 'wikibase-sdk'
import axios from 'axios'
import { writeFileSync } from 'fs'
import { queries } from './queries.js'
import { calculateMastodonAccountScore } from "mastodon-profile-checker"

// Make sure you initialize wbk with a sparqlEndpoint
const wbk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})
const userAgent = { 'User-Agent': 'MastodonListeBot/1.0 (https://mastodon-listen.playground.54gradsoftware.de/)' }; // see https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy


const main = async () => {
  try {
    console.log('Starting to fetch data from Wikidata...')
    console.log('Queries to run:', queries.map(query => query.key).join(', '))
    for (const query of queries) {
      console.log('Running query:', query.key)
      const url = wbk.sparqlQuery(query.sparqlQuery)
      const { data } = await axios.get(url, {
        timeout: 65000,
        headers: {
          'Accept': 'application/sparql-results+json',
          userAgent
        }
      })
      const results = data.results.bindings
      let uniqueResults = results.filter((obj1, i, arr) =>
        arr.findIndex(obj2 => (obj2.mastodon?.value.toLowerCase() === obj1.mastodon?.value.toLowerCase())) === i
      )
      if (query.key == 'wissenschaftler_innen-de') {
        uniqueResults = uniqueResults.map(result => {
          return {
            ...result,
            doings: [...new Set(results.filter(obj => obj?.item?.value === result?.item?.value).map(obj => obj?.doingName?.value))]
          }
        })
      }

      let filteredData = []

      for (let result of uniqueResults) {
        console.log(result)
        const mastodonHandle = result.mastodon.value
        let accountLookup = null
        let score = null
        try {
          const response = await axios.get(`https://mastodon.social/api/v1/accounts/lookup?acct=${mastodonHandle}`, {
            timeout: 10000
          })
          accountLookup = response.data
          //score = await calculateMastodonAccountScore(mastodonHandle, accountLookup)
        } catch (error) {
          console.error(error)
        }
        filteredData.push({
          ...result,
          score,
          accountLookup
        })
        // slowing the requests down to avoid rate limiting https://mastodonpy.readthedocs.io/en/stable/01_general.html#:~:text=Mastodon's%20API%20rate%20limits%20per,and%20is%20subject%20to%20change.
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      filteredData = filteredData.sort((a, b) => b?.accountLookup?.followers_count - a?.accountLookup?.followers_count)

      let meta = {
        created_at: +new Date(),
        mastodonAccounts: filteredData.length,
        totalToots: filteredData.map(obj => obj.accountLookup?.statuses_count).filter(status_count => !!status_count).reduce((acc, statuses_count) => acc + statuses_count, 0),
        totalFollowers: filteredData.map(obj => obj.accountLookup?.followers_count).filter(followers_count => !!followers_count).reduce((acc, followers_count) => acc + followers_count, 0),
      }
      if (query.key == 'wissenschaftler_innen-de') {
        meta = {
          ...meta,
          doingsStats:
            [...new Set(filteredData.flatMap(obj => obj.doings))].map(doing => {
              return {
                doing,
                count: filteredData.filter(obj => obj.doings.includes(doing)).length
              }
            }
            ).sort((a, b) => b.count - a.count)

        }
      }
      const jsonData = JSON.stringify({
        meta,
        data: filteredData
      })
      writeFileSync(`./data/wikidata-mastodon-${query.key}.json`, jsonData);
      console.log('write json file', `./data/wikidata-mastodon-${query.key}.json`)
    }
  } catch (error) {
    console.error(error)
  }
}

main()