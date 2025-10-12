export default {
    key: 'hochschulen-ACH',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `SELECT ?item ?itemLabel ?mastodon ?countryName ?coordinates WHERE {
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q3918;
      wdt:P17 wd:Q40.
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q3918;
      wdt:P17 wd:Q40.
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q3918;
      wdt:P17 wd:Q39.
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q3918;
      wdt:P17 wd:Q39.
  }
  ?item wdt:P4033 ?mastodon;
    wdt:P17 ?country.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de, en".
    ?item rdfs:label ?itemLabel.
    ?country rdfs:label ?countryName.
  }
}`
}