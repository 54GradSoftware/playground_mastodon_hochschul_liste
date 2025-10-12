export default {
    key: 'non-profit-organisationen-DE',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `
SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
{
  ?item wdt:P31/wdt:P279* wd:Q163740;
    wdt:P17 wd:Q183.
}
?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}`
  }