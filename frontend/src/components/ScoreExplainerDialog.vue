<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Panel from 'primevue/panel'
import Avatar from 'primevue/avatar'
import Fieldset from 'primevue/fieldset'
import Dialog from 'primevue/dialog'

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
    if (score >= 90) return 'Ausgezeichnet'
    if (score >= 50) return 'Gut'
    if (score >= 30) return 'Verbesserungswürdig'
    return 'Optimierung empfohlen'
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
    <Dialog modal header="Score Erklärung">

        <section aria-label="Analyseergebnis" aria-live="polite">
            <!-- Score Übersicht -->
            <Card style="margin-bottom: 2rem;">
                <template #title>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <Avatar v-if="result.values.avatar_static" :image="result.values.avatar_static" size="large"
                            shape="circle"
                            :aria-label="`Profilbild von ${result.values.display_name || result.values.username}`" />
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
            <Fieldset legend="Detaillierte Bewertung" style="margin-bottom: 2rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Display Name -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.display_name ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.display_name ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>Anzeigename</span>
                                <Tag :value="`${result.values.display_name ? result.scoreMatrix.display_name : 0}/${result.scoreMatrix.display_name} Punkte`"
                                    :severity="result.values.display_name ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            Ein Anzeigename hilft anderen, dich auf den ersten Blick zu erkennen.
                            Er kann von deinem Benutzernamen abweichen und Emojis oder deinen echten Namen
                            enthalten.
                        </p>
                        <p v-if="result.values.display_name" style="margin-top: 0.5rem; margin-bottom: 0;">
                            <strong>Dein Anzeigename:</strong> {{ result.values.display_name }}
                        </p>
                        <Message v-else severity="warn" :closable="false" style="margin-top: 0.75rem;">
                            <strong>Tipp:</strong> Gehe zu
                            <a :href="`${mastodonServerUrl}/settings/profile`" target="_blank" rel="noopener noreferrer"
                                style="color: var(--p-primary-color);">Einstellungen &gt;
                                Profil</a>
                            und füge einen Anzeigenamen hinzu.
                        </Message>
                    </Panel>

                    <!-- Bio/Note -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.note ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.note ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>Profilbeschreibung (Bio)</span>
                                <Tag :value="`${result.values.note ? result.scoreMatrix.note : 0}/${result.scoreMatrix.note} Punkte`"
                                    :severity="result.values.note ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            Die Profilbeschreibung gibt anderen einen Einblick in deine Interessen,
                            deinen Beruf oder deine Persönlichkeit. Sie ist oft das Erste, was Leute lesen.
                        </p>
                        <Message v-if="!result.values.note" severity="warn" :closable="false"
                            style="margin-top: 0.75rem;">
                            <strong>Tipp:</strong> Erzähle anderen etwas über dich in deiner
                            <a :href="`${mastodonServerUrl}/settings/profile`" target="_blank" rel="noopener noreferrer"
                                style="color: var(--p-primary-color);">Profilbeschreibung</a>.
                        </Message>
                    </Panel>

                    <!-- Discoverable -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.discoverable ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.discoverable ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>Auffindbar (Discoverable)</span>
                                <Tag :value="`${result.values.discoverable ? result.scoreMatrix.discoverable : 0}/${result.scoreMatrix.discoverable} Punkte`"
                                    :severity="result.values.discoverable ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            Wenn diese Option aktiviert ist, erscheint dein Profil im Profilverzeichnis deiner
                            Instanz.
                            Dies macht es für andere einfacher, neue interessante Accounts zu entdecken.
                        </p>
                        <Message v-if="!result.values.discoverable" severity="warn" :closable="false"
                            style="margin-top: 0.75rem;">
                            <strong>Tipp:</strong> Aktiviere "Im Profilverzeichnis erscheinen" in den
                            <a :href="`${mastodonServerUrl}/settings/privacy`" target="_blank" rel="noopener noreferrer"
                                style="color: var(--p-primary-color);">Einstellungen &gt;
                                Datenschutz und Reichweite</a>.
                        </Message>
                    </Panel>

                    <!-- Indexable -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.indexable === true ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.indexable === true ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>Indexierbar</span>
                                <Tag :value="`${result.values.indexable === true ? result.scoreMatrix.indexable : 0}/${result.scoreMatrix.indexable} Punkte`"
                                    :severity="result.values.indexable === true ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            Erlaubt es, dass deine öffentlichen Beiträge in der Suche gefunden werden können.
                            Dies erhöht deine Sichtbarkeit im Fediverse erheblich.
                        </p>
                        <Message v-if="!result.values.indexable" severity="warn" :closable="false"
                            style="margin-top: 0.75rem;">
                            <strong>Tipp:</strong> Erlaube die Indexierung deiner Beiträge in den
                            <a :href="`${mastodonServerUrl}/settings/privacy`" target="_blank" rel="noopener noreferrer"
                                style="color: var(--p-primary-color);">Einstellungen &gt;
                                Datenschutz und Reichweite</a>.
                        </Message>
                    </Panel>

                    <!-- Verified Fields -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.verifiedFields?.length > 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.verifiedFields?.length > 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>Verifizierte Links</span>
                                <Tag :value="`${result.values.verifiedFields?.length > 0 ? result.scoreMatrix.verified_fields : 0}/${result.scoreMatrix.verified_fields} Punkte`"
                                    :severity="result.values.verifiedFields?.length > 0 ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            Verifizierte Links beweisen, dass du der Besitzer einer Website bist.
                            Du kannst dies tun, indem du einen speziellen Link auf deiner Website einbaust,
                            der zurück auf dein Mastodon-Profil verweist.
                        </p>
                        <div v-if="result.values.verifiedFields?.length > 0" style="margin-top: 0.5rem;">
                            <strong>Verifizierte Links:</strong>
                            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                                <li v-for="field in result.values.verifiedFields" :key="field.name">
                                    {{ field.name }}: <span v-html="field.value"></span>
                                </li>
                            </ul>
                        </div>
                        <Message v-else severity="warn" :closable="false" style="margin-top: 0.75rem;">
                            <strong>Tipp:</strong> Gehe zu
                            <a :href="`${mastodonServerUrl}/settings/verification`" target="_blank"
                                rel="noopener noreferrer" style="color: var(--p-primary-color);">Einstellungen &gt;
                                Öffentliches Profil &gt;
                                Verifizierung</a>
                            und füge einen rel="me" Link auf deiner Website hinzu.
                        </Message>
                    </Panel>

                    <!-- Featured Collection -->
                    <Panel>
                        <template #header>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i :class="result.values.featuredCollection?.length > 0 ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                                    :style="{ color: result.values.featuredCollection?.length > 0 ? 'var(--p-green-500)' : 'var(--p-red-500)' }"></i>
                                <span>Angeheftete Beiträge</span>
                                <Tag :value="`${result.values.featuredCollection?.length > 0 ? result.scoreMatrix.featuredCollection : 0}/${result.scoreMatrix.featuredCollection} Punkte`"
                                    :severity="result.values.featuredCollection?.length > 0 ? 'success' : 'danger'" />
                            </div>
                        </template>
                        <p style="margin: 0; color: var(--p-text-muted-color);">
                            Angeheftete Beiträge erscheinen oben auf deinem Profil und sind das Erste,
                            was Besucher sehen. Nutze sie, um wichtige Informationen über dich oder
                            deine besten Beiträge hervorzuheben.
                        </p>
                        <div v-if="result.values.featuredCollection?.length > 0" style="margin-top: 0.5rem;">
                            <strong>Angeheftete Beiträge:</strong>
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
                            <strong>Tipp:</strong> Hefte interessante Beiträge an, damit Profilbesucher sie sofort
                            sehen.
                        </Message>
                    </Panel>
                </div>

                <Message v-if="result.score >= 80" severity="success" :closable="false" style="margin-top: 1.5rem;">
                    Dein Account ist hervorragend optimiert! Weiter so!
                </Message>
            </Fieldset>

            <div style="text-align: center; margin-top: 1rem; color: var(--p-text-muted-color);">
                <a href="https://mastodon-account-checker.playground.54gradsoftware.de/" target="_blank"
                    rel="noopener noreferrer" style="color: var(--p-primary-color);">
                    <i class="pi pi-external-link" style="margin-right: 0.5rem;"></i>Einfach jeden Mastodon Account
                    testen
                </a>
            </div>
        </section>
    </Dialog>
</template>
