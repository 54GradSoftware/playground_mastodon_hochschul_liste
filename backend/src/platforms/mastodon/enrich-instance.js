import axios from 'axios'

export const enrichMastodonInstance = async (result) => {
  let accountLookup
  try {
    let mastodonInstanceUrl = result.mastodon.value
    if (!mastodonInstanceUrl.endsWith('/')) {
      mastodonInstanceUrl = `${mastodonInstanceUrl}/`
    }
    const response = await axios.get(`${mastodonInstanceUrl}api/v2/instance`, {
      timeout: 25_000
    })
    accountLookup = response.data
  } catch (error) {
    console.error(`Error fetching instance ${result.mastodon.value}:`, error.message)
  }
  return { ...result, accountLookup }
}
