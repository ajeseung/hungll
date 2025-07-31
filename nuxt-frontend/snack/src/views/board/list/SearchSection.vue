<template>
  <div class="search-section-card animate-fade-in">
    <h2 class="section-title">🔎 밥친구 검색</h2>

    <!-- 📌 제목 검색 -->
    <div class="input-wrapper">
      <label class="input-label">📝 제목</label>
      <input class="search-input" type="text" placeholder="제목을 입력하세요" v-model="title" />
    </div> 

    <!-- 🧑‍💼 작성자 검색 -->
    <div class="input-wrapper">
      <label class="input-label">👤 작성자</label>
      <input class="search-input" type="text" placeholder="작성자 이름" v-model="author" />
    </div>

    <div class="divider" />

    <!-- 📅 날짜 검색 -->
    <div class="date-flex-wrapper">
      <div class="input-wrapper">
        <label class="input-label">📅 시작 날짜</label>
        <input
          class="search-input"
          :value="sDate"
          readonly
          @click="openStartCalendar"
          placeholder="날짜 선택"
        />
        <HungllDatePicker ref="startCalendar" v-model="sDate" />
      </div>

      <div class="input-wrapper">
        <label class="input-label">📅 종료 날짜</label>
        <input
          class="search-input"
          :value="eDate"
          readonly
          @click="openEndCalendar"
          placeholder="날짜 선택"
        />
        <HungllDatePicker ref="endCalendar" v-model="eDate" />
      </div>
    </div>

    <div class="button-flex-wrapper">
      <button class="btn gradient-orange" @click="handleSearch">검색</button>
      <button class="btn grey" @click="handleReset">초기화</button>
    </div>

    <div class="divider" />
    <button class="btn orange" @click="goToCreate">+ 모임 등록</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, onMounted, onBeforeUnmount } from 'vue'
import HungllDatePicker from '@/common/components/HungllDatePicker.vue'

const title = ref('')
const author = ref('')
const sDate = ref('')
const eDate = ref('')

const startCalendar = ref()
const endCalendar = ref()

const openStartCalendar = () => {
  startCalendar.value?.open()
}
const openEndCalendar = () => {
  endCalendar.value?.open()
}

const handleReset = () => {
  title.value = ''
  author.value = ''
  sDate.value = ''
  eDate.value = ''
}

const emit = defineEmits<{
  (e: 'search', params: {
    title: string
    author: string
    start_date: string
    end_date: string
  }): void
}>()

const handleSearch = () => {
  emit('search', {
    title: title.value,
    author: author.value,
    start_date: sDate.value,
    end_date: eDate.value
  })
}

const handleClickOutside = (event: MouseEvent) => {
  const popup1 = startCalendar.value?.$refs?.popup || startCalendar.value?.getPopupElement?.()
  const popup2 = endCalendar.value?.$refs?.popup || endCalendar.value?.getPopupElement?.()

  if (
    popup1 && !popup1.contains(event.target as Node) &&
    popup2 && !popup2.contains(event.target as Node)
  ) {
    startCalendar.value?.close()
    endCalendar.value?.close()
  }
}

const goToCreate = () => {
  router.push('/board/create')
}
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-section-card {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  border: 0px solid #e0e0e0;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.search-section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #2c2c2c;
}

.input-wrapper {
  margin-bottom: 16px;
  flex: 1;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #ff7043;
  box-shadow: 0 0 0 2px rgba(255, 112, 67, 0.1);
}

.divider {
  border-top: 1px solid #eee;
  margin: 20px 0;
}

.btn {
  width: 100%;
  padding: 12px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  font-size: 15px;
}

.btn.gradient-orange {
  background: linear-gradient(to right, #ff6b6b, #ff8e53);
  color: white;
  border: none;
}

.btn.gradient-orange:hover {
  box-shadow: 0 0 0 2px rgba(255, 112, 67, 0.2);
  transform: scale(1.02);
}

.btn.grey {
  background-color: #f2f2f2;
  color: #333;
}

.btn.grey:hover {
  background-color: #e0e0e0;
}

.btn.orange {
  background-color: #fff3e0;
  color: #e65100;
}

.btn.orange:hover {
  background-color: #ffd180;
}

.date-flex-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-flex-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .date-flex-wrapper {
    flex-direction: row;
    gap: 12px;
  }

  .button-flex-wrapper {
    flex-direction: row;
  }

  .button-flex-wrapper .btn {
    width: 100%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-in-out;
}
</style>