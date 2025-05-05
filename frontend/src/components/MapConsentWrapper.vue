<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';

const consentLoadingMap = ref(localStorage.getItem("consentLoadingMap") || false)

const setConsentLoadingMap = (value) => {
    localStorage.setItem("consentLoadingMap", value)
    consentLoadingMap.value = value
}
</script>
<template>
<template v-if="!consentLoadingMap || consentLoadingMap === 'false'">
    <div class="consent-loading-map">
        <h2>Datenschutz</h2>
        <p>
            Die Kartensoftware wird vom externen Anbieter <a href="https://www.mapbox.com/" target="_blank">Mapbox Inc</a>. bereitgestellt. Es gilt die <a href="https://www.mapbox.com/legal/privacy" target="_blank">Datenschutzerklärung von Mapbox Inc</a>. Bei der Zustimmung zum Laden der Karten wird u.a. die IP-Adresse mit dem Anbieter geteilt.
        </p>
        <Button @click="setConsentLoadingMap(true)">Zustimmen und Karte anzeigen</Button>
    </div>
</template>
<template v-else>
    <slot/>
</template>
</template>