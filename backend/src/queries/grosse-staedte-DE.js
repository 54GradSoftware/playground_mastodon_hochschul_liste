export default {
    key: 'grosse-staedte-DE',
    type: 'hashtags',
    isOrganisations: true,
    sparqlQuery: `SELECT DISTINCT ?item ?itemLabel ?population WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
  {
    SELECT DISTINCT ?item ?population WHERE {
      ?item p:P31 ?statement0.
      ?statement0 (ps:P31/(wdt:P279*)) wd:Q42744322.
      ?item wdt:P1082 ?population.
        FILTER(?population >= 75000).
    }
    ORDER BY DESC(?population)
    LIMIT 150
  }
}
ORDER BY DESC(?population)`
}