<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';

const { t, locale } = useI18n()

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
    follow: () => t('export.follow'),
    list: () => t('export.list')
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
        anchor.download = `${typeKeys[type]()}-${props.name}-${new Date().toLocaleDateString(locale.value === 'de' ? 'de-DE' : 'en-US')}.csv`
        anchor.click();
        console.log(csvData);
    } catch (error) {
        console.error(error)
    }
}
</script>
<template>
    <div>
        <Button icon="pi pi-download" :label="t('export.followImport')" @click="downloadCSVExport('follow')" />
        <Button class="mt-1 xl:ml-1" icon="pi pi-list" :label="t('export.listImport')"
            @click="downloadCSVExport('list')" />
    </div>
    <Dialog v-model:visible="visible" modal :header="t('export.dialogTitle')" :style="{ width: '50rem', max_width: '90vw' }">
        <div>
            {{ t('export.intro') }}

            <InlineMessage severity="warn" class="mt-2 mb-2">{{ t('export.warning') }}</InlineMessage>
            <a href="https://fedi.tips/how-to-use-the-lists-feature-on-mastodon/" target="_blank">{{ t('export.moreAboutLists') }} <i class="pi pi-external-link"></i></a>

            <ol>
                <li>{{ t('export.step1') }}</li>
                <li>{{ t('export.step2') }}</li>
                <li>{{ t('export.step3') }}</li>
                <li>{{ t('export.step4') }}</li>
                <li>{{ t('export.step5') }}</li>
            </ol>
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" :label="t('export.close')" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>
