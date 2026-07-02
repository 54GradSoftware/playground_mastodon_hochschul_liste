const sumBy = (data, fn) =>
  data
    .map(fn)
    .filter((n) => Number.isFinite(n))
    .reduce((acc, n) => acc + n, 0)

export const buildMeta = (data, { platform = 'mastodon', type = 'accounts', isOrganisations = true } = {}) => {
  if (platform === 'peertube' && type === 'instances') {
    return {
      created_at: Date.now(),
      // `mastodonAccounts` kept as a generic count field for frontend compatibility.
      mastodonAccounts: data.length,
      instances: data.length,
      totalVideos: sumBy(data, (o) => o.instanceLookup?.totalLocalVideos),
      totalUsers: sumBy(data, (o) => o.instanceLookup?.totalUsers)
    }
  }
  if (platform === 'peertube') {
    return {
      created_at: Date.now(),
      // `mastodonAccounts` kept as a generic count field for frontend compatibility.
      mastodonAccounts: data.length,
      channels: data.length,
      totalFollowers: sumBy(data, (o) => o.channelLookup?.followersCount),
      totalVideos: sumBy(data, (o) => o.channelLookup?.videosCount)
    }
  }

  let meta = {
    created_at: Date.now(),
    mastodonAccounts: data.length,
    totalPopulation: sumBy(data, (o) => parseInt(o.population?.value)),
    totalToots: sumBy(data, (o) => o.accountLookup?.statuses_count),
    totalFollowers: sumBy(data, (o) => o.accountLookup?.followers_count)
  }

  if (!isOrganisations) {
    meta = {
      ...meta,
      doingsStats: [...new Set(data.flatMap((o) => o.doings || []))]
        .map((doing) => ({
          doing,
          count: data.filter((o) => (o.doings || []).includes(doing)).length
        }))
        .sort((a, b) => b.count - a.count)
    }
  }

  return meta
}
