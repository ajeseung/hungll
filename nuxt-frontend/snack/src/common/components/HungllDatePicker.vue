<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="calendar-modal" ref="popup">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">‹</button>
        <span class="month-text">{{ year }}년 {{ month + 1 }}월</span>
        <button class="nav-btn" @click="nextMonth">›</button>
      </div>

      <div class="calendar-grid">
        <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
        <div v-for="blank in firstDayOfMonth" :key="'blank-' + blank" class="empty" />
        <div
          v-for="day in daysInMonth"
          :key="day"
          :class="['date-cell', { selected: isSelected(day), today: isToday(day) }]"
          @click="selectDate(day)"
        >
          {{ day }}
        </div>
      </div>

      <button class="today-btn" @click="selectToday">오늘</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose } from 'vue'

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const props = defineProps<{ modelValue: string }>()

const today = new Date()
const year = ref(today.getFullYear())
const month = ref(today.getMonth())
const selected = ref(props.modelValue || '')
const visible = ref(false)
const popup = ref(null)

const weekDays = ['일', '월', '화', '수', '목', '금', '토']

const firstDayOfMonth = computed(() => {
  return new Date(year.value, month.value, 1).getDay()
})

const daysInMonth = computed(() => {
  return new Date(year.value, month.value + 1, 0).getDate()
})

const formatDate = (day: number) => {
  return `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const selectDate = (day: number) => {
  const formatted = formatDate(day)
  selected.value = formatted
  emit('update:modelValue', formatted)
  close()
}

const selectToday = () => {
  const now = new Date()
  year.value = now.getFullYear()
  month.value = now.getMonth()
  selectDate(now.getDate())
}

const isSelected = (day: number) => {
  return selected.value.endsWith(`-${String(day).padStart(2, '0')}`)
}

const isToday = (day: number) => {
  return formatDate(day) === today.toISOString().split('T')[0]
}

const prevMonth = () => {
  if (month.value === 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
}

const nextMonth = () => {
  if (month.value === 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
}

const open = () => {
  visible.value = true
}
const close = () => {
  visible.value = false
}

defineExpose({ open, close })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-modal {
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 280px;
  max-width: 90vw;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Noto Sans KR', sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.month-text {
  font-weight: 700;
  color: #ff7043;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #ff7043;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  color: #333;
}

.empty {
  visibility: hidden;
}

.date-cell {
  text-align: center;
  font-size: 13px;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
}

.date-cell:hover {
  background-color: #fff3e0;
  color: #ff7043;
}

.date-cell.selected {
  background-color: #ff7043;
  color: white;
  font-weight: bold;
}

.date-cell.today {
  border: 2px solid #ff7043;
}

.today-btn {
  width: 100%;
  padding: 10px 0;
  font-size: 14px;
  background-color: #ff7043;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 12px;
}

.today-btn:hover {
  background-color: #ff5722;
}
</style>
