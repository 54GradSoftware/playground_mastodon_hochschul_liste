import { WBK } from 'wikibase-sdk'
import axios from 'axios'
import {writeFileSync} from 'fs'

// Make sure you initialize wbk with a sparqlEndpoint
const wbk = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
  })
const sparql = `
SELECT ?item ?itemLabel ?mastodon WHERE {
  {
    ?item wdt:P31 wd:Q875538;
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31 wd:Q1365560;
      wdt:P17 wd:Q183.
  }
  ?item wdt:P4033 ?mastodon.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}
    `
const url = wbk.sparqlQuery(sparql)
const headers = { 'User-Agent': '<FILL IN YOUR USER-AGENT INFORMATION>' }; // see https://meta.wikimedia.org/wiki/User-Agent_policy
// request the generated URL with your favorite HTTP request library
const main = async () => {
    try {
        const {data} = await axios.get(url, {
            headers: {
                'Accept': 'application/sparql-results+json'
            }
        })
        const uniqueResults = data.results.bindings.filter((obj1, i, arr) => 
            arr.findIndex(obj2 => (obj2.item.value === obj1.item.value)) === i
          )
        
          let filteredData = []

          for(let result of uniqueResults){
            console.log(result)
            const mastodonHandle = result.mastodon.value
            let accountStatus = null
            try{
              const response = await axios.get(`https://mastodon.social/api/v1/accounts/lookup?acct=${mastodonHandle}`)
              accountStatus = response.data
            }catch(error){
              console.error(error)
            }
            filteredData.push({
              ...result,
              accountStatus
            })
          }
        
        filteredData = filteredData.sort((a, b) => b?.accountStatus?.followers_count -  a?.accountStatus?.followers_count)

        const jsonData =  JSON.stringify({
          meta:{
            created_at: +new Date(),
          },
          data: filteredData
        })
        writeFileSync('./data/wikidata-mastodon-hochschulen-de.json',jsonData);
   
    } catch (error) {
        console.error(error)
    }
}

main()