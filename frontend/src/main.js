import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'

import 'primevue/resources/themes/aura-light-green/theme.css'
import '@/assets/styles.scss';

createApp(App)
    .use(PrimeVue)
    .mount('#app')