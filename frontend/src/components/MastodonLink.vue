<script setup>
defineProps({
    mastodonHandle: {
        type: String,
        required: true,
    },
});
</script>
<template>
    <a target="_blank" :href="`https://wikidata-externalid-url.toolforge.org/?p=4033&id=${mastodonHandle}`">
        {{ mastodonHandle }}
    </a>
</template>