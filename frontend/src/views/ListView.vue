<script setup>
import MainContent from '../components/MainContent.vue';
import AppFaq from '../components/AppFaq.vue';
import AppFooter from '../components/AppFooter.vue';
</script>
<template>
  <main class="layout-main-container">
    <MainContent/>
    <AppFaq/>
    <AppFooter/>
  </main>
</template>

<style scoped>
.layout-main-container{
  padding-top: 1rem;
}
</style>
