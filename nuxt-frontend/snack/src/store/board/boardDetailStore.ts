import { defineStore } from 'pinia'
import { boardDetailRepository } from '@/repository/board/boardDetailRepository'

interface BoardDetail {
  board_id: number
  title: string
  content: string
  author_nickname: string
  created_at: string
  end_time: string
  image?: File | string | null
  image_url?: string
  status: string
  restaurant?: string
  restaurant_id?: string
  is_author?: boolean
}

interface BoardDetailState {
  board: BoardDetail | null
  isLoading: boolean
  isSuccess: boolean
  errorMessage: string | null
}

export const useBoardDetailStore = defineStore('boardDetailStore', {
  state: (): BoardDetailState => ({
    board: null,
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
  }),
  actions: {
    async requestDetailBoard(boardId: number) {
      this.isLoading = true
      this.errorMessage = null
      this.isSuccess = false

      try {
        const data = await boardDetailRepository.getBoardDetail(boardId)
        console.log("🔎 상세보기 데이터:", data);

        if (data && data.board_id) {
          this.board = data
          this.isSuccess = true
        } else {
          this.errorMessage = '게시글을 찾을 수 없습니다.'
        }
      } catch (err) {
        console.error('❌ 상세 게시글 요청 에러:', err)
        this.errorMessage = '게시글을 불러오는 데 실패했습니다.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
