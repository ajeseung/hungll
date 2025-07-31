import { defineStore } from 'pinia'
import { restaurantsRepository } from '@/repository/restaurants/restaurantsRepository'

export interface Restaurant {
  id: number
  name: string
  rating: number
  category: string
  reviewCount: number
  address: string
  latitude: number
  longitude: number
  closed?: string
  friendCount?: number
  created_at: string
}

interface BoardCountResponse {
  restaurant_id: number | null
  board_count: number
}

export const useRestaurantsStore = defineStore('restaurants', {
  state: () => ({
    restaurantList: [] as Restaurant[],
    searchKeyword: '',
    boardCounts: {} as Record<number, number>,
    scraps: [] as { restaurant_id: number; scrap_id: number } [],
    scrapList: [] as Restaurant[],

    // ✅ 선택된 식당 정보 저장용
    selectedRestaurant: {
      name: '',
      latitude: 0,
      longitude: 0
    }
  }),
  actions: {
    async loadAllRestaurants() {
      this.restaurantList = await restaurantsRepository.fetchAllRestaurants()
    },

    async searchRestaurants() {
      if (!this.searchKeyword.trim()) {
        await this.loadAllRestaurants()
        return
      }

      const restaurants: Restaurant[] = await restaurantsRepository.searchRestaurants(this.searchKeyword)
      const counts: BoardCountResponse[] = await restaurantsRepository.fetchRestaurantBoardCounts()

      const boardCountMap: Record<number, number> = {}
      counts.forEach((item: BoardCountResponse) => {
        const { restaurant_id, board_count } = item
        if (restaurant_id !== null) {
          boardCountMap[restaurant_id] = board_count
        }
      })

      this.restaurantList = restaurants.map((r: Restaurant) => ({
        ...r,
        friendCount: boardCountMap[r.id] || 0
      }))
    },

    async loadBoardCounts() {
      const counts: BoardCountResponse[] = await restaurantsRepository.fetchRestaurantBoardCounts()

      const boardCountMap: Record<number, number> = {}
      counts.forEach((item: BoardCountResponse) => {
        const { restaurant_id, board_count } = item
        if (restaurant_id !== null) {
          boardCountMap[restaurant_id] = board_count
        }
      })

      this.restaurantList = this.restaurantList.map((r: Restaurant) => ({
        ...r,
        friendCount: boardCountMap[r.id] || 0
      }))
    },

    async loadScraps() {
      const scraps = await restaurantsRepository.getMyScraps()
      this.scraps = scraps.map((s: any) => ({
        restaurant_id: s.restaurant_id,
        scrap_id: s.scrap_id
      }))
    },

    isRestaurantScrapped(restaurantId: number) {
      return this.scraps.some(s => s.restaurant_id === restaurantId)
    },    

    async toggleScrap(restaurantId: number) {
      if (this.isRestaurantScrapped(restaurantId)) {
        await restaurantsRepository.deleteScrapByRestaurantId(restaurantId)
      } else {
        await restaurantsRepository.createScrap(restaurantId)
      }
      await this.loadScraps()
    },

    async loadScrapsFromServer() {
      const scraps = await restaurantsRepository.getMyScraps()
      // 필요 시 backend에서 restaurant 전체 정보를 함께 제공하거나 추가 조회
      this.scrapList = scraps.map(s => ({
        id: s.restaurant_id,
        name: s.restaurant_name,
        created_at: s.created_at
        // 필요한 경우 다른 필드도 추가
      }))
    },

    setSelectedRestaurant(restaurant: Restaurant) {
      this.selectedRestaurant = { ...restaurant }
    }    
  }
})
