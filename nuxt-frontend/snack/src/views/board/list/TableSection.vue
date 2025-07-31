<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardListStore } from '@/store/board/boardListStore'
import { useBoardDeleteStore } from '@/store/board/boardDeleteStore'
import { useAccountStore } from '@/store/account/accountStore'
import defaultThumbnail from '@/assets/images/logo/hungle_korean_center.png'

const props = defineProps<{
  title: string
  author: string
  start_date: string
  end_date: string
}>()

const router = useRouter()
const boardStore = useBoardListStore()
const deleteStore = useBoardDeleteStore()
const accountStore = useAccountStore()

const selectedStatus = ref('전체')
const selectedSort = ref('최신순')

const statusOptions = ['전체', '모집중', '모집종료']
const sortOptions = ['최신순', '마감순']

const statusOpen = ref(false)
const sortOpen = ref(false)

const statusDropdown = ref<HTMLElement | null>(null)
const sortDropdown = ref<HTMLElement | null>(null)

const reactiveBoardList = computed(() => boardStore.boardList)

const isExpired = (end_time: string | null | undefined) => {
  if (!end_time) return false
  return new Date(end_time) < new Date()
}

const statusMap: Record<string, string> = {
  모집중: 'ongoing',
  모집종료: 'closed',
}

const sortMap: Record<string, string> = {
  최신순: 'latest',
  마감순: 'end_date',
}

const modifyBoard = (boardId: number) => {
  console.log('➡️ 수정 이동 시도 boardId:', boardId)
  router.push(`/board/modify/${boardId}`)
}

watch(
  () => [props.title, props.author, props.start_date, props.end_date],
  () => {
    boardStore.currentPage = 1
    fetchBoardList()
  }
)

const fetchBoardList = async () => {
  await boardStore.fetchBoardList({
    page: boardStore.currentPage,
    perPage: 10,
    status: selectedStatus.value === '전체' ? undefined : statusMap[selectedStatus.value],
    sort: sortMap[selectedSort.value],
    title: props.title,
    author: props.author,
    start_date: props.start_date,
    end_date: props.end_date,
  })
}

const toggleStatus = () => {
  statusOpen.value = !statusOpen.value
  sortOpen.value = false
}

const toggleSort = () => {
  sortOpen.value = !sortOpen.value
  statusOpen.value = false
}

const selectStatus = (val: string) => {
  selectedStatus.value = val
}

const selectSort = (val: string) => {
  selectedSort.value = val
}

watch([selectedStatus, selectedSort], () => {
  boardStore.currentPage = 1
  fetchBoardList()
})

watch(() => boardStore.currentPage, () => {
  fetchBoardList()
})

const goToDetail = (id: number) => {
  router.push(`/board/detail/${id}`)
}

const closeAllDropdowns = (e: MouseEvent) => {
  const target = e.target as Node
  if (
    !statusDropdown.value?.contains(target) &&
    !sortDropdown.value?.contains(target)
  ) {
    statusOpen.value = false
    sortOpen.value = false
  }
}

onMounted(async () => {
  await accountStore.getAccount()
  console.log('accountId:', accountStore.accountId)
  console.log('isAdmin:', localStorage.getItem('isAdmin'))
  fetchBoardList()
  window.addEventListener('click', closeAllDropdowns)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeAllDropdowns)
})

// ✅ 삭제 함수
const deleteBoard = async (boardId: number) => {
  const confirmDelete = confirm('정말로 이 게시글을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')
  if (!confirmDelete) return

  const success = await deleteStore.deleteBoard(boardId)
  if (success) {
    alert('게시글이 삭제되었습니다.')
    fetchBoardList()
  } else {
    alert(deleteStore.errorMessage || '삭제에 실패했습니다.')
  }
}

const isAdmin = computed(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAdmin') === 'true'
  }
  return false
})

</script>

