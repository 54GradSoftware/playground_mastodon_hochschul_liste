import lists from './assets/lists.json'

export const getCurrentList = () => {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const listQuery = params.get('liste');
  console.log('list', listQuery)
  if (listQuery === null) {
    return lists[0]
  }
  return lists.find((list) => list.key === listQuery)
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