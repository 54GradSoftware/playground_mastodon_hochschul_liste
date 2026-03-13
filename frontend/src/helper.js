import lists from './assets/lists.json'
import i18n from './i18n'

export const getCurrentList = (listeParam) => {
  if (!listeParam) {
    return lists[0]
  }
  return lists.find((list) => list.key === listeParam)
}

const getLocale = () => i18n.global.locale.value || 'de'

export const formatDate = (date) => {
  return new Date(date).toLocaleString(getLocale() === 'de' ? 'de-DE' : 'en-US', {
    year: "numeric", month: "2-digit",
    day: "2-digit"
  })
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat(getLocale() === 'de' ? 'de-DE' : 'en-US').format(number)
}

export const getLocalizedLabel = (item) => {
  const locale = getLocale()
  if (locale === 'en' && item?.itemLabel_en?.value) return item.itemLabel_en.value
  if (item?.itemLabel?.value) return item.itemLabel.value
  if (item?.itemLabel_en?.value) return item.itemLabel_en.value
  if (item?.itemLabel_nl?.value) return item.itemLabel_nl.value
  if (item?.itemName?.value) return item.itemName.value
  return ''
}

export const formatBoolean = (value) => {
  const t = i18n.global.t
  return value === true ? t('common.yes') : t('common.no')
}
