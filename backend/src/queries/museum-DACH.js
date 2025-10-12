export default {
    key: 'museum-DACH',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `SELECT ?item ?itemLabel ?mastodon ?countryName ?coordinates WHERE {
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q33506;
      wdt:P17 wd:Q183. #germany
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q33506;
      wdt:P17 wd:Q39. #switzerland
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q33506;
      wdt:P17 wd:Q40. #austria
  }
  ?item wdt:P4033 ?mastodon;
    wdt:P17 ?country.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de, en".
    ?item rdfs:label ?itemLabel.
    ?country rdfs:label ?countryName.
  }
}
  `
  }