export const queries = [
    // spaqrl query to get all schools of applied sciene and universities in Germany if they have a mastodon handle
    {
        key: 'hochschulen-de',
        sparqlQuery: `
SELECT ?item ?itemLabel ?mastodon WHERE {
  {
    ?item wdt:P31/wdt:P279* wd:Q875538;
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q1365560;
      wdt:P17 wd:Q183.
  }
  ?item wdt:P4033 ?mastodon.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}`
    },
    {
        key: 'institute-de',
        // sparql query to get all research institutes in Germany if they have a mastodon handle
        sparqlQuery: `SELECT ?item ?itemLabel ?mastodon WHERE {
    {
      ?item wdt:P31/wdt:P279* wd:Q31855;
        wdt:P17 wd:Q183.
    }
    UNION
    {
      ?item wdt:P31/wdt:P279* wd:Q31855;
        wdt:P17 wd:Q183.
    }
    ?item wdt:P4033 ?mastodon.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
  }`
    },
    {
        key: 'wissenschaftler_innen-de',
        sparqlQuery: `SELECT ?item ?itemName ?mastodon ?doingName WHERE {
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
}`
    }
]


