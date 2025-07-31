<template>
  <ClientOnly>
    <PaymentsProgressPage />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

definePageMeta({ ssr: false })

const PaymentsProgressPage = defineAsyncComponent(() =>
  import('@/views/payments/PaymentsProgressPage.vue')
)
</script>
