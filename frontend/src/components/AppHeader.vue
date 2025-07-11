<template>
    <Menubar :model="items" style="padding: 1rem 2.5rem 1rem 4.5rem;">
        <template #end>
            Mastodon Listen
        </template>
        <div class="test"></div>
        <template #item="{ item, props, hasSubmenu, root }">
            <a v-ripple class="flex align-items-center" v-bind="props.action" v-if="!item.route">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <i v-if="hasSubmenu"
                    :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
            </a>
            <a v-else-if="item.label === 'FAQ'" v-ripple class="flex align-items-center" v-bind="props.action"
                href="#faq">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
            <a v-else v-ripple class="flex align-items-center" v-bind="props.action"
                :href="`${item.route}?liste=${item.query.liste}`">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </template>
    </Menubar>
</template>
<script setup>
import { ref } from "vue";
import Menubar from 'primevue/menubar';
import lists from '../assets/lists.json'

const items = ref([
{
        label: 'Wissenschaft',
        icon: 'pi pi-search',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Wissenschaft')
            .map(list => ({
                label: list.subTitle,
                icon: list?.icon || 'pi pi-search',
                route: '/',
                query: { liste: list.key }
            }))

    },
    {
        label: 'Kommunale Verwaltung (DE)',
        icon: 'pi pi-globe',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Kommunale Verwaltung (DE)')
            .map(list => ({
                label: list.subTitle,
                icon: list?.icon || 'pi pi-globe',
                route: '/',
                query: { liste: list.key }
            }))

    },
    {
        label: 'Weitere',
        icon: 'pi pi-directions-alt',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Weitere')
            .map(list => ({
                label: list.subTitle,
                icon: list?.icon || 'pi pi-directions-alt',
                route: '/',
                query: { liste: list.key }
            }))

    },
    {
        label: 'FAQ',
        icon: 'pi pi-info-circle',
        route: '/#faq'
    }
]);
</script>
