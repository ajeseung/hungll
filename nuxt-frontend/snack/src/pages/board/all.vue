<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth']
})
import BoardListPage from '@/views/board/list/BoardListPage.vue'
</script>

<template>
  <BoardListPage />
</template>
