<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';

const props = defineProps({
    tableData: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    }
})

const typeKeys = {
    follow: 'Folgen',
    list: 'Liste'
}

const visible = ref(false)
const downloadCSVExport = (type) => {
    visible.value = true
    try {

        let csvData = ''
        if (type === 'follow') {
            csvData = 'Account address,Show boosts,Notify on new posts,Languages'
        }
        props.tableData
            .map(row => {
                if (type === 'follow') {
                    return [
                        row.mastodon, true, false, ''
                    ]
                } else {
                    return [
                        props.subTitle, row.mastodon
                    ]
                }

            }).forEach((row) => {
                csvData += row.join(',');
                csvData += "\n";
            });
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
        anchor.target = '_blank';
        anchor.download = `${typeKeys[type]}-${props.name}-${new Date().toLocaleDateString("de-DE")}.csv`
        anchor.click();
        console.log(csvData);
    } catch (error) {
        console.error(error)
    }
}
</script>
<template>
    <div>
        <Button icon="pi pi-download" label="Accounts folgen Importieren" @click="downloadCSVExport('follow')" />
        <Button class="mt-1 xl:ml-1" icon="pi pi-list" label="Liste mit Accounts Importieren"
            @click="downloadCSVExport('list')" />
    </div>
    <Dialog v-model:visible="visible" modal header="Mastodon Importieren" :style="{ width: '50rem', max_width: '90vw' }">
        <div>
            Stand 18.03.2025: Wenn du allen Mastodon-Accounts in der Tabelle folgen möchtest oder eine Liste mit allen Accounts anlegen möchtest, kannst du die CSV-Datei in
            der Standardweboberfläche in deinen Einstellungen importieren.

            <InlineMessage severity="warn" class="mt-2 mb-2">Wenn du eine Liste mit Accounts erstellen möchtest, musst du zuerst allen Accounts folgen. Die "Accounts folgen" muss zuerst importiert werden, bevor die "Liste mit Accounts" importiert werden kann.</InlineMessage>
            <a href="https://fedi.tips/how-to-use-the-lists-feature-on-mastodon/" target="_blank">Mehr zum Thema Listen in Mastodon (Englisch) <i class="pi pi-external-link"></i></a>

            <ol>
                <li>Du findest die Einstellungen entweder, indem du auf das Zahnradsymbol drückst oder einfach auf
                    "Einstellungen" klickst.</li>
                <li>Und dann klickst du auf "Importieren und Exportieren".</li>
                <li>Klick dann bitte weiter auf "Importieren".</li>
                <li>Du siehst jetzt ein Formular. Wähle dort unter "Typ" den Wert "Folge ich" wenn du den Accounts folgende möchtest oder "Listen" aus. Im nächsten Schritt
                    wählst du unter dem Punkt "Daten" die heruntergeladene CSV-Liste. Anschließend importierst du mit
                    dem Punkt "Datei importieren" die Accounts.</li>
                <li>Tipp: Wenn du eine Liste erstellt hast, kannst du dir die Toots aus dieser Liste in der erweiterten Ansicht (Einstellungen -> Design -> Erweitertes Webinterface verwenden) von Mastodon anzeigen lassen, indem du auf das Icon "Listen" klickst. Du kannst diese Liste auch als Spalte an Permament anheften. Am Anfang ist diese Spalte leer und füllt sich erst nach und nach.</li>
            </ol>
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Schließen" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>