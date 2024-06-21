<script setup>
import lists from '../assets/lists.json'
import { getCurrentKey } from '../helper.js'
</script>
<template>

    <div class="layout-topbar">
        <div>
            <div>Mastodon Liste</div>
        </div>
        <div class="layout-topbar-menu">
            <div v-for="list in lists" :key="list.key">
                <a :href="`/?liste=${list.key}`" class="mr-2" :class="{'font-bold': getCurrentKey() === list.key}">{{ list.subTitle }}</a>
            </div>
            <div>
                <a href="https://github.com/54GradSoftware/playground_mastodon_hochschul_liste" target="_blank">Github</a>
            </div>
        </div>
    </div>
</template>