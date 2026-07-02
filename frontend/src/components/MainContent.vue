<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner'
import InputText from 'primevue/inputtext'
import ExportCsv from './ExportCsv.vue'
import { getCurrentList, formatDate, formatNumber, getLocalizedLabel } from '../helper.js'
import MainMap from './MainMap.vue'
import MapConsentWrapper from './MapConsentWrapper.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InstancesTables from './InstancesTable.vue'
import AccountsTable from './AccountsTable.vue'
import PeerTubeChannelsTable from './PeerTubeChannelsTable.vue'
import PeerTubeInstancesTable from './PeerTubeInstancesTable.vue'

const { t, locale } = useI18n()
const route = useRoute()

const tableData = ref([])
const metaData = ref({})
const loading = ref(false)

const mastodonAccounts = ref('')
const selectedList = ref({})
const selectedListType = ref('')
const showMapTab = ref(false)

const loadData = async () => {
  try {
    loading.value = true
    selectedList.value = getCurrentList(route.params.liste)
    if (!selectedList.value) {
      alert(t('main.listNotFound'))
      return
    }
    selectedListType.value =
      selectedList.value.type === 'accounts'
        ? t('main.accounts')
        : selectedList.value.type === 'peertube'
          ? t('main.channels')
          : t('main.instances')
    const { data } = await axios.get(
      `${import.meta.env.VITE_DATA_SERVER_URL}/${selectedList.value.key}`
    )
    if (selectedList.value.type === 'instances') {
      tableData.value = data?.data
        ?.map((item) => {
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
              avatar_static: item?.accountLookup?.contact?.account?.avatar_static
            }
          }
        })
        .sort((a, b) => b?.users_active_last_month - a?.users_active_last_month)
    } else if (selectedList.value.type === 'peertube') {
      tableData.value = data?.data
        ?.map((item) => {
          return {
            name: getLocalizedLabel(item),
            peertube: item.peertube.value,
            item: item.item.value,
            avatar: item?.channelLookup?.avatar,
            host: item?.channelLookup?.host,
            url: item?.channelLookup?.url,
            followersCount: item?.channelLookup?.followersCount,
            videosCount: item?.channelLookup?.videosCount,
            createdAt: item?.channelLookup?.createdAt,
            countryName: item?.countryName?.value,
            coordinates: item?.coordinates?.value
          }
        })
        .sort((a, b) => (b?.followersCount || 0) - (a?.followersCount || 0))
    } else if (selectedList.value.type === 'peertube-instances') {
      tableData.value = data?.data
        ?.map((item) => {
          return {
            name: item?.instanceLookup?.name || getLocalizedLabel(item),
            peertube: item.peertube.value,
            item: item.item.value,
            url: item?.instanceLookup?.url,
            avatar: item?.instanceLookup?.avatar,
            version: item?.instanceLookup?.version,
            totalLocalVideos: item?.instanceLookup?.totalLocalVideos,
            totalUsers: item?.instanceLookup?.totalUsers,
            totalChannels: item?.instanceLookup?.totalChannels,
            countryName: item?.countryName?.value,
            coordinates: item?.coordinates?.value
          }
        })
        .sort((a, b) => (b?.totalLocalVideos || 0) - (a?.totalLocalVideos || 0))
    } else {
      tableData.value = data?.data
        ?.map((item) => {
          return {
            filerNmame: `${getLocalizedLabel(item)} ${item?.doings?.join(' ')}`,
            name: getLocalizedLabel(item),
            mastodon: item.mastodon.value,
            item: item.item.value,
            accountLookup: item.accountLookup,
            doings: item?.doings,
            score: item.score?.score,
            scoreData: item.score,
            coordinates: item?.coordinates?.value,
            verified: !!item.accountLookup?.fields?.find((field) => !!field?.verified_at),
            countryName: item?.countryName?.value
          }
        })
        .sort((a, b) => b?.accountLookup?.followers_count - a?.accountLookup?.followers_count)
    }
    metaData.value = data?.meta
    mastodonAccounts.value = tableData.value.map((item) => item.mastodon || item.peertube).join(' ')
    showMapTab.value = tableData.value.find((item) => !!item.coordinates)
  } catch (error) {
    // e.g. a list whose data file does not exist yet (no entries in Wikidata so far)
    console.error(error)
    tableData.value = []
    metaData.value = {}
    mastodonAccounts.value = ''
    showMapTab.value = false
  } finally {
    loading.value = false
  }
}

loadData()

