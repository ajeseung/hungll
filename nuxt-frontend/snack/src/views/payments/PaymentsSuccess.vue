<template>
  <div class="wrapper">
    <h2>결제가 완료되었습니다 🎉</h2>
    <div class="info-card">
      <p><strong>주문 번호:</strong> {{ result?.orderId }}</p>
      <p><strong>결제 금액:</strong> {{ result?.amountWithCurrency }}</p>
      <p><strong>결제 수단:</strong> {{ result?.method }}</p>
      <p><strong>결제 일시:</strong> {{ formatDate(result?.approvedAt) }}</p>
      <a
        v-if="result?.receipt_url"
        :href="result.receipt_url"
        target="_blank"
        class="receipt-link" 
      >
        영수증 확인하기
      </a>
    </div>
    <router-link to="/mypage">
      <button class="go-mypage">마이페이지로 이동</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { usePaymentsStore } from '@/store/payments/paymentsStore'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const paymentsStore = usePaymentsStore()
const route = useRoute()
const result = ref<any>(null)

onMounted(async () => {
  const paymentKey = route.query.paymentKey
  const orderId = route.query.orderId
  const amount = Number(route.query.amount)

  if (paymentKey && orderId && amount) {
    try {
      const response = await paymentsStore.processPayment(
        paymentKey as string,
        orderId as string,
        amount,
        Number(localStorage.getItem('orderInfoId'))
      )
      result.value = response
    } catch (error) {
      console.error('❌ 결제 처리 실패:', error)
    }
  }
})

const formatDate = (iso: string) => {
  if (!iso) return 'N/A'
  const date = new Date(iso)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}

</script>

<style scoped>
.wrapper {
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
}
.info-card {
  background: #fff8ee;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 20px 0;
}
.go-mypage {
  background: #ff9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
}

.receipt-link {
  color: #e65100;         
  font-weight: bold;
  text-decoration: underline;
}



</style>
