<template>
  <div class="policy-container">
    <h1>헝글(HUNGLL) 개인정보 처리방침</h1>
    <div v-html="privacyText"></div>
  </div>
</template>

<script setup lang="ts">
import { privacyText } from '~/views/policy/PrivacyText'
</script>

<style scoped>
.policy-container {
  padding: 24px;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-line;
}
</style>
