# Backend -> Wikidata -> Fediverse Server -> Fediverse Listen


## Befehle

```bash
npm run get-data           # alle Listen abrufen und nach ./data/ schreiben
npm run start-server       # Express Server
```

### Flags

```bash
# Nur PeerTube-Listen
node src/get-data-from-wikidata.js --platform peertube

# Nur eine bestimmte Liste
node src/get-data-from-wikidata.js --only peertube-DE

# Abrufen + anreichern, aber nichts schreiben (zum Prüfen)
node src/get-data-from-wikidata.js --only hochschulen-DE --dry-run

# Einen einzelnen PeerTube-Kanal/Account auflösen (gibt das normalisierte Objekt aus)
node src/platforms/peertube/enrich-channel.js eh_ludwigsburg@digitalcourage.video

# Eine einzelne PeerTube-Instanz auflösen
node src/platforms/peertube/enrich-instance.js https://grypstube.uni-greifswald.de
```
