<script setup>
import AppHeader from './components/AppHeader.vue';
import MainContent from './components/MainContent.vue';
import AppFaq from './components/AppFaq.vue';
import AppFooter from './components/AppFooter.vue';
</script>
<template>
  <div class="layout-wrapper">
    <AppHeader/>
    <main class="layout-main-container">
      <MainContent/>
      <AppFaq/>
      <AppFooter/>
    </main>
  </div>
</template>

<style scoped>
.layout-main-container{
  padding-top: 1rem;
}
</style>
