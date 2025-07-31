<template>
  <div class="policy-container">
    <h1>헝글(HUNGLL) 이용 약관</h1>
    <div v-html="termsText"></div>
  </div>
</template>

<script setup lang="ts">
import { termsText } from '~/views/policy/TermsText'
</script>

<style scoped>
.policy-container {
  padding: 24px;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-line;
}
</style>
