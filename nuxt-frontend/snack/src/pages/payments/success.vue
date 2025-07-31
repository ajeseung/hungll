<template>
  <ClientOnly>
    <PaymentsSuccess />
  </ClientOnly>
</template>
  
<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth'],
})
  
import PaymentsSuccess from '@/views/payments/PaymentsSuccess.vue';
</script>
  