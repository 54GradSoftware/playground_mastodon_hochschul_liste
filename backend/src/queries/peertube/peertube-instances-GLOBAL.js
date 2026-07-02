import { institutionFilterClause } from './institution-types.js'

// PeerTube instances (Wikidata property P14256 "PeerTube instance URL") that are run by a
// public / scientific institution. Global — institution filter via P31/P279* (+ allow-list).
// Mirrors the Mastodon instances list (hochschulen-mastodon-instance-GLOBAL).
export default {
  key: 'peertube-instances-GLOBAL',
  type: 'instances',
  platform: 'peertube',
  addressVar: 'peertube',
  isOrganisations: true,
  sparqlQuery: `SELECT DISTINCT ?item ?itemLabel ?peertube ?countryName ?coordinates WHERE {
  ?item wdt:P14256 ?peertube.
  ${institutionFilterClause()}
  OPTIONAL { ?item wdt:P17 ?country. }
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de, en".
    ?item rdfs:label ?itemLabel.
    ?country rdfs:label ?countryName.
  }
}`
}
