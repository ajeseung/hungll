<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" class="upload-col">
        <UploadSection
          :is-date-invalid="isDateInvalid"
          :is-time-invalid="isTimeInvalid"
        />
      </v-col>
      <v-col cols="12" md="9" class="content-col">
        <ContentSection
          :is-title-invalid="isTitleInvalid"
          :is-content-invalid="isContentInvalid"
          @submit-modify="submitModify"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import UploadSection from './UploadSection.vue'
import ContentSection from './ContentSection.vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardModifyStore } from '@/store/board/boardModifyStore'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const boardModifyStore = useBoardModifyStore()

const boardId = Number(route.params.boardId || route.params.id)

const isDateInvalid = ref(false)
const isTimeInvalid = ref(false)
const isTitleInvalid = ref(false)
const isContentInvalid = ref(false)

onMounted(async () => {
  if (!isNaN(boardId)) {
    await boardModifyStore.fetchBoard(boardId)
  } else {
    alert('잘못된 게시글 ID입니다.')
  }
})

const submitModify = async () => {
  const endTime = boardModifyStore.board.end_time || ''
  const [datePart, timePart] = endTime.includes('T')
    ? endTime.split('T')
    : endTime.split(' ')

  isDateInvalid.value = !datePart || datePart.length !== 10
  isTimeInvalid.value = !timePart || !timePart.includes(':')
  isTitleInvalid.value = !boardModifyStore.board.title?.trim()
  isContentInvalid.value = !boardModifyStore.board.content?.trim()

  if (isDateInvalid.value || isTimeInvalid.value || isTitleInvalid.value || isContentInvalid.value) {
    alert('필수항목을 입력해주세요.')
    return
  }

  const success = await boardModifyStore.updateBoard()
  if (success) {
    alert('게시글이 수정되었습니다.')
    router.push(`/board/detail/${boardModifyStore.board.board_id}`)
  } else {
    alert('게시글 수정 실패')
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
</style>
