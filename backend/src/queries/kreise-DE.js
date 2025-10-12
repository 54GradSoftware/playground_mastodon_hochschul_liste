export default{
    key: 'kreise-DE',
    type: 'accounts',
    isOrganisations: true,
    sparqlQuery: `SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
  { ?item wdt:P31 wd:Q61856889. } # Kreis in Schleswig-Holstein
  UNION
  { ?item wdt:P31 wd:Q17302772. } # Landkreis in Sachsen-Anhalt
  UNION
  { ?item wdt:P31 wd:Q20738676. } # Landkreis in Baden-Württemberg
  UNION
  { ?item wdt:P31 wd:Q20738811. } # Kreis in Nordrhein-Westfalen
  UNION
  { ?item wdt:P31 wd:Q20738945. } # Landkreis in Thüringen
  UNION
  { ?item wdt:P31 wd:Q61708063. } # Landkreis in Sachsen
  UNION
  { ?item wdt:P31 wd:Q61793460. } # Landkreis in Brandenburg
  UNION
  { ?item wdt:P31 wd:Q61818979. } # Landkreis im Saarland
  UNION
  { ?item wdt:P31 wd:Q61980413. } # Landkreis in Hessen
  UNION
  { ?item wdt:P31 wd:Q85332736. } # Landkreis in Niedersachsen
  UNION
  { ?item wdt:P31 wd:Q85482556. } # Landkreis in Bayern
  UNION
  { ?item wdt:P31 wd:Q85483234. } # Landkreis in Mecklenburg-Vorpommern
  UNION
  { ?item wdt:P31 wd:Q85493040. } # Landkreis in Rheinland-Pfalz
  UNION
  { ?item wdt:P31 wd:Q2327515. } # Stadtkreis in Baden-Württemberg
  UNION
  { ?item wdt:P31 wd:Q61708053. } # kreisfreie Stadt in Sachsen-Anhalt
  UNION
  { ?item wdt:P31 wd:Q61708099. } # kreisfreie Stadt in Sachsen
  UNION
  { ?item wdt:P31 wd:Q61747322. } # kreisfreie Stadt in Thüringen
  UNION
  { ?item wdt:P31 wd:Q61856863. } # kreisfreie Stadt in Schleswig-Holstein
  UNION
  { ?item wdt:P31 wd:Q61793478. } # kreisfreie Stadt in Brandenburg
  UNION
  { ?item wdt:P31 wd:Q61980648. } # kreisfreie Stadt in Hessen
  UNION
  { ?item wdt:P31 wd:Q85631896. } # kreisfreie Stadt in Bayern
  UNION
  { ?item wdt:P31 wd:Q85632032. } # kreisfreie Stadt in Rheinland-Pfalz
  UNION
  { ?item wdt:P31 wd:Q85635301. } # kreisfreie Stadt in Mecklenburg-Vorpommern
  UNION
  { ?item wdt:P31 wd:Q85635630. } # kreisfreie Stadt in Nordrhein-Westfalen
  UNION
  { ?item wdt:P31 wd:Q85635638. } # kreisfreie Stadt in der Freien Hansestadt Bremen
  UNION
  { ?item wdt:P31 wd:Q85635929. } # kreisfreie Stadt in Niedersachsen	
  UNION
  { ?item wdt:P31 wd:Q821435. } # Berlin
  UNION
  { ?item wdt:P31 wd:Q278976. } # Hamburg
  UNION
  { ?item wdt:P31 wd:Q17278423. } # Bremen
  ?item wdt:P4033 ?mastodon.
  OPTIONAL { ?item wdt:P625 ?coordinates. }
SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}
`
  }