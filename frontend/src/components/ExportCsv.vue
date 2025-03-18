<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const props = defineProps({
    tableData: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

const visible = ref(false)
const downloadCSVExport = () => {
    visible.value = true
    try {
        let csvData = 'Account address,Show boosts,Notify on new posts,Languages'
        console.log(props.table)
        props.tableData
            .map(row => {
                return [
                    row.mastodon, true, false, ''
                ]
            }).forEach((row) => {
                csvData += row.join(',');
                csvData += "\n";
            });
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
        anchor.target = '_blank';
        anchor.download = `${props.name}-${new Date().toLocaleDateString("de-DE")}.csv`
        anchor.click();
        console.log(csvData);
    } catch (error) {
        console.error(error)
    }
}
</script>
<template>
    <div>
        <Button icon="pi pi-download" label="Liste Importieren" @click="downloadCSVExport()" />
    </div>
    <Dialog v-model:visible="visible" modal header="Liste in Mastodon Importieren" :style="{ width: '25rem' }">
        <div>
            Stand 18.03.2025: Wenn du allen Mastodon-Accounts in der Liste folgen möchtest, kannst du die CSV-Datei in
            der Standardweboberfläche in deinen Einstellungen importieren.
            <ol>
                <li>Du findest die Einstellungen entweder, indem du auf das Zahnradsymbol drückst oder einfach auf
                    "Einstellungen" klickst.</li>
                <li>Und dann klickst du auf "Importieren und Exportieren".</li>
                <li>Klick dann bitte weiter auf "Importieren".</li>
                <li>Du siehst jetzt ein Formular. Wähle dort unter "Typ" den Wert "Folge ich" aus. Im nächsten Schritt
                    wählst du unter dem Punkt "Daten" die heruntergeladene CSV-Liste. Anschließend importierst du mit
                    dem Punkt "Datei importieren" die Accounts.</li>
            </ol>
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Schließen" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>