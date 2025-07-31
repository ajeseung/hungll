import { defineStore } from 'pinia'
import { paymentsRepository } from '@/repository/payments/paymentsRepository'

export type PaymentInfo = {
  orderId: string
  planName: string
  amountWithCurrency: string
  method: string
  receipt_url: string
  approvedAt: string
}

export const usePaymentsStore = defineStore('paymentsStore', {
  state: () => ({
    paymentResult: null as any,
    paymentInfo: null as PaymentInfo | null,
  }),
  actions: {
    async processPayment(paymentKey: string, orderId: string, amount: number, orderInfoId: number) {
      const userToken = localStorage.getItem('userToken') || ''
      if (!userToken) throw new Error('userToken이 없습니다.')

        const result = await paymentsRepository.processPayment(
          paymentKey,
          orderId,
          amount,
          orderInfoId
        )
      this.paymentResult = result
      this.paymentInfo = {
        orderId: result.orderId,
        planName: result.planName,
        amountWithCurrency: result.amountWithCurrency,
        method: result.method,
        receipt_url: result.receipt_url,
        approvedAt: result.approvedAt,
      }
      localStorage.setItem('paymentInfo', JSON.stringify(this.paymentInfo))
      return result
    },
  },
})
