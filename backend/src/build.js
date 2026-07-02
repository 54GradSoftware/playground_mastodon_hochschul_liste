import { queries } from './queries.js'
import { fetchWikidataBindings } from './lib/wikidata-client.js'
import { dedupeByAddress } from './lib/dedup.js'
import { buildMeta } from './lib/meta.js'
import { writeListFile } from './lib/write-data.js'
import { sleep } from './lib/sleep.js'
import { createHostThrottle } from './lib/rate-limiter.js'
import { enrichMastodonAccount } from './platforms/mastodon/enrich-account.js'
import { enrichMastodonInstance } from './platforms/mastodon/enrich-instance.js'
import { enrichPeerTubeChannel } from './platforms/peertube/enrich-channel.js'
import { enrichPeerTubeInstance } from './platforms/peertube/enrich-instance.js'

const MASTODON_REQUEST_DELAY_MS = 1_200
const BETWEEN_QUERY_DELAY_MS = 4_000

const platformOf = (query) => query.platform || 'mastodon'
const addressVarOf = (query) => query.addressVar || 'mastodon'

// "wissenschaftler_innen-de" doings special case.
const getUniqueResults = async (query) => {
  const addressVar = addressVarOf(query)

  if (query.sparqlQuery1) {
    const a = await fetchWikidataBindings(query.key, query.sparqlQuery1)
    const b = await fetchWikidataBindings(query.key, query.sparqlQuery2)
    return dedupeByAddress([...a, ...b], addressVar)
  }

  const raw = await fetchWikidataBindings(query.key, query.sparqlQuery)
  let unique = dedupeByAddress(raw, addressVar)

  if (query.key === 'wissenschaftler_innen-de') {
    unique = unique.map((result) => ({
      ...result,
      doings: [
        ...new Set(
          raw
            .filter((obj) => obj?.item?.value === result?.item?.value)
            .map((obj) => obj?.doingName?.value)
        )
      ]
    }))
  }

  return unique
}

// Enrich a single Wikidata result with live data from the relevant platform.
const enrichResult = (query, result, ctx) => {
  if (platformOf(query) === 'peertube') {
    return query.type === 'instances'
      ? enrichPeerTubeInstance(result, { throttle: ctx.peertubeThrottle })
      : enrichPeerTubeChannel(result, { throttle: ctx.peertubeThrottle })
  }
  if (query.type === 'instances') return enrichMastodonInstance(result)
  if (query.type === 'accounts') return enrichMastodonAccount(result)
  return Promise.resolve(null)
}

// Sort each list by its most meaningful "size" metric.
const sortResults = (data, query) => {
  if (platformOf(query) === 'peertube' && query.type === 'instances') {
    return data.sort(
      (a, b) => (b?.instanceLookup?.totalLocalVideos || 0) - (a?.instanceLookup?.totalLocalVideos || 0)
    )
  }
  if (platformOf(query) === 'peertube') {
    return data.sort(
      (a, b) => (b?.channelLookup?.followersCount || 0) - (a?.channelLookup?.followersCount || 0)
    )
  }
  return data.sort(
    (a, b) => (b?.accountLookup?.followers_count || 0) - (a?.accountLookup?.followers_count || 0)
  )
}

/**
 * Run the data pipeline.
 * @param {object} options
 * @param {string|null} options.only     Run only the query with this key.
 * @param {string|null} options.platform Run only queries for this platform ('mastodon' | 'peertube').
 * @param {boolean} options.dryRun       Fetch & enrich, but don't write files.
 */
export const build = async ({ only = null, platform = null, dryRun = false } = {}) => {
  let selected = queries
  if (platform) selected = selected.filter((query) => platformOf(query) === platform)
  if (only) selected = selected.filter((query) => query.key === only)

  console.log('Queries to run:', selected.map((query) => query.key).join(', ') || '(none)')

  let allOrganisations = []

  for (const [queryIndex, query] of selected.entries()) {
    if (queryIndex > 0) await sleep(BETWEEN_QUERY_DELAY_MS)
    console.log('Running query:', query.key)

    const queryPlatform = platformOf(query)
    const peertubeThrottle = createHostThrottle({ minDelayMs: 1_000, jitterMs: 250 })

    const uniqueResults = await getUniqueResults(query)
    const filteredData = []

    for (const result of uniqueResults) {
      try {
        const enriched = await enrichResult(query, result, { peertubeThrottle })
        if (enriched) filteredData.push(enriched)
      } catch (error) {
        console.error(`Error processing result in list ${query.key}:`, error)
      }
      if (queryPlatform === 'mastodon') await sleep(MASTODON_REQUEST_DELAY_MS)
    }

    sortResults(filteredData, query)
    const meta = buildMeta(filteredData, {
      platform: queryPlatform,
      type: query.type,
      isOrganisations: query.isOrganisations
    })

    // Aggregate DACH organisations into the combined "all-organisations" list (Mastodon only).
    if (
      queryPlatform === 'mastodon' &&
      query.isOrganisations &&
      query.type !== 'instances' &&
      query.country !== 'NL'
    ) {
      allOrganisations = [...allOrganisations, ...filteredData]
    }

    if (filteredData.length === 0) {
      console.error('skip write, no data:', query.key)
      continue
    }
    if (dryRun) {
      console.log(`[dry-run] would write ${filteredData.length} entries for ${query.key}`)
      continue
    }
    writeListFile(queryPlatform, query.key, { meta, data: filteredData })
  }

  // Rebuild the combined organisations file only on a full Mastodon run.
  if (!only && (!platform || platform === 'mastodon')) {
    allOrganisations = sortResults(dedupeByAddress(allOrganisations, 'mastodon'), {
      platform: 'mastodon',
      type: 'accounts'
    })
    if (allOrganisations.length === 0) {
      console.error('skip write, no data: all-organisations')
    } else if (dryRun) {
      console.log(`[dry-run] would write ${allOrganisations.length} entries for all-organisations`)
    } else {
      writeListFile('mastodon', 'all-organisations', {
        meta: buildMeta(allOrganisations, { platform: 'mastodon', isOrganisations: true }),
        data: allOrganisations
      })
    }
  }
}
