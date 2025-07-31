<template>
  <v-overlay :model-value="show" class="custom-alarm-modal" persistent>
    <v-card class="user-modal-card">
      <div class="modal-header">
        <div class="modal-title">알림</div>
        <div class="close-x" @click="closeModal">✕</div>
      </div>

      <v-card-text class="user-modal-content">
        <div v-if="isLoading" class="spinner-wrapper">
          <div class="loading-spinner" />
        </div>
        <template v-else>
          <div v-if="alarms && alarms.length > 0" class="alarm-list">
            <div
              v-for="alarm in alarms"
              :key="alarm.alarm_id"
              class="alarm-item"
              @click="goToBoard(alarm.alarm_id, alarm.board_id)"
            >
              <div class="alarm-content">
                <span class="nickname-highlight">{{ alarm.comment_author_nickname }}</span>
                님이 「{{ alarm.board_title }}」 게시글에 댓글을 남겼습니다: “{{ alarm.comment_content }}”
              </div>
            </div>
          </div>

          <div v-else class="no-alarm">📭 받은 알림이 없습니다</div>
        </template>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountAlarmStore } from '@/store/account_alarm/alarmStore'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show'])
const alarmStore = useAccountAlarmStore()
const router = useRouter()

const closeModal = () => emit('update:show', false)
const isLoading = ref(false)
const { alarms } = toRefs(alarmStore)

const goToBoard = async (alarmId: number, boardId: number) => {
  await alarmStore.readAlarm(alarmId)
  closeModal()
  router.push(`/board/detail/${boardId}`)
}

watch(
  () => props.show,
  async (newVal) => {
    if (newVal) {
      isLoading.value = true
      try {
        await alarmStore.fetchAlarms()
      } finally {
        isLoading.value = false
      }
    }
  }
)
</script>

<style scoped>
.custom-alarm-modal {
  position: fixed;
  top: 64px;
  right: 16px;
  z-index: 9999;
  background: transparent;
  padding: 0;
  display: flex;
  justify-content: flex-end;
}

.user-modal-card {
  border-radius: 20px;
  width: 360px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px 0;
}

.modal-title {
  font-size: 14px;
  font-weight: bold;
  color: #888;
}

.user-modal-content {
  text-align: left;
  position: relative;
  padding: 8px 10px 16px;
}

.alarm-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.alarm-item {
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.alarm-item:hover {
  background: #ffe0b2;
}

.alarm-content {
  font-size: 13.5px;
  color: #444;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nickname-highlight {
  color: #ff5722;
  font-weight: 600;
}

.no-alarm {
  font-size: 14px;
  color: #aaa;
  margin-top: 12px;
  text-align: center;
}

.close-x {
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
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
</style>
