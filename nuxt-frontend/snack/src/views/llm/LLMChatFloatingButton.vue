<template>
  <button class="floating-btn" @click="handleChatClick">
    <v-icon size="24">mdi-chat</v-icon>
  </button>

  <!-- ❗ 감성 모달 -->
  <div v-if="showAlert" class="alert-overlay" @click.self="showAlert = false">
    <div class="alert-content">
      <p>😊 로그인 이후 이용해주세요</p>
      <button class="alert-confirm" @click="showAlert = false">확인</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLLMChatStore } from '@/store/llm/llmChatStore'
import { useAccountStore } from '@/store/account/accountStore'

const chatStore = useLLMChatStore()
const accountStore = useAccountStore()
const showAlert = ref(false)

const handleChatClick = async () => {
  const accountId = localStorage.getItem('account_id')
  const userToken = localStorage.getItem('userToken')

  if (accountId && userToken) {
    try {
      await accountStore.getAccount()
      chatStore.openModal()
    } catch (err) {
      showAlert.value = true
    }
  } else {
    showAlert.value = true
  }
}
</script>

<style scoped>
/* ✅ 플로팅 버튼 */
.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9800, #ff5722);  
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.floating-btn:hover {
  transform: scale(1.12); 
  box-shadow: 0 6px 16px rgba(255, 87, 34, 0.4); 
}

.alert-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(6px);
}
.alert-content {
  background: white;
  padding: 24px 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
  max-width: 280px;
}
.alert-content p {
  font-size: 15px;
  margin-bottom: 16px;
}
.alert-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.alert-confirm:hover {
  transform: scale(1.05);
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
