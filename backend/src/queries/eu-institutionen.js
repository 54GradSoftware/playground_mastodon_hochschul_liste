export default {
    key: 'eu-institutionen',
    type: 'accounts',
    isOrganisations: true,
    country: 'EU', // nicht Teil des DACH-Aggregats "all-organisations"
    sparqlQuery: `SELECT DISTINCT ?item ?itemLabel ?itemLabel_en ?mastodon ?coordinates WHERE {
  ?item wdt:P4033 ?mastodon.
  {
    # Teil der Europäischen Union (Organe, Generaldirektionen, ...)
    ?item wdt:P361 wd:Q458 .
  }
  UNION
  {
    # Organe/Einrichtungen der Europäischen Union (und Unterklassen)
    ?item wdt:P31/wdt:P279* wd:Q211004 .
  }
  UNION
  {
    # Zuständigkeitsbereich Europäische Union
    ?item wdt:P1001 wd:Q458 .
  }
  UNION
  {
    # Land/Zugehörigkeit Europäische Union
    ?item wdt:P17 wd:Q458 .
  }
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "de") }
  OPTIONAL { ?item rdfs:label ?itemLabel_en. FILTER(LANG(?itemLabel_en) = "en") }
}
  `
  }
