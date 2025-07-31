<script setup lang="ts">
definePageMeta({
  middleware: ['admin-check']
})

import AdminPageView from '@/views/admin/AdminPageView.vue'
</script>

<template>
  <AdminPageView />
</template>
