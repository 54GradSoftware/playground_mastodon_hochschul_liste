<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Image from 'primevue/image';
import MastodonLink from './MastodonLink.vue';
import ScoreExplainerDialog from './ScoreExplainerDialog.vue';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { getCurrentList, formatDate, formatNumber, formatBoolean } from '../helper.js'
import { FilterMatchMode } from 'primevue/api';


const filters = ref();
const selectedList = ref(getCurrentList());
const scoreDialogVisible = ref(false);
const selectedScore = ref(null);

const openScoreDialog = (score) => {
  selectedScore.value = score;
  scoreDialogVisible.value = true;
};

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

const statistics = computed(() => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const accountsWithScore = props.data.filter(item => {
    if (!item.scoreData?.values) return false;
    const lastStatusAt = item.accountLookup?.last_status_at;
    if (!lastStatusAt) return false;
    return new Date(lastStatusAt) >= oneYearAgo;
  });
  const total = accountsWithScore.length;

  if (total === 0) return null;

  const scoresSum = accountsWithScore.reduce((sum, item) => sum + (item.score || 0), 0);
  const averageScore = Math.round(scoresSum / total);

  const stats = {
    display_name: 0,
    note: 0,
    discoverable: 0,
    indexable: 0,
    verifiedFields: 0,
    featuredCollection: 0
  };

  accountsWithScore.forEach(item => {
    const values = item.scoreData?.values;
    if (values?.display_name) stats.display_name++;
    if (values?.note) stats.note++;
    if (values?.discoverable) stats.discoverable++;
    if (values?.indexable === true) stats.indexable++;
    if (values?.verifiedFields?.length > 0) stats.verifiedFields++;
    if (values?.featuredCollection?.length > 0) stats.featuredCollection++;
  });

  return {
    total,
    averageScore,
    display_name: { count: stats.display_name, percent: Math.round((stats.display_name / total) * 100) },
    note: { count: stats.note, percent: Math.round((stats.note / total) * 100) },
    discoverable: { count: stats.discoverable, percent: Math.round((stats.discoverable / total) * 100) },
    indexable: { count: stats.indexable, percent: Math.round((stats.indexable / total) * 100) },
    verifiedFields: { count: stats.verifiedFields, percent: Math.round((stats.verifiedFields / total) * 100) },
    featuredCollection: { count: stats.featuredCollection, percent: Math.round((stats.featuredCollection / total) * 100) }
  };
});
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
    <Column field="score" header="Score" sortable>
      <template #body="slotProps">
        <span v-if="slotProps.data.score !== undefined"
          style="cursor: pointer; text-decoration: underline; color: var(--p-primary-color);"
          @click="openScoreDialog(slotProps.data.scoreData)">
          {{ slotProps.data.score }}
        </span>
        <span v-else>-</span>
      </template>
    </Column>
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
  <ScoreExplainerDialog v-if="selectedScore" :result="selectedScore" v-model:visible="scoreDialogVisible" />

  <!-- Statistik-Auswertung -->
  <div v-if="statistics"
    style="margin-top: 2rem; padding: 1.5rem; background: var(--p-surface-100); border-radius: 8px;">
    <h3 style="margin: 0 0 1rem 0;">Statistik dieser Liste</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      <!-- Durchschnittlicher Score -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700; color: var(--p-primary-color);">{{ statistics.averageScore }}
        </div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Ø Score</div>
      </div>

      <!-- Anzeigename -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">{{ statistics.display_name.percent }}%</div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Anzeigename</div>
        <div style="font-size: 0.8rem; color: var(--p-text-muted-color);">{{ statistics.display_name.count }}/{{
          statistics.total }}</div>
      </div>

      <!-- Bio -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">{{ statistics.note.percent }}%</div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Profilbeschreibung</div>
        <div style="font-size: 0.8rem; color: var(--p-text-muted-color);">{{ statistics.note.count }}/{{
          statistics.total
        }}</div>
      </div>

      <!-- Discoverable -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">{{ statistics.discoverable.percent }}%</div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Auffindbar</div>
        <div style="font-size: 0.8rem; color: var(--p-text-muted-color);">{{ statistics.discoverable.count }}/{{
          statistics.total }}</div>
      </div>

      <!-- Indexable -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">{{ statistics.indexable.percent }}%</div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Indexierbar</div>
        <div style="font-size: 0.8rem; color: var(--p-text-muted-color);">{{ statistics.indexable.count }}/{{
          statistics.total }}</div>
      </div>

      <!-- Verifizierte Links -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">{{ statistics.verifiedFields.percent }}%</div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Verifizierte Links</div>
        <div style="font-size: 0.8rem; color: var(--p-text-muted-color);">{{ statistics.verifiedFields.count }}/{{
          statistics.total }}</div>
      </div>

      <!-- Angeheftete Beiträge -->
      <div style="background: var(--p-surface-0); padding: 1rem; border-radius: 6px; text-align: center;">
        <div style="font-size: 2rem; font-weight: 700;">{{ statistics.featuredCollection.percent }}%</div>
        <div style="color: var(--p-text-muted-color); font-size: 0.9rem;">Angeheftete Beiträge</div>
        <div style="font-size: 0.8rem; color: var(--p-text-muted-color);">{{ statistics.featuredCollection.count }}/{{
          statistics.total }}</div>
      </div>
    </div>

    <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--p-text-muted-color);">
      Die Statistik berücksichtigt nur Accounts, die innerhalb des letzten Jahres mindestens einen Toot veröffentlicht
      haben.
    </p>
  </div>
</template>