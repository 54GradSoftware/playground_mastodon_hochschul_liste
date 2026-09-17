export default {
    key: 'museum-EUROPA',
    type: 'accounts',
    isOrganisations: true,
    country: 'EUROPA', // nicht Teil des DACH-Aggregats "all-organisations"
    sparqlQuery: `SELECT DISTINCT ?item ?itemLabel ?itemLabel_en ?itemLabel_local ?mastodon ?countryName ?countryName_en ?coordinates WHERE {
  {
    # Museen inkl. Unterklassen (Kunst-, Technik-, Freilicht-, Naturkundemuseen, ...)
    ?item wdt:P31/wdt:P279* wd:Q33506 .
  }
  UNION
  {
    # Gedenkstätten, die in Wikidata nicht als Museum modelliert sind
    ?item wdt:P31/wdt:P279* wd:Q5003624 .
  }
  ?item wdt:P4033 ?mastodon;
    wdt:P17 ?country.
  # Land liegt (auch) in Europa - schließt Nicht-EU-Länder wie UK, CH und NO mit ein
  ?country wdt:P30 wd:Q46.
  # Historische Staaten aussortieren, z.B. "NS-Staat" als Land von Gedenkstätten
  FILTER NOT EXISTS { ?country wdt:P576 ?countryDissolved. }
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "de") }
  OPTIONAL { ?item rdfs:label ?itemLabel_en. FILTER(LANG(?itemLabel_en) = "en") }
  OPTIONAL { ?country rdfs:label ?countryName. FILTER(LANG(?countryName) = "de") }
  OPTIONAL { ?country rdfs:label ?countryName_en. FILTER(LANG(?countryName_en) = "en") }
  # Landessprachliches Label als Rückfalloption für Museen ohne deutsches oder englisches Label
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "de,en,fr,nl,it,es,pt,pl,cs,sk,sl,hr,sr,hu,ro,bg,el,da,sv,nb,fi,et,lv,lt,ga,mt,is,uk,tr,ca,eu,gl,lb,mul".
    ?item rdfs:label ?itemLabel_local.
  }
}
  `
  }
