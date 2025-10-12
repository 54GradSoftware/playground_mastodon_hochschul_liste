<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';
import ExportCsv from './ExportCsv.vue';
import { getCurrentList, formatDate, formatNumber } from '../helper.js'
import MainMap from './MainMap.vue';
import MapConsentWrapper from './MapConsentWrapper.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InstancesTables from './InstancesTable.vue';
import AccountsTable from './AccountsTable.vue';

const tableData = ref([]);
const metaData = ref({})
const loading = ref(false)

const mastodonAccounts = ref("")
const selectedList = ref({})
const selectedListType = ref('')
const showMapTab = ref(false)


const loadData = async () => {
  try {
    loading.value = true
    selectedList.value = getCurrentList()
    if (!selectedList.value) {
      alert("Liste nicht gefunden")
      return
    }
    selectedListType.value = selectedList.value.type === 'accounts' ? 'Accounts' : 'Instanzen';
    const { data } = await axios.get(`${import.meta.env.VITE_DATA_SERVER_URL}/${selectedList.value.key}`);
    if (selectedList.value.type === 'instances') {
      tableData.value = data?.data?.map((item) => {
        console.log(item)
        return {
          name: item?.itemLabel?.value,
          mastodon: item?.mastodon?.value,
          item: item.item.value,
          countryName: item?.countryName?.value,
          version: item?.accountLookup?.version,
          users_active_last_month: item?.accountLookup?.usage?.users?.active_month,
          laguages: item?.accountLookup?.languages,
          coordinates: item?.coordinates?.value,
          accountLookup: {
            avatar_static: item?.accountLookup?.contact?.account?.avatar_static,
          }
        }
      }).sort((a, b) => b?.users_active_last_month - a?.users_active_last_month);
    } else {
      tableData.value = data?.data?.map((item) => {
        return {
          filerNmame: `${item?.itemLabel?.value || item.itemName.value} ${item?.doings?.join(" ")}`,
          name: `${item?.itemLabel?.value || item.itemName.value}`,
          mastodon: item.mastodon.value,
          item: item.item.value,
          accountLookup: item.accountLookup,
          doings: item?.doings,
          score: item.score?.score,
          scoreData: item.score,
          coordinates: item?.coordinates?.value,
          verified: !!item.accountLookup?.fields?.find(field => !!field?.verified_at),
          countryName: item?.countryName?.value
        };
      }).sort((a, b) => b?.accountLookup?.followers_count - a?.accountLookup?.followers_count);

    }
    metaData.value = data?.meta
    mastodonAccounts.value = tableData.value.map((item) => item.mastodon).join(" ")
    showMapTab.value = tableData.value.find((item) => !!item.coordinates)
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
      <div class="grid">
        <div class="col-12 md:col-8">
          <h1 class="mb-1">
            Liste Mastodon {{ selectedListType }}
          </h1>
          <h2 class="mt-1 text-grey">{{ selectedList?.subTitle }}</h2>
        </div>
        <div class="col-12  md:col-4 flex justify-content-end"  v-if="selectedList.type === 'accounts'">
          <ExportCsv :tableData="tableData" :name="selectedList.key" :subTitle="selectedList?.subTitle" />
        </div>
      </div>
      <p>Erstellt am: {{ formatDate(metaData?.created_at) }}</p>
      <p>Liste der <a href="#mastodon">Mastodon</a> {{ selectedListType }} aller {{ selectedList?.subTitle }}.
        Die Daten stammen von <a href="#wikidata">Wikidata</a>. Insgesamt gibt es {{ tableData?.length }} {{ selectedListType }} <span
          v-if="metaData.totalToots">mit insgesamt {{ formatNumber(metaData.totalToots) }} Toots</span><span
          v-if="metaData.totalFollowers"> und insgesamt {{ formatNumber(metaData.totalFollowers) }} Follower</span>.
      </p>
      <div class="layout-main">
        <TabView>
          <TabPanel header="Tabelle">
            <template v-if="selectedList.type === 'accounts'">
              <AccountsTable :data="tableData" :meta-data="metaData" />
            </template>
            <template v-else-if="selectedList.type === 'instances'">
              <InstancesTables :data="tableData"/>
            </template>
          </TabPanel>
          <TabPanel header="Karte" v-if="!!showMapTab">
            <MapConsentWrapper>
              <MainMap :data="tableData" :map-center="selectedList?.map?.center" :map-zoom="selectedList?.map?.zoom" />
            </MapConsentWrapper>
          </TabPanel>
        </TabView>
      </div>
      <p><a :href="dataserverUrl">Formatierte Datenquelle im JSON Format</a>. Das letzte mal
        wurden
        die Daten aktualisiert: {{ new Date(metaData?.created_at).toLocaleString('de-DE') }}</p>
      <div class="flex flex-column gap-2" v-if="selectedList.type === 'accounts'">
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