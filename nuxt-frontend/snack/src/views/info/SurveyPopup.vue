<template>
  <div class="popup-wrapper" v-if="showPopup">
    <div class="popup-card">
      <h3>🎁 헝글 설문조사 이벤트</h3>
      <p>
        헝글 사용자 설문에 참여해 주세요!<br />
        추첨을 통해 <strong>커피 기프티콘</strong>을 드립니다 ☕
      </p>
      <a class="survey-link" href="https://forms.gle/s1jEmkEfZwyLbvKr5" target="_blank">
        👉 설문 참여하러 가기
      </a>
      <div class="btn-group">
        <button class="plain-btn" @click="closeToday">오늘 하루 그만 보기</button>
        <button class="plain-btn" @click="showPopup = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const showPopup = ref(false)

onMounted(() => {
  const today = new Date().toISOString().split('T')[0]
  const hideDate = localStorage.getItem('survey-popup-hide-date')

  if (hideDate !== today) {
    showPopup.value = true
  }
})

function closeToday() {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem('survey-popup-hide-date', today)
  showPopup.value = false
}
</script>

<style scoped>
.popup-wrapper {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 92%;
  max-width: 360px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.popup-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  font-family: 'Pretendard', sans-serif;
  color: #333;
  text-align: center;
}

.popup-card h3 {
  margin: 0 0 12px;
  font-size: 17px;
  color: #ff5722;
  font-weight: 700;
}

.popup-card p {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 18px;
  color: #444;
}

.survey-link {
  display: block;
  background: linear-gradient(to right, #ff9800, #ff5722);
  color: white;
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  margin-bottom: 16px;
  transition: background 0.3s ease;
}
.survey-link:hover {
  background: linear-gradient(to right, #ffa000, #f4511e);
}

.btn-group {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.plain-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}
.plain-btn:hover {
  color: #555;
}

@media (max-width: 768px) {
  .popup-card {
    padding: 16px;
  }
  .popup-card h3 {
    font-size: 15px;
  }
  .popup-card p {
    font-size: 13px;
  }
  .plain-btn {
    font-size: 12px;
  }
}
</style>
