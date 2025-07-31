import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const subscribeRepository = {
  async getSubscribeStatus(): Promise<any | null> {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    try {
      const { data } = await axios.get(`/subscribe/status?subscriberId=${accountId}`)
      return data
    } catch (error: any) {
      if (error.response?.status === 204) return null 
      throw error
    }
  },

  async cancelSubscribe() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.post('/subscribe/cancel', {
      subscriberId: accountId,
    })

    return data
  },

  async renewScheduledSubscriptions() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.post('/subscribe/renew')
    return data.message
  },

  async deactivateExpiredSubscriptions() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.post('/subscribe/deactivate')
    return data.message
  },

  async getSubscribeHistory() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get(`/subscribe/history?subscriberId=${accountId}`)
    return data.history
  },

  async getSubscribeList() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get('/subscribe/list')
    return data
  },
}
