<script setup>
defineProps({
    handle: {
        type: String,
        required: true,
    },
});
</script>
<template>
    <!-- fedirect is the official Wikidata formatter (P12622) for PeerTube channel addresses -->
    <a target="_blank" :href="`https://fedirect.toolforge.org/?id=${handle}`">
        {{ handle }}
    </a>
</template>
