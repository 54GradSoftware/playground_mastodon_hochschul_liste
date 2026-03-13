import { createI18n } from 'vue-i18n'
import de from './de.json'
import en from './en.json'

const supportedLocales = ['de', 'en']

function detectLocale() {
  const saved = localStorage.getItem('locale')
  if (saved && supportedLocales.includes(saved)) return saved

  const browserLang = navigator.language?.split('-')[0]
  if (supportedLocales.includes(browserLang)) return browserLang

  return 'de'
}

const initialLocale = detectLocale()
document.documentElement.lang = initialLocale

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'de',
  messages: { de, en }
})

export default i18n
