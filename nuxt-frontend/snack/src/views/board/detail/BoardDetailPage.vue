<template>
  <v-container>
    <!-- Top layout for large screens -->
    <v-row class="top-layout" v-if="board">
      <v-col cols="12" md="4" lg="3">
        <InfoSection
          :board="board"
          :formattedDate="formattedDate"
          :isAdmin="isAdmin"
          :goToModify="goToModify"
        />
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <ContentSection :content="board.content ?? ''" />
        <CommentSection
          :comments="commentStore.comments"
          :total="commentStore.total"
          :on-add-comment="handleAddComment"
          :on-reply="handleReply"
          :on-delete="handleDelete"
          @edit="handleEdit"
          @pageChange="handlePageChange"
        />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBoardDetailStore } from '@/store/board/boardDetailStore'
import { useCommentStore } from '~/store/board/boardCommentStore'
import { useAccountStore } from '@/store/account/accountStore'

import InfoSection from './InfoSection.vue'
import ContentSection from './ContentSection.vue'
import CommentSection from './comment/CommentSection.vue'

const route = useRoute()
const router = useRouter()

const boardDetailStore = useBoardDetailStore()
const commentStore = useCommentStore()
const accountStore = useAccountStore()

const { board } = storeToRefs(boardDetailStore)

const formattedDate = computed(() => {
  const raw = board.value?.end_time
  return raw ? new Date(raw).toLocaleString('ko-KR', { dateStyle: 'full', timeStyle: 'short' }) : ''
})

// 관리자 여부
const isAdmin = computed(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAdmin') === 'true'
  }
  return false
})

// 댓글 작성
const handleAddComment = (content: string) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.addComment(id, content)
}

const handleReply = ({ parentId, content }: { parentId: number; content: string }) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.addReply(id, parentId, content).then(() => {
    commentStore.loadComments(id)
  })
}

const handleDelete = (commentId: number) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.deleteComment(commentId, id)
}

const handleEdit = ({ commentId, newContent }: { commentId: number; newContent: string }) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.updateComment(commentId, newContent, id)
}

const handlePageChange = (page: number) => {
  const id = Number(route.params.id)
  if (!id) return
  commentStore.loadComments(id, page)
}

// 수정 버튼 클릭 → 수정 페이지 이동
const goToModify = () => {
  const id = Number(route.params.id)
  if (!id) return
  router.push(`/board/modify/${id}`)
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) {
    boardDetailStore.requestDetailBoard(id)
    commentStore.loadComments(id)
    accountStore.getAccount() // 현재 로그인 계정 정보 가져오기
  }
})
</script>

<style scoped>
.top-layout {
  margin-bottom: 24px;
}
</style>
