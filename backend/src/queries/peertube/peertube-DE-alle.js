import { peertubeCountryList } from './country-template.js'

// All PeerTube channels/accounts of German entities (Q183) — without the institution
// type filter, i.e. every Wikidata item in Germany that has a PeerTube address (P12622).
export default peertubeCountryList({ key: 'peertube-DE-alle', countryQid: 'Q183', institutionsOnly: false })
