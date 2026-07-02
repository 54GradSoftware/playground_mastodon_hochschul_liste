import axios from 'axios'
import { calculateMastodonAccountScore } from 'mastodon-account-checker'

export const enrichMastodonAccount = async (result) => {
  const mastodonHandle = result.mastodon.value
  try {
    const response = await axios.get(
      `https://mastodon.social/api/v1/accounts/lookup?acct=${mastodonHandle}`,
      { timeout: 15_000 }
    )
    const accountLookup = response.data
    let score = null
    if (accountLookup) {
      try {
        score = await calculateMastodonAccountScore(mastodonHandle, accountLookup)
      } catch (error) {
        console.error(`Error calculating score for ${mastodonHandle}:`, error.message)
      }
    }
    return { ...result, score, accountLookup }
  } catch (error) {
    console.error(`Error looking up account ${mastodonHandle}:`, error.message)
    return null
  }
}
