import { defineStore } from 'pinia'
import { boardDeleteRepository } from '@/repository/board/boardDeleteRepository'

interface BoardDeleteState {
  isLoading: boolean
  isSuccess: boolean
  errorMessage: string | null
}

export const useBoardDeleteStore = defineStore('boardDeleteStore', {
  state: (): BoardDeleteState => ({
    isLoading: false,
    isSuccess: false,
    errorMessage: null
  }),

  actions: {
    async deleteBoard(boardId: number): Promise<boolean> {
      this.isLoading = true
      this.errorMessage = null
      this.isSuccess = false

      try {
        const success = await boardDeleteRepository.requestDeleteBoard(boardId)
        this.isSuccess = success
        return success
      } catch (error: any) {
        console.error('❌ 게시글 삭제 실패:', error)
        this.errorMessage = error?.response?.data?.message || '게시글 삭제 중 오류가 발생했습니다.'
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
})
