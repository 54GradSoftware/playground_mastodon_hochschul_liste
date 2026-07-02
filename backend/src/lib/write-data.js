import { writeFileSync } from 'fs'

export const dataFileName = (platform, key) => `wikidata-${platform}-${key}.json`

export const writeListFile = (platform, key, payload, { dataDir = './data' } = {}) => {
  const path = `${dataDir}/${dataFileName(platform, key)}`
  writeFileSync(path, JSON.stringify(payload))
  console.log('write json file', path)
}
