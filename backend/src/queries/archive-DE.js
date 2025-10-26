export default {
  key: 'archive-DE',
  type: 'accounts',
  isOrganisations: true,
  sparqlQuery: `SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q166118;
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q134401541;
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item (wdt:P31/(wdt:P279*)) wd:Q27032363;
      wdt:P17 wd:Q183.
  }
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}`
} 