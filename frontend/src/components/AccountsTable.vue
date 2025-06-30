<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Image from 'primevue/image';
import MastodonLink from './MastodonLink.vue';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { getCurrentList, formatDate, formatNumber, formatBoolean } from '../helper.js'
import { FilterMatchMode } from 'primevue/api';


const filters = ref();
const selectedList = ref(getCurrentList());

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  metaData: {
    type: Object,
    required: false,
  },
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

initFilters();
const clearFilter = () => {
  initFilters();
};

</script>
<template>
  <DataTable :value="data" stripedRows="" paginator :rows="50" :rowsPerPageOptions="[25, 50, 100, 250]"
    v-model:filters="filters">
    <template #header>
      <div class="flex justify-content-between">
        <div>
          <Button v-if="!!filters['global'].value" type="button" icon="pi pi-filter-slash" label="Suche zurücksetzen"
            outlined @click="clearFilter()" />
        </div>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Suche" aria-label="Suche" />
          </IconField>
        </div>
      </div>
    </template>
    <Column field="avatar" header="Profilbild">
      <template #body="slotProps">
        <Image :alt="'Profilbild von ' + slotProps.data.name" :src="`${slotProps.data?.accountLookup?.avatar_static}`"
          width="85" height="85" />
      </template>
    </Column>
    <Column field="filerNmame" header="Name" sortable>
      <template #body="slotProps">
        {{ slotProps.data.name }}
        <div v-if="slotProps.data.doings">
          <Tag style="transform: scale(1.2)" class="m-3 cursor-pointer	" severity="secondary" value="Secondary"
            v-for="doing in slotProps.data.doings" :key="doing" @click="filters['global'].value = doing">{{ doing
            }}</Tag>
        </div>
      </template>
    </Column>
    <Column field="mastodon" header="Mastodon" sortable>
      <template #body="slotProps">
        <MastodonLink :mastodonHandle="slotProps.data.mastodon" />
      </template>
    </Column>
    <Column v-if="selectedList.key === 'museum-DACH'" field="countryName" header="Land" sortable />
    <!--
          <Column field="score" header="Score" sortable>
            <template #body="slotProps">
              {{ slotProps.data.score }}
            </template>
          </Column>
          -->
    <Column field="accountLookup.followers_count" header="Follower" sortable="">
      <template #body="slotProps">
        {{ formatNumber(slotProps.data?.accountLookup?.followers_count) }}
      </template>
    </Column>
    <Column field="accountLookup.statuses_count" header="Toots" sortable="">
      <template #body="slotProps">
        {{ formatNumber(slotProps.data?.accountLookup?.statuses_count) }}
      </template>
    </Column>
    <Column field="accountLookup.last_status_at" header="Letzter Toot" sortable="">
      <template #body="slotProps">

        <span v-if="!!slotProps.data?.accountLookup?.last_status_at">
          {{ formatDate(slotProps.data?.accountLookup?.last_status_at) }}
        </span>
      </template>
    </Column>
    <Column field="accountLookup.created_at" header="Erstellt" sortable="">

      <template #body="slotProps">
        {{ formatDate(slotProps.data?.accountLookup?.created_at) }}
      </template>
    </Column>
    <Column field="verified" header="Verifiziert">
      <template #body="slotProps">
        {{ formatBoolean(slotProps.data?.verified) }}
      </template>
    </Column>
    <Column field="wikidata" header="Wikidata">
      <template #body="slotProps">
        <a target="_blank" :href="slotProps.data.item">
          {{ slotProps.data.item }}
        </a>
      </template>
    </Column>
    <template #empty> Es können keine Daten angezeigt werden. </template>
  </DataTable>
  <template v-if="metaData?.doingsStats">
        <p>Folgende Tätigkeiten wurden von 5 oder mehr Forscher*innen geteilt:</p>
        <Tag style="transform: scale(1.5)" class="mx-6 my-3 cursor-pointer" severity="secondary" value="Secondary"
          v-for="doing in metaData?.doingsStats.filter(doing => doing.count > 5)" :key="doing"
          @click="filters['global'].value = doing.doing">{{ doing.doing }} ({{ doing.count }})</Tag>.
        <p>Tipp: In der Suche kann auch nach Aktivität gefiltert werden, alternativ in dieser Liste auf eine Aktivität
          klicken.</p>
      </template>
</template>