<template>
  <ClientOnly>
    <PaymentsFail />
  </ClientOnly>
</template>
  
<script setup lang="ts">
definePageMeta({
  middleware: ['require-auth'],
})
  
import PaymentsFail from '@/views/payments/PaymentsFail.vue';
</script>
  