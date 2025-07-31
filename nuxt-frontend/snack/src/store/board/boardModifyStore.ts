import { defineStore } from 'pinia'
import { boardDetailRepository } from '@/repository/board/boardDetailRepository'
import { boardModifyRepository } from '@/repository/board/boardModifyRepository'
import { uploadImageToS3 } from '@/common/utils/awsS3Instance'

interface BoardModify {
  board_id: number | null
  title: string
  content: string
  end_time: string
  restaurant?: string
  restaurant_id?: number | null
  image_file?: File | null
  image_url?: string | null
  previous_image_url?: string | null
}

interface BoardModifyState {
  board: BoardModify
  isLoading: boolean
  isSuccess: boolean
  errorMessage: string | null
  restaurantList: any[]
  restaurantSearchKeyword: string
}

export const useBoardModifyStore = defineStore('boardModifyStore', {
  state: (): BoardModifyState => ({
    board: {
      board_id: null,
      title: '',
      content: '',
      end_time: '',
      restaurant: '',
      restaurant_id: null,
      image_file: null,
      image_url: null,
      previous_image_url: null,
    },
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
    restaurantList: [],
    restaurantSearchKeyword: '',
  }),

  actions: {
    async fetchBoard(boardId: number) {
      this.isLoading = true
      this.errorMessage = null
      this.isSuccess = false

      try {
        const data = await boardDetailRepository.getBoardDetail(boardId)
        if (data?.board_id) {
          this.board = {
            board_id: data.board_id,
            title: data.title,
            content: data.content || '',
            end_time: data.end_time,
            restaurant: data.restaurant || '',
            restaurant_id: data.restaurant_id || null,
            image_url: data.image_url || null,
            previous_image_url: data.image_url || null,
            image_file: null,
          }
          this.isSuccess = true
        } else {
          this.errorMessage = '게시글을 찾을 수 없습니다.'
        }
      } catch (err) {
        console.error('❌ 게시글 불러오기 실패:', err)
        this.errorMessage = '게시글 정보를 불러오는 데 실패했습니다.'
      } finally {
        this.isLoading = false
      }
    },

    async updateBoard() {
      const board = this.board

      if (!board.board_id || !board.title?.trim() || !board.content?.trim() || !board.end_time) {
        alert('제목, 내용, 종료일은 필수입니다.')
        return false
      }

      this.isLoading = true
      this.errorMessage = null

      try {
        if (board.image_file) {
          const imageUrl = await uploadImageToS3(board.image_file)
          console.log('✅ 업로드 후 반환된 imageUrl:', imageUrl)
          board.image_url = imageUrl
        } else if (board.image_url === null) {
          board.image_url = ''
        }

        const payload = {
          board_id: board.board_id,
          title: board.title,
          content: board.content,
          end_time: board.end_time,
          restaurant_id: board.restaurant_id ?? null,
          image_url: board.image_url ?? null,
          previous_image_url: board.previous_image_url,
        }

        console.log('📤 최종 수정 payload:', payload)

        await boardModifyRepository.requestUpdateBoard(payload)
        this.isSuccess = true
        return true
      } catch (error) {
        console.error('❌ 게시글 수정 실패:', error)
        this.errorMessage = '게시글 수정 실패'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async loadAllRestaurants() {
      this.restaurantList = await boardModifyRepository.fetchAllRestaurants()
    },

    async searchRestaurantList() {
      if (!this.restaurantSearchKeyword.trim()) {
        await this.loadAllRestaurants()
        return
      }
      this.restaurantList = await boardModifyRepository.searchRestaurants(this.restaurantSearchKeyword)
    },
  },
})
