<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
  <footer class="layout-footer grid">
    <div class="col-12 md:col-4">
      {{ t('footer.by') }} <span class="font-medium ml-2"><a href="https://54gradsoftware.de/" target="_blank">
          54 Grad Software GmbH
        </a>
      </span>
    </div>
    <div class="col-12 md:col-4">
      <a href="https://github.com/54GradSoftware/playground_mastodon_hochschul_liste">{{ t('footer.github') }}</a> | <a
        href="https://github.com/54GradSoftware/playground_mastodon_hochschul_liste/blob/main/LICENSE">{{ t('footer.license') }}</a>
    </div>
    <div class="col-12 md:col-4">
      <a href="https://www.54gradsoftware.de/impressum">{{ t('footer.imprint') }}</a> | <a
        href="https://www.54gradsoftware.de/datenschutz">{{ t('footer.privacy') }}</a>
    </div>
  </footer>
</template>
