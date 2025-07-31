<template>
  <BoardModifyPage />
</template>
  
<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth']
})
import BoardModifyPage from '@/views/board/modify/BoardModifyPage.vue'
</script>
  