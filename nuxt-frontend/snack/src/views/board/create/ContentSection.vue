<template>
  <div class="section-card">
    <h2 class="section-title">
      📝 모임 소개 작성
      <span class="reset-icon" @click="resetAll">🔄</span>
    </h2>

    <!-- 분위기 선택 -->
    <div class="chip-row">
      <span
        v-for="option in moods"
        :key="option"
        class="chip mood"
        :class="{ selected: mood === option }"
        @click="selectMood(option)"
      >
        {{ moodEmojis[option] }} {{ option }}
      </span>
    </div>

    <!-- 메뉴 예시 -->
    <div class="chip-row">
      <span
        v-for="menu in menus"
        :key="menu"
        class="chip"
        :class="{ selected: selectedMenu === menu }"
        @click="selectMenu(menu)"
      >
        {{ menu }}
      </span>
    </div>

    <!-- 시간대 예시 -->
    <div class="chip-row">
      <span
        v-for="time in timeOptions"
        :key="time"
        class="chip"
        :class="{ selected: selectedTime === time }"
        @click="selectTime(time)"
      >
        {{ time }}
      </span>
    </div>

    <!-- 인원 수 예시 -->
    <div class="chip-row">
      <span
        v-for="people in peopleOptions"
        :key="people"
        class="chip"
        :class="{ selected: selectedPeople === people }"
        @click="selectPeople(people)"
      >
        {{ people }}
      </span>
    </div>

    <!-- 제목 입력 -->
    <div class="input-wrapper">
      <label class="input-label">
        모임 제목
        <span v-if="isTitleInvalid" style="color: red; font-size: 12px; margin-left: 8px">* 필수항목</span>
      </label>
      <input v-model="title" class="search-input" placeholder="제목을 입력하세요" />
    </div>

    <!-- 소개 입력 -->
    <div class="input-wrapper">
      <label class="input-label">
        모임 소개
        <span v-if="isContentInvalid" style="color: red; font-size: 12px; margin-left: 8px">* 필수항목</span>
      </label>
      <textarea
        v-model="content"
        class="search-input"
        placeholder="내용을 입력하세요"
        rows="6"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBoardCreateStore } from '@/store/board/boardCreateStore'
import { storeToRefs } from 'pinia'

const props = defineProps<{ isTitleInvalid: boolean; isContentInvalid: boolean }>()

const boardStore = useBoardCreateStore()
const { title, content } = storeToRefs(boardStore)
const mood = ref('귀엽게')
const selectedMenu = ref('')
const selectedTime = ref('')
const selectedPeople = ref('')

const moods = ['귀엽게', '예쁘게', '진지하게', '편안하게']
const moodEmojis: Record<string, string> = {
  귀엽게: '🐣',
  예쁘게: '🌸',
  진지하게: '📌',
  편안하게: '🍃',
}

const menus = [
  '치킨', '파스타', '삼겹살', '초밥', '쭈꾸미',
  '라멘', '떡볶이', '감바스', '카페 디저트', '전통주'
]
const timeOptions = ['점심', '저녁', '브런치', '심야 번개']
const peopleOptions = ['2명', '3~4명', '5~6명', '7명 이상']

const selectMood = (val: string) => {
  mood.value = val
  resetDetails()
}

const selectMenu = (val: string) => {
  selectedMenu.value = val
  generateText()
}

const selectTime = (val: string) => {
  selectedTime.value = val
  generateText()
}

const selectPeople = (val: string) => {
  selectedPeople.value = val
  generateText()
}

const resetDetails = () => {
  selectedMenu.value = ''
  selectedTime.value = ''
  selectedPeople.value = ''
  title.value = ''
  content.value = ''
}

const resetAll = () => {
  mood.value = '귀엽게'
  resetDetails()
}

const generateText = () => {
  if (!(selectedMenu.value && selectedTime.value && selectedPeople.value)) return

  const emoji = moodEmojis[mood.value]
  const time = selectedTime.value
  const menu = selectedMenu.value
  const people = selectedPeople.value

  title.value = `${time}에 ${menu} 모임 ${emoji || ''}`

  if (mood.value === '귀엽게') {
    content.value = `${time}에 ${menu} 먹으면서 수다 떨어요! 🐥\n${people} 정도면 딱 좋아요. 함께 맛있는 시간 보내요~ 💬✨`
  } else if (mood.value === '예쁘게') {
    content.value = `감성 가득한 ${time} 모임, ${menu}와 함께 분위기를 즐겨봐요. 🌸\n${people}의 소중한 인연들과 아름다운 시간을 나눠요 :)`
  } else if (mood.value === '편안하게') {
    content.value = `${time}에 가볍게 만나요. ${menu} 먹으며 편하게 이야기 나누는 모임이에요. 🍃\n${people}이라 부담 없고 딱 좋아요!`
  } else {
    content.value = `${people}이 함께하는 ${menu} 모임입니다. 📌\n${time}에 만나 진지한 이야기와 의미 있는 시간을 나누어요.`
  }
}
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reset-icon {
  font-size: 18px;
  cursor: pointer;
  color: #888;
  transition: 0.2s;
}

.reset-icon:hover {
  transform: rotate(-20deg);
  color: #ff7043;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.chip {
  background-color: #eeeeee;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  color: #444;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
}

.chip:hover {
  background-color: #ff7043;
  color: white;
  transform: scale(1.05);
}

.chip:active {
  transform: scale(0.95);
}

.chip.selected {
  background-color: #ff7043;
  color: white;
}

.input-wrapper {
  margin-top: 20px;
  margin-bottom: 16px;
  flex: 1;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  transition: 0.2s;
  resize: none;
}

.search-input:focus {
  outline: none;
  border-color: #ff7043;
  box-shadow: 0 0 0 2px rgba(255, 112, 67, 0.2);
}
</style>
