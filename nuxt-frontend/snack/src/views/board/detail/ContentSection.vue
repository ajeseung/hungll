<template>
  <v-card class="content-card fill-height">
    <v-card-title class="section-title">📝 모임 소개</v-card-title>
    <v-card-text class="scrollable-content" v-html="convertedContent"></v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
  comments?: { id: number; content: string; writer: string; timestamp: number }[]
  newComment?: string
}>()

const emit = defineEmits(['update:comments', 'update:newComment'])

const model = defineModel('newComment', { type: String })

// 줄바꿈 문자 → <br> 변환
const convertedContent = computed(() => {
  return props.content
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;')
})

</script>

<style scoped>
.content-card {
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 200px;
  max-height: 400px;
}

.scrollable-content {
  font-size: 15px;
  color: #444;
  line-height: 1.6;
  min-height: 250px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 8px;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #e65100;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 15px;
    text-align: left;
  }
}
</style>
