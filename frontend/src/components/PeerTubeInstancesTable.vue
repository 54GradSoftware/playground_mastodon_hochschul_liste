<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Image from 'primevue/image';
import { formatNumber } from '../helper.js'
import { FilterMatchMode } from 'primevue/api';

const { t } = useI18n()
const filters = ref();

defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
initFilters();
const clearFilter = () => initFilters();

const fmt = (n) => (n != null ? formatNumber(n) : '-')
</script>
<template>
  <DataTable :value="data" stripedRows paginator :rows="50" :rowsPerPageOptions="[25, 50, 100, 250]"
    v-model:filters="filters">
    <template #header>
      <div class="flex justify-content-between">
        <div>
          <Button v-if="!!filters['global'].value" type="button" icon="pi pi-filter-slash"
            :label="t('table.resetSearch')" outlined @click="clearFilter()" />
        </div>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" :placeholder="t('table.search')"
              :aria-label="t('table.search')" />
          </IconField>
        </div>
      </div>
    </template>
    <Column field="avatar" :header="t('table.avatar')">
      <template #body="slotProps">
        <Image v-if="slotProps.data.avatar" :alt="t('table.avatarAlt', { name: slotProps.data.name })"
          :src="slotProps.data.avatar" width="85" height="85" />
      </template>
    </Column>
    <Column field="name" :header="t('table.name')" sortable />
    <Column field="peertube" :header="t('table.instance')" sortable>
      <template #body="slotProps">
        <a target="_blank" :href="slotProps.data.url || slotProps.data.peertube">
          {{ slotProps.data.peertube }}
        </a>
      </template>
    </Column>
    <Column field="countryName" :header="t('table.country')" sortable />
    <Column field="totalLocalVideos" :header="t('table.videos')" sortable>
      <template #body="slotProps">{{ fmt(slotProps.data.totalLocalVideos) }}</template>
    </Column>
    <Column field="totalUsers" :header="t('table.users')" sortable>
      <template #body="slotProps">{{ fmt(slotProps.data.totalUsers) }}</template>
    </Column>
    <Column field="totalChannels" :header="t('table.channels')" sortable>
      <template #body="slotProps">{{ fmt(slotProps.data.totalChannels) }}</template>
    </Column>
    <Column field="version" :header="t('table.version')">
      <template #body="slotProps">{{ slotProps.data.version }}</template>
    </Column>
    <Column field="wikidata" :header="t('table.wikidata')">
      <template #body="slotProps">
        <a target="_blank" :href="slotProps.data.item">
          {{ slotProps.data.item }}
        </a>
      </template>
    </Column>
    <template #empty> {{ t('table.noData') }} </template>
  </DataTable>
</template>
