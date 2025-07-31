<template>
    <BoardDetailPage />
  </template>
  
  <script setup lang="ts">
  definePageMeta({
  middleware: ['require-auth']
})
  import BoardDetailPage from '@/views/board/detail/BoardDetailPage.vue'
  </script>
  