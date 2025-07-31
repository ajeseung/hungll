<template>
  <div class="policy-container">
    <h1>헝글(HUNGLL) 아동 보호 정책</h1>
    <div v-html="childProtectionText"></div>
  </div>
</template>

<script setup lang="ts">
import { childProtectionText } from '~/views/policy/ChildProtectionText'
</script>

<style scoped>
.policy-container {
  padding: 24px;
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-line;
}
</style>
