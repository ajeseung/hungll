<template>
  <div class="fail-page">
    <h2>❌ 결제에 실패했습니다</h2>
    <p>문제가 지속될 경우 고객센터로 문의해주세요.</p>
    <button class="retry-btn" @click="goBack">다시 시도하기</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goBack = () => {
  router.push('/subscribe/select')
}
</script>

<style scoped>
.fail-page {
  padding: 48px;
  text-align: center;
  color: #ff5722; /* 오렌지 계열 강조 */
}

.retry-btn {
  margin-top: 24px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background-color: #e65100;
}
</style>
