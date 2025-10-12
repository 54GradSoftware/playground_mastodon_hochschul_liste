export default {
    key: 'institute-DE',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `SELECT ?item ?itemLabel ?coordinates ?mastodon WHERE {
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
    OPTIONAL { ?item wdt:P625 ?coordinates. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
  }`
  } 