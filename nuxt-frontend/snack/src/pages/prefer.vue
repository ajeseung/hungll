<template>
  <PreferView />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth'], 
})

import PreferView from '~/views/prefer/PreferPage.vue'
</script>
