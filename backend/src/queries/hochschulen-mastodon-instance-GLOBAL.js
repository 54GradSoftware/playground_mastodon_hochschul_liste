export default {
    key: 'hochschulen-mastodon-instance-GLOBAL',
    type: 'instances',
    isOrganisations: true,
    sparqlQuery: `SELECT ?item ?itemLabel ?mastodon ?coordinates ?countryName WHERE {
  { ?item (wdt:P31/(wdt:P279*)) wd:Q875538. }
  UNION
  { ?item (wdt:P31/(wdt:P279*)) wd:Q1365560. }
  ?item wdt:P11810 ?mastodon;
    wdt:P17 ?country.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de, en".
    ?country rdfs:label ?countryName.
    ?item rdfs:label ?itemLabel.
  }
}`
}