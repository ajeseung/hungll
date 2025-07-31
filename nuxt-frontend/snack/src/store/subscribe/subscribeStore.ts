import { defineStore } from 'pinia'
import { subscribeRepository } from '@/repository/subscribe/subscribeRepository'

export const useSubscribeStore = defineStore('subscribeStore', {
  state: () => ({
    isSubscribed: false,
    planName: '',
    endDate: '',
    history: [] as any[],
    subscribeList: [] as any[],
  }),

  actions: {
    async loadSubscribeStatus() {
      try {
        const status = await subscribeRepository.getSubscribeStatus()

        if (status) {
          this.isSubscribed = status.is_subscribed  
          this.planName = this.getPlanDisplayName(status.plan_type) 
          this.endDate = status.end_date
        } else {
          this.isSubscribed = false
        }
      } catch (error) {
        this.isSubscribed = false
      }
    },

    async cancelSubscribe() {
      try {
        await subscribeRepository.cancelSubscribe()
        this.isSubscribed = false
        this.planName = ''
        this.endDate = ''
      } catch (error) {
        throw error
      }
    },

    async loadSubscribeHistory() {
      try {
        this.history = await subscribeRepository.getSubscribeHistory()
      } catch (error) {
        this.history = []
      }
    },


    async loadSubscribeList() {
      try {
        this.subscribeList = await subscribeRepository.getSubscribeList()
      } catch (error) {
        this.subscribeList = []
      }
    },

    getPlanDisplayName(planType: string) {
      const map: Record<string, string> = {
        BASIC: 'Hungll Pass Basic',
        PREMIUM: 'Hungll Pass Premium',
      }
      return map[planType] || planType
    },
  },
})
