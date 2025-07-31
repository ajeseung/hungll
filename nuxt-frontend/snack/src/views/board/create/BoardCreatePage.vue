<template>
  <v-container fluid>
    <v-row>
      <!-- 좌측: 업로드 섹션 -->
      <v-col cols="12" md="3" class="upload-col">
        <UploadSection :board-store="boardStore" :is-date-invalid="isDateInvalid" :is-time-invalid="isTimeInvalid" />
      </v-col>

      <!-- 우측: 콘텐츠 작성 섹션 -->
      <v-col cols="12" md="9" class="content-col">
        <ContentSection :is-title-invalid="isTitleInvalid" :is-content-invalid="isContentInvalid" />
      </v-col>
    </v-row>

    <!-- 하단 등록 버튼 -->
    <div class="button-wrapper">
      <button class="btn primary" @click="submitBoard" :disabled="isSubmitting">
        {{ isSubmitting ? '등록 중...' : '게시글 등록' }}
      </button>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UploadSection from './UploadSection.vue'
import ContentSection from './ContentSection.vue'
import { useBoardCreateStore } from '@/store/board/boardCreateStore'
import { useRouter } from 'vue-router'

const boardStore = useBoardCreateStore()
const router = useRouter()

const isDateInvalid = ref(false)
const isTimeInvalid = ref(false)
const isTitleInvalid = ref(false)
const isContentInvalid = ref(false)
const isSubmitting = ref(false)

onMounted(() => {
  boardStore.reset()
})

const submitBoard = async () => {
  const [datePart, timePart] = boardStore.end_time.split('T') ?? []
  isDateInvalid.value = !datePart || datePart.length !== 10
  isTimeInvalid.value = !timePart || !timePart.includes(':')
  isTitleInvalid.value = !boardStore.title?.trim()
  isContentInvalid.value = !boardStore.content?.trim()

  if (isDateInvalid.value || isTimeInvalid.value || isTitleInvalid.value || isContentInvalid.value) {
    alert('필수항목을 입력해주세요.')
    return
  }

  const token = localStorage.getItem('userToken')
  const accountId = localStorage.getItem('account_id')
  if (!token || !accountId) {
    alert('로그인 후 이용해주세요')
    return
  }

  try {
    isSubmitting.value = true
    await boardStore.requestCreateBoard({
      title: boardStore.title,
      content: boardStore.content,
      end_time: boardStore.end_time,
      image_url: boardStore.image_url ?? undefined,
      restaurant_id: boardStore.restaurant_id ?? undefined,
      author_id: parseInt(accountId),
    })
    alert('게시글이 등록되었습니다.')
    router.push('/board/all')
  } catch (error) {
    console.error('❌ 게시글 등록 실패:', error)
    alert('등록 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.upload-col {
  padding-right: 8px;
}

.content-col {
  padding-left: 8px;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.btn.primary {
  background-color: #ff7043;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.btn.primary:hover {
  background-color: #ff5722;
}
</style>