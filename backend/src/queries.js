import hochschulenDE from './queries/hochschulen-DE.js'
import instituteDE from './queries/institute-DE.js'
import staedteUndGemeindenDE from './queries/staedte-und-gemeinden-DE.js'
import kreiseDE from './queries/kreise-DE.js'
import nonProfitOrganisationenDE from './queries/non-profit-organisationen-DE.js'
import museumDACH from './queries/museum-DACH.js'
import wissenschatlerInnenDe from './queries/wissenschaftler_innen-de.js'

export const queries = [
  // Hochschulen und Universitäten in Deutschland
  hochschulenDE,
  // Forschungseinrichtungen und Institute in Deutschland
  instituteDE,
  // Städte und Gemeinden in Deutschland - Verwaltungseinheit vierter Ebene
  staedteUndGemeindenDE ,
  // (Land-)Kreise und Kreisfreie Städe in Deutschland - Verwaltungseinheit dritter Ebene
  kreiseDE,
  // Non-Profit-Organisationen in Deutschland
  nonProfitOrganisationenDE,
  // Museen in Deutschland, Österreich und der Schweiz
  museumDACH,
  // Wissenschaftler:innen die auch deutsch Sprechen
  wissenschatlerInnenDe,
]


