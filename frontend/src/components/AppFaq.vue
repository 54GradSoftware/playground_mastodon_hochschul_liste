<script setup>
import { ref } from 'vue'
import { getCurrentList } from '../helper.js'

import lists from '../assets/lists.json'
import Image from 'primevue/image';

const selectedList = ref({})
selectedList.value = getCurrentList()
</script>
<template>
    <div class="card overflow-scroll">
        <h2 id="faq">FAQ</h2>
        <h3 id="listen">Listen</h3>
        <p>
            Es gibt verschiedene Listen mit unterschiedlichen Kategorien:
        </p>
            <div v-for="list in lists" :key="list.key">
                <a :href="`/?liste=${list.key}`" class="mr-2">{{ list.subTitle }}</a>
            </div>
        <h3 id="mastodon">Mastodon</h3>
        <p>
            Mastodon ist ein dezentrales soziales Netzwerk, das auf offenen Standards basiert. Es ist Teil eines
            größeren Netzwerks namens Fediverse. Mehr Informationen darüber, was Mastodon genau ist, gibt es
            hier: <a href="https://joinmastodon.org/" target="_blank">joinmastodon.org</a>. Weitere Informationen findest
            auch in unserem <a href="https://www.54gradsoftware.de/blog/hackathons-super-re-toot">Blogartikel:
                "Hackathons & super RE-toot
                "</a>.
        </p>
        Wie können Hochschulen und Universitäten von dezentralen sozialen Netzwerken profitieren?
        <blockquote cite="https://netzpolitik.org/2023/aufruf-hochschulen-aller-laender-ins-fediverse/">
            <b>Hochschulen aller Länder ins Fediverse!</b><br />
            Während viel über ein mögliches Engagement öffentlich-rechtlicher Medien im Fediverse diskutiert wird, sind
            die Potenziale von Fediverse-Instanzen von Hochschulen bislang kaum Thema. Dabei wäre es höchste Zeit, dass
            sich gerade Hochschulen ins Fediverse begeben. Ein Aufruf.
        </blockquote>
        Den ganzen Artikel dazu findet ihr <a
            href="https://netzpolitik.org/2023/aufruf-hochschulen-aller-laender-ins-fediverse/">auf netzpolitik.org</a>
        dort gibt es auch folgenden Lesenswerten Artikel: <a
            href="https://netzpolitik.org/2024/interview-zu-fediverse-an-hochschulen-souveraenitaet-ueber-eigene-zentrale-kommunikationsraeume/">„Souveränität
            über eigene, zentrale Kommunikationsräume“</a>.
        <h3 id="wikidata">Wikidata</h3>
        <p>
            Wikidata ist eine freie Wissensdatenbank der Wikimedia Foundation. Man kann es sich wie Wikipedia
            vorstellen, aber mit strukturierten Daten. Mehr Informationen
            gibt es hier: <a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank">Wikidata</a> oder
            in unserem Blog Artikel: <a
                href="https://www.54gradsoftware.de/blog/wikidata-oder-linked-open-data">"Wikidata oder Linked Open Data"
            </a>.
            Wir haben die Daten also nicht selbst händisch zusammengetragen, sondern holen uns jeden Tag über eine Schnittstelle die Daten von allen Hochschulen und Universitäten in Deutschland. <template v-if="selectedList.key">Wir haben den<a
                :href="`https://github.com/54GradSoftware/playground_mastodon_hochschul_liste/blob/main/backend/src/queries/${selectedList.key}.js`"> Query
                einmal verlinkt</a>.
                </template>
        </p>
        <h3 id="add-data">Daten hinzufügen oder ändern</h3>
        <p>
            Jeder kann bei Wikidata mitmachen und Daten hinzufügen. Weitere Informationen findest du im Artikel
            über <a href="https://www.wikidata.org/wiki/Help:Items/de">Datenobjekte</a>. Ganz konkret musst du zuerst
            das richtige Datenobjekt finden. In unserem Fall die <a
                href="https://www.wikidata.org/wiki/Q506436">Europa-Universität Flensburg
                (Q506436)</a>. Dort gibt es verschiedene Aussagen. Wenn du bereits einen Mastodon-Account hast und
            diesen
            Mastodon Account ändern möchtest, kannst du einfach zu dem bestehenden Statement "Mastodon Adresse" gehen
            und den Inhalt
            Bearbeiten. Dies ist teilweise nur mit Account möglich. Wenn es noch keine Aussage zu Mastodon gibt, musst
            du eine neue
            neue Aussage hinzufügen. Mit dem Wert "Mastodon Adresse" und dann das Mastodon Account Handle. Nachdem
            Veröffentlichen" gedrückt hast, ist der Wert nun verfügbar. Wenn wir das nächste Mal
            Daten abrufen, wird der Wert auch angezeigt.
        </p>
        <Image src="./screenshot_create_mastodon_statement_german.png" alt="Screenshot aus Wikidata. Links ist ein Eingabefeld mit dem Wert Mastodon-Adresse und rechts ein Eingabefeld mit dem Wert 
username@mastodon_server.social. Und die Schaltflächen Veröffentlichen und Abbrechen." />
    </div>
</template>