export default {
    key: 'hochschulen-NL',
    type: 'accounts',
    isOrganisations: true,
    country: 'NL',
    sparqlQuery: `SELECT ?item ?itemLabel ?itemLabel_en ?itemLabel_nl ?mastodon ?coordinates WHERE {
  {
    ?item wdt:P31/wdt:P279* wd:Q875538;
      wdt:P17 wd:Q55.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q1365560;
      wdt:P17 wd:Q55.
  }
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "de") }
  OPTIONAL { ?item rdfs:label ?itemLabel_en. FILTER(LANG(?itemLabel_en) = "en") }
  OPTIONAL { ?item rdfs:label ?itemLabel_nl. FILTER(LANG(?itemLabel_nl) = "nl") }
}`
}
