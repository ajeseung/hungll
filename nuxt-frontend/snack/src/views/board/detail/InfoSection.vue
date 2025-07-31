<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAccountStore } from '@/store/account/accountStore'
import { useRouter, useRoute } from 'vue-router'
import defaultThumbnail from '@/assets/images/logo/hungle_korean_center.png'
import { useBoardDeleteStore } from '@/store/board/boardDeleteStore'
import ReportModal from '@/views/report/ReportModal.vue'

const props = defineProps<{
  board: {
    image_url?: string
    title?: string
    author_nickname?: string
    author_account_id?: number
    end_time?: string
    restaurant?: string
  }
  formattedDate: string
}>()

const accountStore = useAccountStore()
const router = useRouter()
const route = useRoute()

const isAdmin = computed(() => {
  return localStorage.getItem('isAdmin') === 'true'
})

const isAuthor = computed(() => {
  return String(props.board.author_account_id) === String(accountStore.accountId)
})

const goToModify = () => {
  const id = Number(route.params.id)
  if (!id) return
  router.push(`/board/modify/${id}`)
}

const deleteStore = useBoardDeleteStore()

const goToDelete = async () => {
  const id = Number(route.params.id)
  if (!id) return

  if (confirm('정말로 이 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
    const success = await deleteStore.deleteBoard(id)
    if (success) {
      alert('삭제가 완료되었습니다.')
      router.push('/board/all') 
    } else {
      alert(deleteStore.errorMessage || '삭제에 실패했습니다.')
    }
  }
}

// 신고 모달 관련
const isReportModalOpen = ref(false)
const reportTargetId = ref<number | null>(null)
const reportTargetType = ref<'BOARD' | 'COMMENT' | null>(null)

const reportPost = () => {
  const id = Number(route.params.id)
  if (!id) return
  reportTargetId.value = id
  reportTargetType.value = 'BOARD'
  isReportModalOpen.value = true
}
</script>

<template>
  <v-card class="info-card fill-height">
    <div class="thumbnail-info-wrapper">
      <div class="desktop-layout">
        <div class="thumbnail-wrapper">
          <v-img
            :src="board?.image_url || defaultThumbnail"
            class="thumbnail-img"
            cover
          />
        </div>
        <div class="info-body">
          <div class="info-block">
            <span class="info-label">✨ 모임 제목</span>
            <div class="info-value">{{ board?.title }}</div>
          </div>
          <div class="info-block">
            <span class="info-label">📅 모임 날짜</span>
            <div class="info-value">{{ formattedDate }}</div>
          </div>
          <div class="info-block">
            <span class="info-label">👤 작성자</span>
            <div class="info-value">{{ board?.author_nickname }}</div>
          </div>
          <div class="info-block" v-if="board.restaurant">
            <span class="info-label">🍽 맛집 장소</span>
            <div class="info-value">{{ board.restaurant }}</div>
          </div>

          <div class="button-group">
            <template v-if="isAdmin || isAuthor">
              <button class="btn-modify" @click="goToModify">✏ 수정</button>
              <button class="btn-delete" @click="goToDelete">🗑 삭제</button>
            </template>
            <template v-else>
              <button class="btn-report" @click="reportPost">🚨 신고</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </v-card>

  <ReportModal
    :isOpen="isReportModalOpen"
    :targetId="reportTargetId"
    :targetType="reportTargetType"
    @close="isReportModalOpen = false"
  />
</template>


<style scoped>
.info-card {
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  height: auto; 
}

.thumbnail-info-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.desktop-layout .thumbnail-wrapper {
  margin-top: -12px;
}

.desktop-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.thumbnail-img {
  width: 200px;
  min-width: 150px;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.info-body {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  min-width: 0;
}

.info-block {
  margin-bottom: 12px;
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #888;
  margin-bottom: 4px;
  display: block;
  margin-left: 10px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn-modify {
  background-color: #ffd180;
  color: #222;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-modify:hover {
  background-color: #ffb74d;
}

.btn-delete {
  background-color: #ff7043;
  color: white;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-delete:hover {
  background-color: #ff5722;
}

.btn-report {
  background-color: transparent;
  color: #ff7043;
  border: 1px solid #ff7043;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-report:hover {
  background-color: #ffece5;
}

@media (max-width: 576px) {
  .info-label {
    font-size: 12px;
    margin-left: 10px;
  }
  .info-value {
    font-size: 14px;
    margin-left: 10px;
  }
  .thumbnail-img {
    width: 200px;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}
</style>