<template>
  <div class="board-list-wrapper">
    <div class="board-list-header">
      <h2>📋 밥친구 모집 리스트</h2>

      <div class="dropdown-group">
        <div class="dropdown" ref="statusDropdown" @click="toggleStatus">
          <span>{{ selectedStatus }}</span>
          <ul v-if="statusOpen" class="dropdown-menu">
            <li v-for="status in statusOptions" :key="status" @click.stop="selectStatus(status)">
              {{ status }}
            </li>
          </ul>
        </div>

        <div class="dropdown" ref="sortDropdown" @click="toggleSort">
          <span>{{ selectedSort }}</span>
          <ul v-if="sortOpen" class="dropdown-menu">
            <li v-for="sort in sortOptions" :key="sort" @click.stop="selectSort(sort)">
              {{ sort }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="reactiveBoardList.length === 0" class="no-data">
      😢 등록된 밥모임이 없습니다
    </div>

    <div v-else class="board-list">
      <div
        v-for="board in reactiveBoardList"
        :key="board.board_id"
        class="board-item"
        :class="{ expired: isExpired(board.end_time) }"
      >
        <img :src="board.image_url || defaultThumbnail" alt="헝글" @click="goToDetail(board.board_id)" />

        <div class="details" @click="goToDetail(board.board_id)">
          <h3>{{ board.title }}</h3>
          <p>
            👤 {{ board.author_nickname }} |
            📅 {{ board.end_time?.slice(0, 10) || '미정' }} |
            📌 {{ board.status === 'ongoing' ? '모집중' : '모집종료' }}
          </p>
          <p class="created-at">작성일: {{ board.created_at?.slice(0, 10) || '알수없음' }}</p>
        </div>

        <div
        v-if="isAdmin || String(board.author_account_id) === String(accountStore.accountId)"
          class="button-group"
        >
          <button class="btn-modify" @click.stop="modifyBoard(board.board_id)">
            수정
          </button>
          <button
            class="btn-delete"
            :disabled="deleteStore.isLoading"
            @click.stop="deleteBoard(board.board_id)"
          >
            <span v-if="deleteStore.isLoading" class="spinner"></span>
            {{ deleteStore.isLoading ? '삭제 중...' : '삭제' }}
          </button>
        </div>
      </div>
    </div>

    <v-pagination
      v-model="boardStore.currentPage"
      :length="boardStore.totalPages"
      @update:modelValue="fetchBoardList"
      color="orange"
      class="mt-6"
    />
  </div>
</template>

<style scoped>
/* 공통 스타일 */
.board-list-wrapper {
  padding: 24px;
}

.board-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #aaa;
  font-size: 15px;
}

/* 게시글 */
.board-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.board-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.board-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.board-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  background: #f9f9f9;
}

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

.details h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #222;
}

.details p {
  font-size: 14px;
  color: #666;
}

.created-at {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
  margin-left: 16px;
}

.btn-modify,
.btn-delete {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-modify {
  background-color: #ffd180;
  color: #222;
  border: none;
}

.btn-modify:hover {
  background-color: #ffb74d;
}

.btn-delete {
  background-color: #ff7043;
  color: white;
  border: none;
  position: relative;
}

.btn-delete:hover {
  background-color: #ff5722;
}

.btn-delete:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 로딩 스피너 */
.spinner {
  border: 2px solid #fff;
  border-top: 2px solid #ff5722;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-right: 6px;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 만료된 게시물 스타일 */
.board-item.expired {
  filter: grayscale(100%);
  opacity: 0.7;
}

/* 드롭다운 */
.dropdown-group {
  display: flex;
  gap: 12px;
}

.dropdown {
  position: relative;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 6px 14px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: 0.2s ease;
  min-width: 100px;
  z-index: 1000;
}

.dropdown:hover {
  border-color: #ff7043;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  z-index: 999;
  padding: 6px 0;
  width: 100%;
}

.dropdown-menu li {
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: #ffece5;
  color: #ff7043;
}

/* 반응형 */
@media (max-width: 600px) {
  .board-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-group {
    align-items: stretch;
    width: 100%;
  }

  .btn-modify,
  .btn-delete {
    width: 100%;
    text-align: center;
  }
}
</style>
