export default {
    key: 'stiftungen-DE',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `SELECT ?item ?itemLabel ?itemLabel_en ?itemLabel_nl ?mastodon ?coordinates WHERE {
  {
    ?item wdt:P31/wdt:P279* wd:Q157031;
      wdt:P17 wd:Q183.
  }
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "de") }
  OPTIONAL { ?item rdfs:label ?itemLabel_en. FILTER(LANG(?itemLabel_en) = "en") }
}
  `
  }