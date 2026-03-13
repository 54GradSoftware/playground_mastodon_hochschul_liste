<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button';

const { t } = useI18n()
const consentLoadingMap = ref(localStorage.getItem("consentLoadingMap") || false)

const setConsentLoadingMap = (value) => {
    localStorage.setItem("consentLoadingMap", value)
    consentLoadingMap.value = value
}
</script>
<template>
<template v-if="!consentLoadingMap || consentLoadingMap === 'false'">
    <div class="consent-loading-map">
        <h2>{{ t('mapConsent.title') }}</h2>
        <p>
            <i18n-t keypath="mapConsent.description" tag="span">
                <template #mapboxLink>
                    <a href="https://www.mapbox.com/" target="_blank">Mapbox Inc</a>
                </template>
                <template #privacyLink>
                    <a href="https://www.mapbox.com/legal/privacy" target="_blank">{{ t('mapConsent.mapboxPrivacy') }}</a>
                </template>
            </i18n-t>
        </p>
        <Button @click="setConsentLoadingMap(true)">{{ t('mapConsent.consent') }}</Button>
    </div>
</template>
<template v-else>
    <slot/>
</template>
</template>
