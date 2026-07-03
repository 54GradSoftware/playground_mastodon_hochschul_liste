import { institutionFilterClause } from './institution-types.js'

export const peertubeCountryQuery = (countryQid = null, { institutionsOnly = true } = {}) => {
  const typePattern = institutionsOnly ? institutionFilterClause() : ''
  const countryPattern = countryQid
    ? `?item wdt:P17 ?country.\n  FILTER(?country = wd:${countryQid})`
    : `OPTIONAL { ?item wdt:P17 ?country. }`
  return `SELECT DISTINCT ?item ?itemLabel ?peertube ?countryName ?coordinates WHERE {
  hint:Query hint:optimizer "None".
  ?item wdt:P12622 ?peertube.
  ${countryPattern}
  ${typePattern}
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de, en".
    ?item rdfs:label ?itemLabel.
    ?country rdfs:label ?countryName.
  }
}`
}

export const peertubeCountryList = ({ key, countryQid = null, institutionsOnly = true }) => ({
  key,
  type: 'peertube',
  platform: 'peertube',
  addressVar: 'peertube',
  isOrganisations: true,
  sparqlQuery: peertubeCountryQuery(countryQid, { institutionsOnly })
})
