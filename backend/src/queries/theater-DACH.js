export default {
    key: 'theater-DACH',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `SELECT DISTINCT ?item ?itemLabel ?itemLabel_en ?mastodon ?countryName ?coordinates WHERE {
  {
    # Theaterhäuser, Opernhäuser, Opernkompagnien, Schiffs- und Freilichttheater (inkl. Unterklassen)
    ?item wdt:P31/wdt:P279* ?class .
    VALUES ?class { wd:Q24354 wd:Q153562 wd:Q20819922 wd:Q17149955 wd:Q11183017 }
  }
  UNION
  {
    # Theaterensembles (Stadt-, Staats- und Landestheater sind meist so getaggt)
    ?item wdt:P31 wd:Q742421 .
  }
  ?item wdt:P4033 ?mastodon;
    wdt:P17 ?country.
  VALUES ?country { wd:Q183 wd:Q39 wd:Q40 } # DE, CH, AT
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "de") }
  OPTIONAL { ?item rdfs:label ?itemLabel_en. FILTER(LANG(?itemLabel_en) = "en") }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de,en".
    ?country rdfs:label ?countryName.
  }
}
  `
  }
