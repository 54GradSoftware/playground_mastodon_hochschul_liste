<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Panel from 'primevue/panel'
import Avatar from 'primevue/avatar'
import Fieldset from 'primevue/fieldset'
import Dialog from 'primevue/dialog'

const { t } = useI18n()

const props = defineProps({
    result: {
        type: Object,
        required: true
    }
})

const scoreColor = computed(() => {
    const score = props.result.score
    if (score >= 90) return 'success'
    if (score >= 50) return 'warn'
    return 'danger'
})

const scoreLabel = computed(() => {
    const score = props.result.score
    if (score >= 90) return t('score.excellent')
    if (score >= 50) return t('score.good')
    if (score >= 30) return t('score.needsImprovement')
    return t('score.optimizationRecommended')
})

const mastodonServerUrl = computed(() => {
    if (!props.result?.handle) return ''
    const handle = props.result.handle.startsWith('@')
        ? props.result.handle.slice(1)
        : props.result.handle
    const atIndex = handle.indexOf('@')
    if (atIndex === -1) return ''
    const server = handle.slice(atIndex + 1)
    return `https://${server}`
})
</script>

<template>
    <Dialog modal :header="t('score.title')">

        <section :aria-label="t('score.ariaLabel')" aria-live="polite">
            <!-- Score Übersicht -->
            <Card style="margin-bottom: 2rem;">
                <template #title>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <Avatar v-if="result.values.avatar_static" :image="result.values.avatar_static" size="large"
                            shape="circle"
                            :aria-label="t('table.avatarAlt', { name: result.values.display_name || result.values.username })" />
                        <div>
                            <div>{{ result.values.display_name || result.values.username }}</div>
                            <small style="color: var(--p-text-muted-color);">{{ result.handle }}</small>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;">
                            {{ result.score }} / 100
                        </div>
                        <Tag :value="scoreLabel" :severity="scoreColor" style="font-size: 1rem;" />
                    </div>
                    <ProgressBar :value="result.score" :showValue="false" style="height: 1rem;" />
                </template>
            </Card>

            <!-- Detaillierte Bewertung -->
            <Fieldset :legend="t('score.detailedRating')" style="margin-bottom: 2rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Display Name -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.display_name ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.display_name ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>{{ t('score.displayName.title') }}</span>
                                <Tag :value="t('score.points', { points: `${result.values.display_name ? result.scoreMatrix.display_name : 0}/${result.scoreMatrix.display_name}` })"
                                    :severity="result.values.display_name ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            {{ t('score.displayName.description') }}
                        </p>
                        <p v-if="result.values.display_name" style="margin-top: 0.5rem; margin-bottom: 0;">
                            <strong>{{ t('score.displayName.yours') }}</strong> {{ result.values.display_name }}
                        </p>
                        <Message v-else severity="warn" :closable="false" style="margin-top: 0.75rem;">
                            <i18n-t keypath="score.displayName.tip" tag="span">
                                <template #link>
                                    <a :href="`${mastodonServerUrl}/settings/profile`" target="_blank" rel="noopener noreferrer"
                                        style="color: var(--p-primary-color);">{{ t('score.displayName.tipLinkText') }}</a>
                                </template>
                            </i18n-t>
                        </Message>
                    </Panel>

                    <!-- Bio/Note -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.note ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.note ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>{{ t('score.bio.title') }}</span>
                                <Tag :value="t('score.points', { points: `${result.values.note ? result.scoreMatrix.note : 0}/${result.scoreMatrix.note}` })"
                                    :severity="result.values.note ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            {{ t('score.bio.description') }}
                        </p>
                        <Message v-if="!result.values.note" severity="warn" :closable="false"
                            style="margin-top: 0.75rem;">
                            <i18n-t keypath="score.bio.tip" tag="span">
                                <template #link>
                                    <a :href="`${mastodonServerUrl}/settings/profile`" target="_blank" rel="noopener noreferrer"
                                        style="color: var(--p-primary-color);">{{ t('score.bio.tipLinkText') }}</a>
                                </template>
                            </i18n-t>
                        </Message>
                    </Panel>

                    <!-- Discoverable -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.discoverable ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.discoverable ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>{{ t('score.discoverable.title') }}</span>
                                <Tag :value="t('score.points', { points: `${result.values.discoverable ? result.scoreMatrix.discoverable : 0}/${result.scoreMatrix.discoverable}` })"
                                    :severity="result.values.discoverable ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            {{ t('score.discoverable.description') }}
                        </p>
                        <Message v-if="!result.values.discoverable" severity="warn" :closable="false"
                            style="margin-top: 0.75rem;">
                            <i18n-t keypath="score.discoverable.tip" tag="span">
                                <template #link>
                                    <a :href="`${mastodonServerUrl}/settings/privacy`" target="_blank" rel="noopener noreferrer"
                                        style="color: var(--p-primary-color);">{{ t('score.discoverable.tipLinkText') }}</a>
                                </template>
                            </i18n-t>
                        </Message>
                    </Panel>

                    <!-- Indexable -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.indexable === true ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.indexable === true ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>{{ t('score.indexable.title') }}</span>
                                <Tag :value="t('score.points', { points: `${result.values.indexable === true ? result.scoreMatrix.indexable : 0}/${result.scoreMatrix.indexable}` })"
                                    :severity="result.values.indexable === true ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            {{ t('score.indexable.description') }}
                        </p>
                        <Message v-if="!result.values.indexable" severity="warn" :closable="false"
                            style="margin-top: 0.75rem;">
                            <i18n-t keypath="score.indexable.tip" tag="span">
                                <template #link>
                                    <a :href="`${mastodonServerUrl}/settings/privacy`" target="_blank" rel="noopener noreferrer"
                                        style="color: var(--p-primary-color);">{{ t('score.indexable.tipLinkText') }}</a>
                                </template>
                            </i18n-t>
                        </Message>
                    </Panel>

                    <!-- Verified Fields -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.verifiedFields?.length > 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.verifiedFields?.length > 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>{{ t('score.verifiedLinks.title') }}</span>
                                <Tag :value="t('score.points', { points: `${result.values.verifiedFields?.length > 0 ? result.scoreMatrix.verified_fields : 0}/${result.scoreMatrix.verified_fields}` })"
                                    :severity="result.values.verifiedFields?.length > 0 ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            {{ t('score.verifiedLinks.description') }}
                        </p>
                        <div v-if="result.values.verifiedFields?.length > 0" style="margin-top: 0.5rem;">
                            <strong>{{ t('score.verifiedLinks.yours') }}</strong>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                                <li v-for="field in result.values.verifiedFields" :key="field.name">
                                    {{ field.name }}: <span v-html="field.value"></span>
                                </li>
                            </ul>
                        </div>
                        <Message v-else severity="warn" :closable="false" style="margin-top: 0.75rem;">
                            <i18n-t keypath="score.verifiedLinks.tip" tag="span">
                                <template #link>
                                    <a :href="`${mastodonServerUrl}/settings/verification`" target="_blank"
                                        rel="noopener noreferrer" style="color: var(--p-primary-color);">{{ t('score.verifiedLinks.tipLinkText') }}</a>
                                </template>
                            </i18n-t>
                        </Message>
                    </Panel>

                    <!-- Featured Collection -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.featuredCollection?.length > 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.featuredCollection?.length > 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>{{ t('score.pinnedPosts.title') }}</span>
                                <Tag :value="t('score.points', { points: `${result.values.featuredCollection?.length > 0 ? result.scoreMatrix.featuredCollection : 0}/${result.scoreMatrix.featuredCollection}` })"
                                    :severity="result.values.featuredCollection?.length > 0 ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            {{ t('score.pinnedPosts.description') }}
                        </p>
                        <div v-if="result.values.featuredCollection?.length > 0" style="margin-top: 0.5rem;">
                            <strong>{{ t('score.pinnedPosts.yours') }}</strong>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                                <li v-for="(url, index) in result.values.featuredCollection" :key="index">
                                    <a :href="url" target="_blank" rel="noopener"
                                        style="color: var(--p-primary-color);">
                                        {{ url }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <Message v-else severity="warn" :closable="false" style="margin-top: 0.75rem;">
                            <strong>{{ t('common.tip') }}</strong> {{ t('score.pinnedPosts.tip') }}
                        </Message>
                    </Panel>
                </div>

                <Message v-if="result.score >= 80" severity="success" :closable="false" style="margin-top: 1.5rem;">
                    {{ t('score.optimized') }}
                </Message>
            </Fieldset>

            <div style="text-align: center; margin-top: 1rem; color: var(--p-text-muted-color);">
                <a href="https://mastodon-account-checker.playground.54gradsoftware.de/" target="_blank"
                    rel="noopener noreferrer" style="color: var(--p-primary-color);">
                    <i class="pi pi-external-link" style="margin-right: 0.5rem;"></i>{{ t('score.testAny') }}
                </a>
            </div>
        </section>
    </Dialog>
</template>
