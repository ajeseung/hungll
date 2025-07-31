import { defineStore } from 'pinia'
import { boardCreateRepository } from '@/repository/board/boardCreateRepository'

interface BoardCreatePayload {
  title: string
  content: string
  end_time: string
  restaurant_id?: number
  author_id?: number
  image_url?: string 
}

export const useBoardCreateStore = defineStore('boardCreate', {
  state: () => ({
    title: '',
    content: '',
    image_url: "" as string | "",
    end_time: '',
    restaurant_id: null as number | null,
    restaurantList: [] as any[],
    restaurantSearchKeyword: '',
    image_file: null as File | null, 
  }),
  actions: {
    // ✅ 게시글 생성
    async requestCreateBoard(payload: BoardCreatePayload) {
      const finalPayload = {
        title: payload.title,
        content: payload.content,
        image_url: this.image_url ?? "",
        end_time: payload.end_time,
        restaurant_id: payload.restaurant_id ?? undefined,
        author_id: payload.author_id,
      }
  
      console.log('📤 게시글 생성 요청 payload:', finalPayload)
      return await boardCreateRepository.requestCreateBoard(finalPayload)
    },

    // ✅ 전체 식당 목록 불러오기
    async loadAllRestaurants() {
      this.restaurantList = await boardCreateRepository.fetchAllRestaurants()
    },

    // ✅ 식당 검색
    async searchRestaurantList() {
      if (!this.restaurantSearchKeyword.trim()) {
        await this.loadAllRestaurants()
        return
      }
      this.restaurantList = await boardCreateRepository.searchRestaurants(this.restaurantSearchKeyword)
    },

    // ✅ 상태 초기화
    reset() {
      this.title = ''
      this.content = ''
      this.end_time = ''
      this.image_url = ''
      this.image_file = null
      this.restaurant_id = null
      this.restaurantSearchKeyword = ''
    }
  }  
})
