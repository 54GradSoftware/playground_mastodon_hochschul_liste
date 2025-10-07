export default {
    key: 'bundesbehoerden-DE',
    type: 'accounts',
    sparqlQuery: `
SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
  {
    ?item wdt:P31/wdt:P279* wd:Q99934885;
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q99935030;
      wdt:P17 wd:Q183.
  } 
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q314024;
  }  
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}
`
}