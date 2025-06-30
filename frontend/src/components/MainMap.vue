<script setup>
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { formatDate, formatNumber, formatBoolean } from '../helper.js'
import { getCurrentList } from '../helper.js'
import MastodonLink from './MastodonLink.vue';

const props = defineProps({
    mapCenter: {
        type: Array,
        default: () => [10.4541194, 51.1642292], // center of germany
    },
    mapZoom: {
        type: Number,
        default: 5,
    },
    data: {
        type: Array,
    }
});

const isMobile = () => { return /Mobi|Android/i.test(navigator.userAgent); };

const formatCoordinates = (coordinates) => {
    if (!coordinates) {
        return null;
    }
    if (coordinates.startsWith('Point')) {
        const coords = coordinates.slice(6, -1).split(' ');
        return [parseFloat(coords[0]), parseFloat(coords[1])];
    }
    return null;
};
</script>

<template>
    <MapboxMap style="height: 600px"
        access-token="pk.eyJ1Ijoic2JyYSIsImEiOiJjbG02ZjF6ZDgwbG1jM2VtbWZyNXkza2E3In0.lRf9QNEJKwhvuirQwPKFCA"
        map-style="mapbox://styles/mapbox/streets-v11" :center="mapCenter" :zoom="mapZoom"
        :cooperativeGestures="!isMobile()" :locale="{
            'ScrollZoomBlocker.CtrlMessage': 'Zum Vergrößern der Karte Strg + Scrollen verwenden.',
            'ScrollZoomBlocker.CmdMessage': 'Zum Vergrößern der Karte ⌘ + Scrollen verwenden.'
        }">
        <template v-for="entry in data" :key="entry.item">
            <MapboxMarker v-if="formatCoordinates(entry.coordinates)" :lng-lat="formatCoordinates(entry.coordinates)"
                popup color="lightblue">
                <template #popup>
                    <div class="mapbox-popup-content">
                        <h2>{{ entry.name }}</h2>
                        <ul>
                            <li><b>Mastodon: </b>
                                <template v-if="getCurrentList().type=== 'accounts'">
                                    <MastodonLink :mastodonHandle="entry.mastodon" />
                                </template>
                                <template v-else-if="getCurrentList().type=== 'instances'">
                                    <a target="_blank" :href="entry.mastodon">
                                                        {{ entry.mastodon }}
                                                        </a>
                                </template>
                            </li>
                            <li v-if="entry.accountLookup?.followers_count"><b>Follower: </b> {{
                                formatNumber(entry.accountLookup?.followers_count) }}</li>
                            <li v-if="entry.accountLookup?.statuses_coun"><b>Toots: </b> {{
                                formatNumber(entry.accountLookup?.statuses_count) }}</li>
                            <li v-if="entry.accountLookup?.last_status_at"><b>Letzter Toot: </b> {{
                                formatDate(entry.accountLookup?.last_status_at) }}</li>
                            <li v-if="entry.accountLookup?.created_at"><b>Erstellt: </b> {{
                                formatDate(entry.accountLookup?.created_at) }}</li>
                            <li v-if="entry.verified"><b>Verifiziert: </b> {{ formatBoolean(entry.verified) }}</li>
                            <li v-if="entry.users_active_last_month"><b>Aktive Accounts: </b> {{
                                formatNumber(entry.users_active_last_month) }}</li>
                        </ul>
                    </div>
                </template>
            </MapboxMarker>
        </template>
    </MapboxMap>
</template>

<style>
.mapboxgl-popup {
    max-width: 300px !important;
    overflow-wrap: break-word;
}

.mapbox-popup-content ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.mapbox-popup-content ul li {
    margin: 0;
}
</style>