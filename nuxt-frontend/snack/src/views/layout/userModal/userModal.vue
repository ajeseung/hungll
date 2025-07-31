<template>
  <v-dialog :model-value="show" @update:model-value="closeModal" width="360">
    <v-card class="user-modal-card">
      <div class="close-x" @click="closeModal">✕</div>

      <v-card-text class="user-modal-content">
        <div v-if="isLoading" class="spinner-wrapper">
          <div class="loading-spinner" />
        </div>
        <template v-else>
          <div class="emoji">😄</div>
          <div class="nickname-msg">
            <span class="typing">안녕하세요 <strong>{{ nickname || '사용자' }}</strong>님 ❤️</span>
          </div>
          <div class="user-actions">
            <v-btn class="hungll-btn" @click="goToMypage">마이페이지</v-btn>
            <v-btn class="hungll-btn light" @click="handleLogout">로그아웃</v-btn>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/store/account/accountStore'
import { useAuthStore } from '@/store/auth/authStore'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show', 'logout'])

const router = useRouter()
const accountStore = useAccountStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const nickname = computed(() => accountStore.nickname)

const closeModal = () => emit('update:show', false)

const handleLogout = () => {
  authStore.logout()
  emit('logout')
  closeModal()
}

const goToMypage = () => {
  closeModal()
  router.push('/mypage')
}

watch(
  () => props.show,
  async (newVal) => {
    if (newVal) {
      isLoading.value = true
      try {
        await accountStore.getAccount()
      } catch (error) {
        console.error('🔴 사용자 정보 불러오기 실패:', error)
      } finally {
        isLoading.value = false
      }
    }
  }
)
</script>

<style scoped>
.user-modal-card {
  border-radius: 20px;
  padding: 32px 24px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.user-modal-content {
  text-align: center;
}

.emoji {
  font-size: 48px;
  margin-bottom: 16px;
}

.nickname-msg {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
  white-space: nowrap;
  overflow: hidden;
}

.typing {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 1.6s steps(25, end) 1;
  border-right: 2px solid #ff5722;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.hungll-btn {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: bold;
  border-radius: 30px;
  padding: 8px 20px;
  min-width: 100px;
  font-size: 14px;
  box-shadow: none;
  transition: 0.2s ease;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.hungll-btn:hover {
  transform: scale(1.05);
  filter: brightness(1.05); 
}
.hungll-btn.light {
  background: #e0e0e0;
  color: #333;
}

.hungll-btn:hover {
  filter: brightness(1.1);
}

.close-x {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 18px;
  font-weight: bold;
  color: #bbb;
  cursor: pointer;
}

.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 6px solid transparent;
  border-top: 6px solid #ff7043;
  border-right: 6px solid #f44336;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
