export default {
    key: 'bibliotheken-DE',
    type: 'accounts',
    isOrganisations: true,
    country: 'DE',
    sparqlQuery: `
SELECT ?item ?itemLabel ?itemLabel_en ?mastodon ?coordinates ?population WHERE {
  {
    ?item wdt:P31/wdt:P279* wd:Q28564;
      wdt:P17 wd:Q183.
  }
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  OPTIONAL { ?item wdt:P1082 ?population. }
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "de") }
  OPTIONAL { ?item rdfs:label ?itemLabel_en. FILTER(LANG(?itemLabel_en) = "en") }
}
`
}
