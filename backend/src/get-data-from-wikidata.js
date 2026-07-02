import { build } from './build.js'

const parseArgs = (argv) => {
  const opts = { only: null, platform: null, dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--only') opts.only = argv[++i]
    else if (arg.startsWith('--only=')) opts.only = arg.slice('--only='.length)
    else if (arg === '--platform') opts.platform = argv[++i]
    else if (arg.startsWith('--platform=')) opts.platform = arg.slice('--platform='.length)
    else if (arg === '--dry-run') opts.dryRun = true
  }
  return opts
}

const options = parseArgs(process.argv.slice(2))
console.log('Starting to fetch data from Wikidata...', options)

build(options).catch((error) => {
  console.error('Unhandled error in main:', error)
  process.exit(1)
})
