export const getCurrentKey = () => {
  const queryString = window.location.search;
  if (queryString === '' || queryString.includes('=hochschulen-de')) {
    return 'hochschulen-de'
  } else if (queryString.includes('=institute-de')) {
    return 'institute-de'
  } else if (queryString.includes('=wissenschaftler_innen-de')) {
    return 'wissenschaftler_innen-de'
  } else if (queryString.includes('=staedte-und-gemeinden-DE')) {
    return 'staedte-und-gemeinden-DE'
  } else if (queryString.includes('=kreise-DE')) {
    return 'kreise-DE'
  } else {
    return null
  }
}

export const formatDate = (date) => {
  return new Date(date).toLocaleString('de-DE', {
    year: "numeric", month: "2-digit",
    day: "2-digit"
  })
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number)
}

export const formatBoolean = (value) => {
  return  value === true ? 'Ja' : 'Nein'
}