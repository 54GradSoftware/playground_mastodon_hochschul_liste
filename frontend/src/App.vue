<script setup>
import AppHeader from './components/AppHeader.vue';
import MainTable from './components/MainTable.vue';
import AppFaq from './components/AppFaq.vue';
import AppFooter from './components/AppFooter.vue';
</script>
<template>
  <div class="layout-wrapper">
    <AppHeader/>
    <main class="layout-main-container">
      <MainTable/>
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
