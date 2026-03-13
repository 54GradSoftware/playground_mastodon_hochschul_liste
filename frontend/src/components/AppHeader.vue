<template>
    <Menubar :model="items" style="padding: 1rem 2.5rem 1rem 4.5rem;">
        <template #end>
            <div class="flex align-items-center gap-2">
                <span>{{ t('nav.mastodonLists') }}</span>
                <LanguageSwitcher />
            </div>
        </template>
        <div class="test"></div>
        <template #item="{ item, props, hasSubmenu, root }">
            <a v-ripple class="flex align-items-center" v-bind="props.action" v-if="!item.listKey && !item.isFaq">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <i v-if="hasSubmenu"
                    :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
            </a>
            <a v-else-if="item.isFaq" v-ripple class="flex align-items-center" v-bind="props.action"
                href="#faq">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
            <router-link v-else v-ripple class="flex align-items-center" v-bind="props.action"
                :to="`/${item.listKey}`">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </router-link>
        </template>
    </Menubar>
</template>
<script setup>
import { computed } from "vue";
import { useI18n } from 'vue-i18n'
import Menubar from 'primevue/menubar';
import LanguageSwitcher from './LanguageSwitcher.vue';
import lists from '../assets/lists.json'

const { t } = useI18n()

const items = computed(() => [
    {
        label: t('nav.science'),
        icon: 'pi pi-search',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Wissenschaft')
            .map(list => ({
                label: t('lists.' + list.key),
                icon: list?.icon || 'pi pi-search',
                listKey: list.key
            }))
    },
    {
        label: t('nav.publicAdministration'),
        icon: 'pi pi-globe',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Öffentliche Verwaltung (DE)')
            .map(list => ({
                label: t('lists.' + list.key),
                icon: list?.icon || 'pi pi-globe',
                listKey: list.key
            }))
    },
    {
        label: t('nav.other'),
        icon: 'pi pi-directions-alt',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Weitere')
            .map(list => ({
                label: t('lists.' + list.key),
                icon: list?.icon || 'pi pi-directions-alt',
                listKey: list.key
            }))
    },
    {
        label: t('nav.netherlands'),
        icon: 'pi pi-flag',
        hasSubmenu: true,
        items: lists.filter(list => list.category === 'Niederlande (NL)')
            .map(list => ({
                label: t('lists.' + list.key),
                icon: list?.icon || 'pi pi-flag',
                listKey: list.key
            }))
    },
    {
        label: t('nav.faq'),
        icon: 'pi pi-info-circle',
        isFaq: true
    }
]);
</script>
