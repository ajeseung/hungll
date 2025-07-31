<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import ReportModal from '@/views/report/ReportModal.vue'
import { useAccountStore } from '@/store/account/accountStore'

const props = defineProps<{ comment: any; level: number }>()
const emit = defineEmits(['reply', 'delete', 'edit'])

const accountStore = useAccountStore()

const isAuthor = computed(() => {
  return props.comment.author_account_id === accountStore.accountId
})

const isAdmin = computed(() => {
  return localStorage.getItem('isAdmin') === 'true'
})

const showReplyInput = ref(false)
const replyContent = ref('')
const isEditing = ref(false)
const editContent = ref(props.comment.content)

const replyLimit = 5
const replyLimitState = ref(replyLimit)
const showReplies = ref(false)

const visibleReplies = computed(() => {
  return showReplies.value
    ? (props.comment.replies || []).slice(0, replyLimitState.value)
    : []
})

const toggleReply = () => {
  showReplyInput.value = !showReplyInput.value
}

const submitReply = () => {
  if (!replyContent.value.trim()) return
  emit('reply', { parentId: props.comment.comment_id, content: replyContent.value })
  replyContent.value = ''
  showReplyInput.value = false
}

const confirmDelete = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    emit('delete', props.comment.comment_id)
  }
}

const startEdit = () => {
  isEditing.value = true
  editContent.value = props.comment.content
}

const submitEdit = () => {
  if (!editContent.value.trim()) return
  emit('edit', { commentId: props.comment.comment_id, newContent: editContent.value })
  isEditing.value = false
}

const toggleReplies = () => {
  const totalReplies = props.comment.replies?.length || 0

  if (!showReplies.value) {
    showReplies.value = true
    replyLimitState.value = Math.min(replyLimit, totalReplies)
    return
  }

  if (replyLimitState.value < totalReplies) {
    replyLimitState.value = Math.min(replyLimitState.value + 5, totalReplies)
    return
  }

  showReplies.value = false
  replyLimitState.value = replyLimit
}

// 신고 모달 상태
const isReportModalOpen = ref(false)
const reportTargetId = ref<number | null>(null)
const reportTargetType = ref<'BOARD' | 'COMMENT' | null>(null)

const reportComment = () => {
  reportTargetId.value = props.comment.comment_id
  reportTargetType.value = 'COMMENT'
  isReportModalOpen.value = true
}
</script>

<template>
  <div :class="`pl-${props.level * 4}`" class="comment-text">
    <div class="comment-content">
      <span v-if="comment.is_deleted" class="text-gray-400 italic">메세지가 삭제되었습니다</span>
      <span v-else-if="!isEditing">{{ comment.content }}</span>
      <textarea v-else v-model="editContent" rows="2" class="edit-textarea" maxlength="500" />
    </div>

    <div class="comment-meta">
      <span class="comment-writer">{{ comment.author_nickname }}</span>
      ·
      <span class="comment-time">{{ comment.created_at }}</span>
      <span
        v-if="!isAuthor && !comment.is_deleted"
        class="report-btn"
        @click="reportComment"
      >신고</span>
    </div>

    <div class="action-buttons">
      <button v-if="(isAuthor || isAdmin) && !comment.is_deleted" class="action-btn edit-btn" @click="startEdit">수정</button>
      <button v-if="(isAuthor || isAdmin) && !comment.is_deleted" class="action-btn delete-btn" @click="confirmDelete">삭제</button>
      <button v-if="!comment.is_deleted && !comment.parent_id" class="action-btn reply-btn" @click="toggleReply">답글</button>
    </div>

    <div v-if="isEditing" class="edit-action">
      <button @click="submitEdit" class="submit-btn">수정 완료</button>
    </div>

    <div v-if="showReplyInput" class="reply-input-wrapper">
      <textarea v-model="replyContent" rows="2" class="reply-textarea" placeholder="답글을 입력해주세요"  maxlength="500" />
      <div class="reply-action">
        <button @click="submitReply" class="submit-btn">답글 등록</button>
      </div>
    </div>

    <CommentItem
      v-for="reply in visibleReplies"
      :key="reply.comment_id"
      :comment="reply"
      :level="props.level + 1"
      @reply="$emit('reply', $event)"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
    />

    <div v-if="comment.replies?.length > 0" @click="toggleReplies" class="toggle-replies">
      <template v-if="!showReplies">답글 더보기 ({{ comment.replies.length }})</template>
      <template v-else-if="replyLimitState < comment.replies.length">답글 더보기</template>
      <template v-else>답글 접기</template>
    </div>

    <ReportModal
      :isOpen="isReportModalOpen"
      :targetId="reportTargetId"
      :targetType="reportTargetType"
      @close="isReportModalOpen = false"
    />
  </div>
</template>

<style scoped>
.comment-text {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
  padding: 8px 0;
  margin-top: 10px;
}

.comment-content {
  margin-bottom: 4px;
}

.edit-textarea, .reply-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
}

.comment-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.comment-writer {
  font-weight: 500;
}

.report-btn {
  margin-left: auto;
  font-size: 12px;
  color: #e57373;
  cursor: pointer;
  opacity: 0.6;
}

.report-btn:hover {
  opacity: 1;
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.action-btn {
  font-size: 12px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 2px 6px;
  border-radius: 4px;
}

.edit-btn {
  color: #1976d2;
}

.delete-btn {
  color: #e53935;
}

.reply-btn {
  color: #ff8e53;
}

.edit-action, .reply-action {
  margin-top: 4px;
}

.submit-btn {
  background: linear-gradient(to right, #ff6b6b, #ff8e53);
  color: white;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}

.reply-input-wrapper {
  margin-top: 6px;
}

.toggle-replies {
  font-size: 12px;
  color: #ff8e53;
  cursor: pointer;
  margin-top: 6px;
}
</style>
