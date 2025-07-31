<template>
  <div class="comment-section-wrapper">
    <h3 class="section-title">💬 댓글</h3>

    <!-- 댓글 작성 영역 -->
    <div class="comment-input-wrapper">
      <input
        v-model="newComment"
        maxlength="500"
        placeholder="댓글을 입력하세요"
        class="comment-input"
        @keyup.enter="submitComment"
      />
      <v-btn class="submit-btn" @click="submitComment">등록</v-btn>
    </div>

    <!-- 댓글 리스트 -->
    <div class="comment-section always-scroll">
      <div v-if="comments.length">
        <CommentItem
          v-for="comment in comments"
          :key="comment.comment_id"
          :comment="comment"
          :level="0"
          @reply="onReply"
          @delete="handleDelete"
          @edit="startEdit"
        />
      </div>
      <div v-else class="no-comments">댓글이 없습니다.</div>
    </div>

    <!-- 페이지네이션 -->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @update:modelValue="onPageChange"
      color="orange"
      class="mt-4"
    />

    <!-- 수정 모달 -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>댓글 수정</v-card-title>
        <v-card-text>
          <v-textarea v-model="editContent" rows="3" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="editDialog = false">취소</v-btn>
          <v-btn color="orange" variant="elevated" @click="submitEdit">수정 완료</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CommentItem from './CommentItem.vue';

const props = defineProps<{
  comments: any[];
  total: number;
  onAddComment: (content: string) => void;
  onReply: (payload: { parentId: number; content: string }) => void;
  onDelete: (commentId: number) => void;
}>();

const emit = defineEmits(['edit', 'pageChange']);

// 댓글 추가
const newComment = ref('');

const submitComment = () => {
  if (newComment.value.trim()) {
    props.onAddComment(newComment.value);
    newComment.value = '';
  }
};

// 삭제 confirm
const handleDelete = (commentId: number) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    props.onDelete(commentId);
  }
};

// 수정 모드
const editDialog = ref(false);
const editContent = ref('');
const editTargetId = ref<number | null>(null);

const startEdit = ({ commentId, newContent }: { commentId: number; newContent: string }) => {
  editContent.value = newContent;
  editTargetId.value = commentId;
  editDialog.value = true;
};

const submitEdit = () => {
  if (!editContent.value.trim() || editTargetId.value === null) return;
  emit('edit', { commentId: editTargetId.value, newContent: editContent.value });
  editDialog.value = false;
  editContent.value = '';
  editTargetId.value = null;
};

// 페이지네이션
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(props.total / 10));

const onPageChange = (page: number) => {
  currentPage.value = page;
  emit('pageChange', page);
};
</script>

<style scoped>
.comment-section-wrapper {
  margin-top: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #e65100;
  margin-bottom: 12px;
}

.comment-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.comment-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 999px;
  font-size: 14px;
  color: #333;
  background: #fff;
  height: 40px;
}

.submit-btn {
  background: linear-gradient(to right, #ff6b6b, #ff8e53);
  color: white;
  font-weight: 500;
  font-size: 13px;
  padding: 6px 18px;
  border-radius: 999px;
}

.no-comments {
  font-size: 13px;
  color: #aaa;
  text-align: center;
  margin-top: 8px;
}
</style>
