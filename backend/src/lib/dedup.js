
export const dedupeByAddress = (results, addressVar = 'mastodon') =>
  results.filter(
    (obj1, i, arr) =>
      arr.findIndex(
        (obj2) => obj2[addressVar]?.value?.toLowerCase() === obj1[addressVar]?.value?.toLowerCase()
      ) === i
  )
