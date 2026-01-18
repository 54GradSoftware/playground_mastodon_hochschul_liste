export default {
  key: 'schulen-DE',
  type: 'accounts',
  isOrganisations: true,
  sparqlQuery1: `SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
  {
    ?item wdt:P31 wd:Q322563; #Berufsschule
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q1542966; #Gymnasium
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q1469139; #kooperative Gesamtschule
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q99460855; #integrierte Gesamtschule
      wdt:P17 wd:Q183.
  }
  UNION
  {
    ?item wdt:P31/wdt:P279* wd:Q2134838; #Realschule plus
      wdt:P17 wd:Q183.
  }
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}`
}