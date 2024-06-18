<script setup>
import { ref } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

const tableData = ref([]);
const metaData = ref({})
const loading = ref(false)

const loadData = async () => {
  try {
    loading.value = true
    const { data } = await axios.get('http://localhost:3002/')
    tableData.value = data.data.map((item) => {
      return {
        name: item.itemLabel.value,
        mastodon: item.mastodon.value,
        item: item.item.value,
      };
    });
    metaData.value = data.meta
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false

  }

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
      <p>Erstellt am: {{ new Date(metaData.created_at).toLocaleString('de-DE', {
      year: "numeric", month: "2-digit",
      day: "2-digit"
    }) }}</p>
      <p>Liste von Mastodon Accounts von allen deutschen Hochschulen und Universitäten. Die Daten stammen aus Wikidata.
        Es
        gibt insgesamt {{ tableData.length }} Accounts.</p>
      <div class="layout-main">
        <DataTable :value="tableData" stripedRows="">
          <Column field="name" header="Name" sortable />
          <Column field="mastodon" header="Mastodon" sortable>
            <template #body="slotProps">
              <a target="_blank"
                :href="`https://wikidata-externalid-url.toolforge.org/?p=4033&id=${slotProps.data.mastodon}`">
                {{ slotProps.data.mastodon }}
              </a>
            </template>
          </Column>
          <Column field="wikidata" header="Wikidata">
            <template #body="slotProps">
              <a target="_blank" :href="slotProps.data.item">
                {{ slotProps.data.item }}
              </a>
            </template>
          </Column>
        </DataTable>
      </div>
      <p><a href="/wikidata-mastodon-hochschulen-de.json">Formatierte Datenquelle im JSON Format</a>. Das letzte mal
        wurden
        die Daten aktualisiert: {{ new Date(metaData.created_at).toLocaleString('de-DE') }}</p>
    </template>
  </div>

</template>