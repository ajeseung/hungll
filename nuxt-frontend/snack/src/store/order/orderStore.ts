import { defineStore } from 'pinia'
import { orderRepository } from '@/repository/order/orderRepository'

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orderId: null as number | null,
  }),
  actions: {
    async createOrder(subscribeId: number, price: number) {
      const id = await orderRepository.createOrder(subscribeId, price)
      this.orderId = id
      localStorage.setItem('orderInfoId', String(id))
      return id
    },
  },
})
