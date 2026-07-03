import { WBK } from 'wikibase-sdk'
import axios from 'axios'
import { sleep } from './sleep.js'

// Make sure we initialize wbk with a sparqlEndpoint.
const wbk = WBK({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

// see https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy
const userAgent = {
  'User-Agent': 'MastodonListeBot/1.0 (https://mastodon-listen.playground.54gradsoftware.de/)'
}

// Exponential backoff for transient Wikidata errors (429 / 5xx / network).
const backoffs = [5_000, 15_000, 45_000]

// A short, human-readable label for the failure
const errorReason = (error) =>
  error.response?.status ??
  (error.code === 'ECONNABORTED' ? 'timeout' : error.code || 'network')

// The response body Wikidata sent back (e.g. a SPARQL parse/timeout message on 400/500),
// truncated. Empty string when there was no response (pure network failure).
const errorBody = (error) => {
  const data = error.response?.data
  if (data == null) return ''
  const text = typeof data === 'string' ? data : JSON.stringify(data)
  return text ? ` body=${text.slice(0, 500)}` : ''
}

export const fetchWikidataBindings = async (key, sparqlQuery) => {
  try {
    const url = wbk.sparqlQuery(sparqlQuery)
    let data
    for (let attempt = 0; attempt <= backoffs.length; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: 120_000,
          headers: {
            Accept: 'application/sparql-results+json',
            ...userAgent
          }
        })
        data = response.data
        break
      } catch (error) {
        const status = error.response?.status
        const retriable = status === 429 || (status >= 500 && status < 600) || !status
        if (!retriable || attempt === backoffs.length) throw error
        const retryAfter = parseInt(error.response?.headers?.['retry-after']) * 1000
        const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : backoffs[attempt]
        console.error(
          `Retry ${key} in ${wait}ms (${errorReason(error)}: ${error.message}, attempt ${
            attempt + 1
          })${errorBody(error)}`
        )
        await sleep(wait)
      }
    }
    return data.results.bindings
  } catch (error) {
    console.error(
      `Error fetching data for query ${key}: status=${errorReason(error)} message=${
        error.message
      }${errorBody(error)}`
    )
    return []
  }
}