watch(
  () => route.params.liste,
  () => {
    loadData()
  }
)
</script>
<template>
  <div class="card">
    <div v-if="loading">
      <div class="flex justify-content-center">
        <ProgressSpinner />
      </div>
      <div class="text-center">{{ t('main.loading') }}</div>
    </div>
    <template v-else>
      <div class="grid">
        <div class="col-12 md:col-8">
          <h1 v-if="selectedList.type === 'peertube'" class="mb-1">{{ t('main.listTitlePeertube') }}</h1>
          <h1 v-else-if="selectedList.type === 'peertube-instances'" class="mb-1">
            {{ t('main.listTitlePeertubeInstances') }}
          </h1>
          <h1 v-else class="mb-1">{{ t('main.listTitle', { type: selectedListType }) }}</h1>
          <h2 class="mt-1 text-grey">{{ t('lists.' + selectedList?.key) }}</h2>
        </div>
        <div
          class="col-12 md:col-4 flex justify-content-end"
          v-if="selectedList.type === 'accounts'"
        >
          <ExportCsv
            :tableData="tableData"
            :name="selectedList.key"
            :subTitle="t('lists.' + selectedList?.key)"
          />
        </div>
      </div>
      <p>{{ t('main.createdAt', { date: formatDate(metaData?.created_at) }) }}</p>
      <p v-if="selectedList.type === 'peertube'">
        <i18n-t keypath="main.descriptionPeertube" tag="span">
          <template #peertubeLink
            ><a href="https://joinpeertube.org/" target="_blank">PeerTube</a></template
          >
          <template #subTitle>{{ t('lists.' + selectedList?.key) }}</template>
          <template #wikidataLink><a href="#wikidata">Wikidata</a></template>
        </i18n-t>
        {{ t('main.totalCount', { count: tableData?.length, type: selectedListType }) }}
        <span v-if="metaData.totalFollowers">
          {{ t('main.andFollowers', { count: formatNumber(metaData.totalFollowers) }) }}</span
        ><span v-if="metaData.totalVideos">
          {{ t('main.withVideos', { count: formatNumber(metaData.totalVideos) }) }}</span
        >.
      </p>
      <p v-else-if="selectedList.type === 'peertube-instances'">
        <i18n-t keypath="main.descriptionPeertubeInstances" tag="span">
          <template #peertubeLink
            ><a href="https://joinpeertube.org/" target="_blank">PeerTube</a></template
          >
          <template #subTitle>{{ t('lists.' + selectedList?.key) }}</template>
          <template #wikidataLink><a href="#wikidata">Wikidata</a></template>
        </i18n-t>
        {{ t('main.totalCount', { count: tableData?.length, type: selectedListType }) }}
        <span v-if="metaData.totalVideos">
          {{ t('main.withVideos', { count: formatNumber(metaData.totalVideos) }) }}</span
        ><span v-if="metaData.totalUsers">
          {{ t('main.andUsers', { count: formatNumber(metaData.totalUsers) }) }}</span
        >.
      </p>
      <p v-else>
        <i18n-t keypath="main.description" tag="span">
          <template #mastodonLink><a href="#mastodon">Mastodon</a></template>
          <template #type>{{ selectedListType }}</template>
          <template #subTitle>{{ t('lists.' + selectedList?.key) }}</template>
          <template #wikidataLink><a href="#wikidata">Wikidata</a></template>
        </i18n-t>
        {{ t('main.totalCount', { count: tableData?.length, type: selectedListType }) }}
        <span v-if="metaData.totalToots">{{
          t('main.withToots', { count: formatNumber(metaData.totalToots) })
        }}</span
        ><span v-if="metaData.totalFollowers">
          {{ t('main.andFollowers', { count: formatNumber(metaData.totalFollowers) }) }}</span
        >.
        <span v-if="metaData?.totalPopulation">
          {{ t('main.totalPopulation', { count: formatNumber(metaData.totalPopulation) }) }}</span
        >
      </p>
      <div class="layout-main">
        <TabView>
          <TabPanel :header="t('main.table')">
            <template v-if="selectedList.type === 'accounts'">
              <AccountsTable :data="tableData" :meta-data="metaData" />
            </template>
            <template v-else-if="selectedList.type === 'instances'">
              <InstancesTables :data="tableData" />
            </template>
            <template v-else-if="selectedList.type === 'peertube'">
              <PeerTubeChannelsTable :data="tableData" />
            </template>
            <template v-else-if="selectedList.type === 'peertube-instances'">
              <PeerTubeInstancesTable :data="tableData" />
            </template>
          </TabPanel>
          <TabPanel :header="t('main.map')" v-if="!!showMapTab">
            <MapConsentWrapper>
              <MainMap
                :data="tableData"
                :map-center="selectedList?.map?.center"
                :map-zoom="selectedList?.map?.zoom"
              />
            </MapConsentWrapper>
          </TabPanel>
        </TabView>
      </div>
      <p>
        <a :href="dataserverUrl">{{ t('main.dataSource') }}</a
        >.
        <span v-if="metaData?.created_at">{{
          t('main.lastUpdated', {
            date: new Date(metaData?.created_at).toLocaleString(locale === 'de' ? 'de-DE' : 'en-US')
          })
        }}</span>
      </p>
      <div
        class="flex flex-column gap-2"
        v-if="selectedList.type === 'accounts' || selectedList.type === 'peertube'"
      >
        <label for="mastodonAccounts">{{
          selectedList.type === 'peertube' ? t('main.copyListPeertube') : t('main.copyList')
        }}</label>
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
