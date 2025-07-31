<template>
  <v-app>
    <!-- Google Tag Manager (noscript) -->
    <noscript
      ><iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-K35DKXLF"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe
    ></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <NavigationBar />
    <div class="page-content">
      <NuxtPage />
    </div>

    <LLMChatFloatingButton />
    <LLMChatModal />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NavigationBar from '@/views/layout/NavigationBar.vue'
import LLMChatFloatingButton from '@/views/llm/LLMChatFloatingButton.vue'
import LLMChatModal from '@/views/llm/LLMChatModal.vue'
import { useAuthStore } from '~/store/auth/authStore'

onMounted(() => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
})
</script>

<style scoped>
.page-content {
  padding-top: 64px;
}
</style>
