<script setup>
import AppHeader from './components/AppHeader.vue'
</script>
<template>
  <div class="layout-wrapper">
    <AppHeader />
    <router-view :key="$route.fullPath" />
  </div>
</template>
