<template>
  <div class="section-card">
    <h2 class="section-title">📝 모임 소개 수정</h2>

    <!-- 제목 입력 -->
    <div class="input-wrapper">
      <label class="input-label">
        모임 제목
        <span v-if="props.isTitleInvalid" style="color: red; font-size: 12px; margin-left: 8px">* 필수항목</span>
      </label>
      <input v-model="localBoard.title" class="search-input" placeholder="제목을 입력하세요" />
    </div>

    <!-- 소개 입력 -->
    <div class="input-wrapper">
      <label class="input-label">
        모임 소개
        <span v-if="props.isContentInvalid" style="color: red; font-size: 12px; margin-left: 8px">* 필수항목</span>
      </label>
      <textarea
        v-model="localBoard.content"
        class="search-input"
        placeholder="내용을 입력하세요"
        rows="6"
      ></textarea>
    </div>

    <div class="divider" />

    <!-- 수정 버튼 -->
    <div class="button-flex-wrapper">
      <button class="btn primary" @click="$emit('submit-modify')">
        수정 완료
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useBoardModifyStore } from '@/store/board/boardModifyStore'

const props = defineProps<{ isTitleInvalid: boolean; isContentInvalid: boolean }>()
const emit = defineEmits(['submit-modify'])

const boardStore = useBoardModifyStore()

const localBoard = reactive({
  title: '',
  content: '',
})

watch(
  () => boardStore.board,
  (newBoard) => {
    localBoard.title = newBoard.title
    localBoard.content = newBoard.content
  },
  { immediate: true, deep: true }
)

watch(
  () => [localBoard.title, localBoard.content],
  () => {
    boardStore.board.title = localBoard.title
    boardStore.board.content = localBoard.content
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.section-card {
  width: 100%;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f2f2f2;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ff7043;
}

.input-wrapper {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}

.divider {
  border-top: 1px solid #f2f2f2;
  margin: 20px 0;
}

.button-flex-wrapper {
  display: flex;
  justify-content: flex-end;
}

.btn.primary {
  background-color: #ff7043;
  color: white;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
}
</style>
