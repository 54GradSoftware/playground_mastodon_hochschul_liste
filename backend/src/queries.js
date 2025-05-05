export const queries = [
  // spaqrl query to get all schools of applied sciene and universities in Germany if they have a mastodon handle
  
  {
    key: 'hochschulen-de',
    sparqlQuery: `
SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
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
  OPTIONAL { ?item wdt:P625 ?coordinates. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}`
  },
  {
    key: 'institute-de',
    // sparql query to get all research institutes in Germany if they have a mastodon handle
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
  },
  {
    key: 'wissenschaftler_innen-de',
    sparqlQuery: `SELECT ?item ?itemName ?mastodon ?doingName WHERE {
  {
    ?item wdt:P106/wdt:P279* wd:Q901.
    ?item wdt:P1412/wdt:P279* wd:Q188;
  }
  UNION
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
  },
  // Städte und Gemeinden in Deutschland - Verwaltungseinheit vierter Ebene
  {
    key: 'staedte-und-gemeinden-DE',
    sparqlQuery: `
SELECT ?item ?itemLabel ?mastodon ?coordinates WHERE {
{
  ?item wdt:P31/wdt:P279* wd:Q262166;
    wdt:P17 wd:Q183.
}
?item wdt:P4033 ?mastodon.
OPTIONAL { ?item wdt:P625 ?coordinates. }
SERVICE wikibase:label { bd:serviceParam wikibase:language "de, en". }
}`
  },
  // (Land-)Kreise und Kreisfreie Städe in Deutschland - Verwaltungseinheit dritter Ebene
  {
    key: 'kreise-DE',
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
  },
]


