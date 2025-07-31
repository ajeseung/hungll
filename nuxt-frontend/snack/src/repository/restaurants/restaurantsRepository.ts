// src/repository/restaurants/restaurantsRepository.ts
import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const restaurantsRepository = {
  async fetchAllRestaurants() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get('/restaurant/list')
    return data
  },

  async searchRestaurants(keyword: string) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get(`/restaurant/search?keyword=${encodeURIComponent(keyword)}`)
    return data
  },

  async fetchRestaurantBoardCounts() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get('/board/count')
    return Array.isArray(data.data) ? data.data : []
  },

  async getMyScraps() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.get('/account-scrap/my')
    return data.scraps || []
  },

  async createScrap(restaurantId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const { data } = await axios.post('/account-scrap/create', {
      restaurant_id: restaurantId,
    })
    return data
  },

  async deleteScrapByRestaurantId(restaurantId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const scraps = await restaurantsRepository.getMyScraps()
    const scrap = scraps.find(s => s.restaurant_id === restaurantId)
    if (!scrap) return

    const { data } = await axios.delete(`/account-scrap/delete/${scrap.scrap_id}`)
    return data
  }
}
