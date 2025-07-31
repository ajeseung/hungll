<template>
  <div class="subscribe-select-page">
    <h2 class="title">Hungll Pass</h2>

    <div class="plans">
      <div
        v-for="plan in subscribeStore.subscribeList"
        :key="plan.id"
        :class="['plan-card', { selected: selectedSubscribe?.id === plan.id }]"
        @click="selectSubscribe(plan)"
      >
        <h3 class="plan-name">{{ plan.name }}</h3>
        <p class="price">가격: {{ plan.price.toLocaleString() }}원 / 월</p>
        <ul class="plan-desc">
          <li v-if="plan.plan_type === 'BASIC'">💬 1:1 채팅 가능</li>
          <li v-if="plan.plan_type === 'BASIC'">❌ 취향 기반 밥친구 자동 매칭 불가</li>
          <li v-if="plan.plan_type === 'PREMIUM'">💬 1:1 채팅 가능</li>
          <li v-if="plan.plan_type === 'PREMIUM'">👥 취향 기반 밥친구 자동 매칭 가능</li>
        </ul>
  
      </div>
    </div>

    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

    <button
      class="confirm-btn"
      @click="handleSubscribe"
      :disabled="!selectedSubscribe"
    >
      구독하기
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubscribeStore } from '@/store/subscribe/subscribeStore'
import { useOrderStore } from '@/store/order/orderStore'

const subscribeStore = useSubscribeStore()
const orderStore = useOrderStore()
const router = useRouter()

const selectedSubscribe = ref<any | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try {
    await subscribeStore.loadSubscribeList()
  } catch (error) {
    errorMessage.value = '구독 상품을 불러오지 못했습니다.'
  }
})

const selectSubscribe = (plan: any) => {
  selectedSubscribe.value = plan
}

const handleSubscribe = async () => {
  if (!selectedSubscribe.value) return

  try {
    await orderStore.createOrder(selectedSubscribe.value.id, selectedSubscribe.value.price)
    router.push({
      path: '/payments/progress',
      query: {
        amount: selectedSubscribe.value.price,
      },
    })

  } catch (error) {
    errorMessage.value = '주문 생성에 실패했습니다. 다시 시도해주세요.'
  }
}
</script>

<style scoped>
.subscribe-select-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #000; 
  margin-bottom: 24px;
}

.plans {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.plan-card {
  width: 300px;
  padding: 20px;
  background: #fefefe;
  border: 2px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
}

.plan-card.selected {
  border-color: #ff9800;
  background-color: #fff8ee;
}

.plan-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.price {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ff6f00;
}

.plan-desc {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.confirm-btn {
  margin-top: 40px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border: none;
  border-radius: 999px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 16px;
}
</style>
