<script setup>
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const { locale } = useI18n()

const toggleLocale = () => {
  const newLocale = locale.value === 'de' ? 'en' : 'de'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  document.documentElement.lang = newLocale
}
</script>
<template>
  <Button
    :label="locale === 'de' ? 'EN' : 'DE'"
    icon="pi pi-globe"
    @click="toggleLocale"
    text
    style="font-weight: 600; color: var(--text-color)"
  />
</template>
