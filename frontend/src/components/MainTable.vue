<script setup>
import { ref } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import Image from 'primevue/image';

const tableData = ref([]);
const metaData = ref({})
const loading = ref(false)

const loadData = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`${import.meta.env.VITE_DATA_SERVER_URL}`)
    tableData.value = data?.data?.map((item) => {
      return {
        name: item.itemLabel.value,
        mastodon: item.mastodon.value,
        item: item.item.value,
        accountStatus: item.accountStatus,
      };
    }).sort((a, b) => b?.accountStatus?.followers_count -  a?.accountStatus?.followers_count);
    metaData.value = data?.meta
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
      <h1>Liste Mastodon Accounts Hochschulen und Universitäten</h1>
      <p>Erstellt am: {{formatDate(metaData?.created_at)}}</p>
      <p>Liste von <a href="#mastodon">Mastodon</a> Accounts von allen deutschen Hochschulen und Universitäten.
        Die Daten stammen von <a href="#wikidata">Wikidata</a>. Insgesamt gibt es  {{ tableData?.length }}  Accounts.
      </p>
      <div class="layout-main">
        <DataTable :value="tableData" stripedRows="">
          <Column field="avatar" header="Profilbild">
            <template #body="slotProps">
              <Image 
                :src="`${slotProps.data?.accountStatus?.avatar_static}`" width="85"/>
            </template>
          </Column>
          <Column field="name" header="Name" sortable />
          <Column field="mastodon" header="Mastodon" sortable>
            <template #body="slotProps">
              <a target="_blank"
                :href="`https://wikidata-externalid-url.toolforge.org/?p=4033&id=${slotProps.data.mastodon}`">
                {{ slotProps.data.mastodon }}
              </a>
            </template>
          </Column>
          <Column field="follower" header="Follower" sortable="">
            <template #body="slotProps">
              {{formatNumber(slotProps.data?.accountStatus?.followers_count)}}
            </template>
          </Column>
          <Column field="toots" header="Toots" sortable="">
            <template #body="slotProps">
              {{formatNumber(slotProps.data?.accountStatus?.statuses_count)}}
            </template>
          </Column>
          <Column field="last_status_at" header="Letzter Toot" sortable="">
            <template #body="slotProps">

              <span v-if="!!slotProps.data?.accountStatus?.last_status_at">
              {{formatDate(slotProps.data?.accountStatus?.last_status_at)}}
              </span>
            </template>
          </Column>
          <Column field="created_at" header="Erstellt" sortable="">

            <template #body="slotProps">
                {{formatDate(slotProps.data?.accountStatus?.created_at)}}
            </template>
          </Column>
          <Column field="verified" header="Verifiziert" sortable="">
            <template #body="slotProps">
              {{slotProps.data?.accountStatus?.fields.find(field=>!!field.verified_at) ? 'Ja' : 'Nein'}}
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
      <p><a :href="`import.meta.env.VITE_DATA_SERVER_URL`">Formatierte Datenquelle im JSON Format</a>. Das letzte mal
        wurden
        die Daten aktualisiert: {{ new Date(metaData?.created_at).toLocaleString('de-DE') }}</p>
    </template>
  </div>

</template>