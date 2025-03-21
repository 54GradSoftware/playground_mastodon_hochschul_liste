<script setup>
import { ref } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Button from 'primevue/button';
import Image from 'primevue/image';
import Tag from 'primevue/tag';
import ExportCsv from './ExportCsv.vue';
import lists from '../assets/lists.json'
import { getCurrentKey } from '../helper.js'
import { FilterMatchMode } from 'primevue/api';

const tableData = ref([]);
const metaData = ref({})
const loading = ref(false)

const mastodonAccounts = ref("")
const selectedList = ref({})
const filters = ref();

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};

initFilters();
const clearFilter = () => {
  initFilters();
};

const loadData = async () => {
  try {
    loading.value = true
    let dataserverUrl = import.meta.env.VITE_DATA_SERVER_URL
    const currentKey = getCurrentKey()
    if (currentKey === null || currentKey === 'hochschulen-de') {
      selectedList.value = lists.find(list => list.key === 'hochschulen-de')
    } else if (currentKey === 'institute-de') {
      selectedList.value = lists.find(list => list.key === 'institute-de')
      dataserverUrl += "/institute-de"
    } else if (currentKey === 'wissenschaftler_innen-de') {
      selectedList.value = lists.find(list => list.key === 'wissenschaftler_innen-de')
      dataserverUrl += "/wissenschaftler_innen-de"
    } else {
      alert('Liste nicht gefunden')
    }
    const { data } = await axios.get(dataserverUrl)
    tableData.value = data?.data?.map((item) => {
      return {
        filerNmame: `${item?.itemLabel?.value || item.itemName.value} ${item?.doings?.join(" ")}`,
        name: `${item?.itemLabel?.value || item.itemName.value}`,
        mastodon: item.mastodon.value,
        item: item.item.value,
        accountStatus: item.accountStatus,
        doings: item?.doings,
      };
    }).sort((a, b) => b?.accountStatus?.followers_count - a?.accountStatus?.followers_count);
    metaData.value = data?.meta
    mastodonAccounts.value = tableData.value.map((item) => item.mastodon).join(" ")
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('de-DE', {
    year: "numeric", month: "2-digit",
    day: "2-digit"
  })
}
const formatNumber = (number) => {
  return new Intl.NumberFormat('de-DE').format(number)
}
loadData()
</script>
<template>
  <div class="card">
    <div v-if="loading">
      <div class="flex justify-content-center">
        <ProgressSpinner />
      </div>
      <div class="text-center">Daten werden geladen.</div>
    </div>
    <template v-else>
      <div class="grid">
        <div class="col-12 md:col-8">
          <h1 class="mb-1">Liste Mastodon Accounts</h1>
          <h2 class="mt-1 text-grey">{{ selectedList?.subTitle }}</h2>
        </div>
        <div class="col-12  md:col-4 flex justify-content-end">
          <ExportCsv :tableData="tableData" :name="getCurrentKey()" :subTitle="selectedList?.subTitle"/>
        </div>
      </div>
      <p>Erstellt am: {{ formatDate(metaData?.created_at) }}</p>
      <p>Liste der <a href="#mastodon">Mastodon</a> Accounts aller {{ selectedList?.subTitle }}.
        Die Daten stammen von <a href="#wikidata">Wikidata</a>. Insgesamt gibt es {{ tableData?.length }} Accounts <span
        v-if="metaData.totalToots">mit insgesamt {{ formatNumber(metaData.totalToots) }} Toots</span><span
        v-if="metaData.totalFollowers">und insgesamt {{ formatNumber(metaData.totalFollowers) }} Follower</span>.
      </p>
      <div class="layout-main">
        <DataTable :value="tableData" stripedRows="" paginator :rows="50" :rowsPerPageOptions="[25, 50, 100, 250]"
          v-model:filters="filters">
          <template #header>
            <div class="flex justify-content-between">
              <div>
                <Button v-if="!!filters['global'].value" type="button" icon="pi pi-filter-slash"
                  label="Suche zurücksetzen" outlined @click="clearFilter()" />
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
              <Image :alt="'Profilbild von ' + slotProps.data.name"
                :src="`${slotProps.data?.accountStatus?.avatar_static}`" width="85" height="85" />
            </template>
          </Column>
          <Column field="filerNmame" header="Name" sortable>
            <template #body="slotProps">
              {{ slotProps.data.name }}
              <div v-if="slotProps.data.doings">
                <Tag style="transform: scale(1.2)" class="m-3 cursor-pointer	" severity="secondary" value="Secondary"
                  v-for="doing in slotProps.data.doings" :key="doing"  @click="filters['global'].value = doing">{{ doing }}</Tag>
              </div>
            </template>
          </Column>
          <Column field="mastodon" header="Mastodon" sortable>
            <template #body="slotProps">
              <a target="_blank"
                :href="`https://wikidata-externalid-url.toolforge.org/?p=4033&id=${slotProps.data.mastodon}`">
                {{ slotProps.data.mastodon }}
              </a>
            </template>
          </Column>
          <Column field="accountStatus.followers_count" header="Follower" sortable="">
            <template #body="slotProps">
              {{ formatNumber(slotProps.data?.accountStatus?.followers_count) }}
            </template>
          </Column>
          <Column field="accountStatus.statuses_count" header="Toots" sortable="">
            <template #body="slotProps">
              {{ formatNumber(slotProps.data?.accountStatus?.statuses_count) }}
            </template>
          </Column>
          <Column field="accountStatus.last_status_at" header="Letzter Toot" sortable="">
            <template #body="slotProps">

              <span v-if="!!slotProps.data?.accountStatus?.last_status_at">
                {{ formatDate(slotProps.data?.accountStatus?.last_status_at) }}
              </span>
            </template>
          </Column>
          <Column field="accountStatus.created_at" header="Erstellt" sortable="">

            <template #body="slotProps">
              {{ formatDate(slotProps.data?.accountStatus?.created_at) }}
            </template>
          </Column>
          <Column field="verified" header="Verifiziert">
            <template #body="slotProps">
              {{ slotProps.data?.accountStatus?.fields.find(field => !!field.verified_at) ? 'Ja' : 'Nein' }}
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
      </div>
      <p><a :href="dataserverUrl">Formatierte Datenquelle im JSON Format</a>. Das letzte mal
        wurden
        die Daten aktualisiert: {{ new Date(metaData?.created_at).toLocaleString('de-DE') }}</p>
      <template v-if="metaData?.doingsStats">
        <p>Folgende Tätigkeiten wurden von 5 oder mehr Forscher*innen geteilt:</p>
        <Tag style="transform: scale(1.5)" class="mx-6 my-3 cursor-pointer" severity="secondary" value="Secondary"
          v-for="doing in metaData?.doingsStats.filter(doing => doing.count > 5)" :key="doing"
          @click="filters['global'].value = doing.doing">{{ doing.doing }} ({{ doing.count }})</Tag>.
        <p>Tipp: In der Suche kann auch nach Aktivität gefiltert werden, alternativ in dieser Liste auf eine Aktivität
          klicken.</p>
      </template>
      <div class="flex flex-column gap-2">
        <label for="mastodonAccounts">Liste aller Mastodon Accounts zum kopieren</label>
        <InputText v-model="mastodonAccounts" readonly id="mastodonAccounts" />
      </div>

    </template>
  </div>

</template>
<style scoped>
.text-grey {
  color: grey;
}
</style>