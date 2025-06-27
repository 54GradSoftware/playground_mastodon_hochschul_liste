export default {
    key: 'wissenschaftler_innen-de',
    sparqlQuery1: `SELECT ?item ?itemName ?mastodon ?doingName WHERE {
  {
    ?item wdt:P106/wdt:P279* wd:Q901.
    ?item wdt:P1412/wdt:P279* wd:Q188;
  }
  ?item wdt:P4033 ?mastodon.
  ?item wdt:P106 ?doing.
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "de, en". 
    ?item rdfs:label ?itemName .
    ?doing rdfs:label ?doingName .
  }
}`,
    sparqlQuery1: `SELECT ?item ?itemName ?mastodon ?doingName WHERE {
  {
    ?item wdt:P106/wdt:P279* wd:Q1622272.
    ?item wdt:P1412/wdt:P279* wd:Q188;
  }
  ?item wdt:P4033 ?mastodon.
  ?item wdt:P106 ?doing.
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "de, en". 
    ?item rdfs:label ?itemName .
    ?doing rdfs:label ?doingName .
  }
}`
  }