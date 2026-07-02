import { readFile } from 'fs'
import express from 'express'
import cors from 'cors'
import { queries } from './queries.js'
import { dataFileName } from './lib/write-data.js'

// Map every list key to its platform so we can serve the right data file
// (wikidata-{platform}-{key}.json). "all-organisations" is a synthetic Mastodon aggregate.
const platformByKey = new Map(queries.map((query) => [query.key, query.platform || 'mastodon']))
platformByKey.set('all-organisations', 'mastodon')

const app = express()
app.options('*', cors())
app.use(cors())

app.get('/*', (req, res) => {
  const requestKey = req.url.split('/')[1]
  const platform = platformByKey.get(requestKey)
  if (!platform) {
    res.status(404).json({ error: 'Invalid key' })
    return
  }
  readFile(`./data/${dataFileName(platform, requestKey)}`, (err, json) => {
    if (err) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(JSON.parse(json))
  })
})

app.listen(process.env.PORT || 3002)
