<template>
  <div class="payment-wrapper">
    <div class="payment-box">
      <h2>-결제-</h2>

      <p class="summary">
        결제 금액: {{ amount.toLocaleString() }}원
      </p>

      <div id="payment-method" class="toss-widget" />
      <div id="agreement" class="toss-widget" />

      <button @click="requestPayment" class="pay-button">
        결제하기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { nanoid } from 'nanoid'
import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk'

const route = useRoute()
const config = useRuntimeConfig()
const clientKey = config.public.TOSS_CLIENT_KEY
const amount = Number(route.query.amount || 0)

let widget: any = null
let paymentMethods: any = null
 
onMounted(async () => {
  
  await nextTick()

  widget = await loadPaymentWidget(clientKey, ANONYMOUS)
  paymentMethods = await widget.renderPaymentMethods(
    '#payment-method',
    { value: amount },
    { variantKey: 'DEFAULT' }
  )

  await widget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })
})

const requestPayment = async () => {
  if (!paymentMethods?.getSelectedPaymentMethod()) {
    alert('❗ 결제 수단을 선택해 주세요.')
    return
  }

  await widget.requestPayment({
    orderId: nanoid(),
    orderName: '헝글패스',
    customerName: '헝글',
    customerEmail: 'hungll@test.com',
    customerMobilePhone: '01012345678',
    successUrl: `${window.location.origin}/payments/success`,
    failUrl: `${window.location.origin}/payments/fail`
  })
}
</script>

<style scoped>
.payment-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  min-height: 100vh;
  background-color: #fdfdfd;
}

.payment-box {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  padding: 32px;
  text-align: center;
}

h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.summary {
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
}

.toss-widget {
  margin-bottom: 24px;
  min-height: 100px;
}

.pay-button {
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #ff6600;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.pay-button:hover {
  background-color: #e85c00;
}
</style>
