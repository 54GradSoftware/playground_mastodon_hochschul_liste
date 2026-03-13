<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { getCurrentList } from '../helper.js'

import lists from '../assets/lists.json'
import Image from 'primevue/image';

const { t } = useI18n()
const route = useRoute()

const selectedList = ref({})
selectedList.value = getCurrentList(route.params.liste)
</script>
<template>
    <div class="card overflow-scroll">
        <h2 id="faq">{{ t('faq.title') }}</h2>
        <h3 id="listen">{{ t('faq.lists') }}</h3>
        <p>
            {{ t('faq.listsDescription') }}
        </p>
            <div v-for="list in lists" :key="list.key">
                <router-link :to="`/${list.key}`" class="mr-2">{{ t('lists.' + list.key) }}</router-link>
            </div>
        <h3 id="mastodon">{{ t('faq.mastodon') }}</h3>
        <p>
            <i18n-t keypath="faq.mastodonDescription" tag="span">
                <template #joinLink>
                    <a href="https://joinmastodon.org/" target="_blank">joinmastodon.org</a>
                </template>
                <template #blogLink>
                    <a href="https://www.54gradsoftware.de/blog/hackathons-super-re-toot">{{ t('faq.blogLinkText') }}</a>
                </template>
            </i18n-t>
        </p>
        {{ t('faq.howCanBenefit') }}
        <blockquote cite="https://netzpolitik.org/2023/aufruf-hochschulen-aller-laender-ins-fediverse/">
            <b>{{ t('faq.fediverse') }}</b><br />
            {{ t('faq.fediverseQuote') }}
        </blockquote>
        <i18n-t keypath="faq.fullArticle" tag="span">
            <template #netzpolitikLink>
                <a href="https://netzpolitik.org/2023/aufruf-hochschulen-aller-laender-ins-fediverse/">{{ t('faq.netzpolitikLinkText') }}</a>
            </template>
            <template #interviewLink>
                <a href="https://netzpolitik.org/2024/interview-zu-fediverse-an-hochschulen-souveraenitaet-ueber-eigene-zentrale-kommunikationsraeume/">{{ t('faq.interviewLinkText') }}</a>
            </template>
        </i18n-t>
        <h3 id="wikidata">{{ t('faq.wikidataTitle') }}</h3>
        <p>
            <i18n-t keypath="faq.wikidataDescription" tag="span">
                <template #wikidataLink>
                    <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank">Wikidata</a>
                </template>
                <template #blogLink>
                    <a href="https://www.54gradsoftware.de/blog/wikidata-oder-linked-open-data">{{ t('faq.wikidataBlogLinkText') }}</a>
                </template>
            </i18n-t>
            {{ t('faq.wikidataDataExplanation') }}
            <template v-if="selectedList.key">
                <i18n-t keypath="faq.queryLinked" tag="span">
                    <template #queryLink>
                        <a :href="`https://github.com/54GradSoftware/playground_mastodon_hochschul_liste/blob/main/backend/src/queries/${selectedList.key}.js`">{{ t('faq.queryLinkText') }}</a>
                    </template>
                </i18n-t>
            </template>
        </p>
        <h3 id="add-data">{{ t('faq.addDataTitle') }}</h3>
        <p>
            <i18n-t keypath="faq.addDataDescription" tag="span">
                <template #dataObjectsLink>
                    <a href="https://www.wikidata.org/wiki/Help:Items/de">{{ t('faq.dataObjectsLinkText') }}</a>
                </template>
                <template #europaUniLink>
                    <a href="https://www.wikidata.org/wiki/Q506436">{{ t('faq.europaUniLinkText') }}</a>
                </template>
            </i18n-t>
        </p>
        <Image src="./screenshot_create_mastodon_statement_german.png" alt="Screenshot aus Wikidata. Links ist ein Eingabefeld mit dem Wert Mastodon-Adresse und rechts ein Eingabefeld mit dem Wert
username@mastodon_server.social. Und die Schaltflächen Veröffentlichen und Abbrechen." />
    </div>
</template>
