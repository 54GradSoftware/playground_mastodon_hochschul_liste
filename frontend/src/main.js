import { createApp } from 'vue'
import { createPlausible } from 'v-plausible/vue'
import PrimeVue from 'primevue/config';
import i18n from './i18n'
import router from './router'
import App from './App.vue'



import 'primevue/resources/themes/aura-light-green/theme.css'
import '@/assets/styles.scss';
import 'primeicons/primeicons.css'

const app = createApp(App)
    .use(PrimeVue)
    .use(i18n)
    .use(router)
    if(import.meta.env.VITE_ENABLE_PLAUSIBLE_ANALYTICS === 'true'){
        const plausible = createPlausible({
            init: {
              domain: import.meta.env.VITE_PLAUSIBLE_ANALYTICS_DOMAIN,
              apiHost: 'https://plausible.io',
              trackLocalhost: false,
            },
            settings: {
              enableAutoOutboundTracking: false,
              enableAutoPageviews: true,
            },
            partytown: false,
          })

    app.use(plausible)
}
    app.mount('#app')
