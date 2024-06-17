<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import wikidata from '../../public/wikidata-mastodon-hochschulen-de.json'

const tableData = wikidata.data.map((item) => {
  return {
    name: item.itemLabel.value,
    mastodon: item.mastodon.value,
    item: item.item.value,
  };
});

</script>
<template>
  <div class="card">
    <h1>Liste Mastodon Accounts Hochschulen und Universitäten</h1>
    <p>Erstellt am: {{ new Date(wikidata.meta.created_at).toLocaleString('de-DE', { year: "numeric", month: "2-digit", day: "2-digit" }) }}</p>
    <p>Liste von Mastodon Accounts von allen deutschen Hochschulen und Universitäten. Die Daten stammen aus Wikidata. Es
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
    <p><a href="/wikidata-mastodon-hochschulen-de.json">Formatierte Datenquelle im JSON Format</a></p>
  </div>

</template>