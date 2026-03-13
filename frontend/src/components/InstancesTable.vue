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

const props = defineProps({
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
          <Button v-if="!!filters['global'].value" type="button" icon="pi pi-filter-slash" :label="t('table.resetSearch')"
            outlined @click="clearFilter()" />
        </div>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" :placeholder="t('table.search')" :aria-label="t('table.search')" />
          </IconField>
        </div>
      </div>
    </template>
    <Column field="avatar" :header="t('table.avatar')">
      <template #body="slotProps">
        <Image :alt="t('table.avatarAlt', { name: slotProps.data.name })" :src="`${slotProps.data?.accountLookup?.avatar_static}`"
          width="85" height="85" />
      </template>
    </Column>
    <Column field="filerNmame" :header="t('table.name')" sortable>
      <template #body="slotProps">
        {{ slotProps.data.name }}
      </template>
    </Column>
    <Column field="mastodon" :header="t('table.mastodon')" sortable>
      <template #body="slotProps">
        <a target="_blank" :href="slotProps.data.mastodon">
          {{ slotProps.data.mastodon }}
        </a>
      </template>
    </Column>
    <Column field="countryName" :header="t('table.country')" sortable />
    <Column field="users_active_last_month" :header="t('table.activeAccounts')" sortable>
      <template #body="slotProps">
        {{ formatNumber(slotProps.data?.users_active_last_month) }}
      </template>
    </Column>
    <Column field="version" :header="t('table.version')">
      <template #body="slotProps">
        {{ slotProps.data?.version }}
      </template>
    </Column>
    <Column field="laguages" :header="t('table.languages')">
      <template #body="slotProps">
        {{ slotProps.data?.laguages.join(", ") }}
      </template>
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
