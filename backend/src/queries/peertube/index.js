import peertubeChannelsByCountry from './peertube-channels-by-country.js'
import peertubeDE from './peertube-DE.js'
import peertubeDEalle from './peertube-DE-alle.js'
import peertubeNL from './peertube-NL.js'
import peertubeAT from './peertube-AT.js'
import peertubeCH from './peertube-CH.js'
import peertubeInstancesGLOBAL from './peertube-instances-GLOBAL.js'

export const peertubeQueries = [
  // PeerTube-Kanäle öffentlicher Einrichtungen nach Ländern (weltweit)
  peertubeChannelsByCountry,
  // Öffentliche Einrichtungen pro Land (leere Listen werden automatisch übersprungen)
  peertubeDE,
  peertubeNL,
  peertubeAT,
  peertubeCH,
  // Alle PeerTube-Accounts pro Land (ohne Typ-Filter)
  peertubeDEalle,
  // PeerTube-Instanzen öffentlicher Einrichtungen (global)
  peertubeInstancesGLOBAL
]
