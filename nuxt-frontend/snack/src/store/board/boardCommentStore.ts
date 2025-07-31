import { defineStore } from 'pinia'
import { commentRepository } from '@/repository/comment/commentRepository'

export interface Comment {
  comment_id: number
  content: string
  author_nickname: string
  created_at: string
  author_account_id?: number
  is_deleted?: boolean
  is_author?: boolean
  is_admin?: boolean
  parent_id?: number
  replies?: Comment[]
}

interface CommentState {
  comments: Comment[]
  total: number
  isLoading: boolean
  isSuccess: boolean
  errorMessage: string | null
}

export const useCommentStore = defineStore('commentStore', {
  state: (): CommentState => ({
    comments: [],
    total: 0,
    isLoading: false,
    isSuccess: false,
    errorMessage: null,
  }),

  actions: {
    async loadComments(boardId: number, page = 1) {
      this.isLoading = true
      this.errorMessage = null
      try {
        const { comments, total } = await commentRepository.fetchCommentsByBoard(boardId, page)
        this.comments = comments
        this.total = total
        this.isSuccess = true
      } catch (error: any) {
        console.error('❌ 댓글 불러오기 실패:', error)
        this.errorMessage = error?.response?.data?.error || '댓글을 불러오는 데 실패했습니다.'
        this.isSuccess = false
      } finally {
        this.isLoading = false
      }
    },

    async addComment(boardId: number, content: string): Promise<boolean> {
      try {
        const author_id = process.client ? Number(localStorage.getItem('account_id')) : 0
        await commentRepository.createComment({ board_id: boardId, content, author_id })
        await this.loadComments(boardId)
        return true
      } catch (error) {
        console.error('❌ 댓글 등록 실패:', error)
        return false
      }
    },

    async addReply(boardId: number, parentId: number, content: string): Promise<boolean> {
      try {
        const author_id = process.client ? Number(localStorage.getItem('account_id')) : 0
        await commentRepository.createReply({ board_id: boardId, parent_id: parentId, content, author_id })
        await this.loadComments(boardId)
        return true
      } catch (error) {
        console.error('❌ 답글 등록 실패:', error)
        return false
      }
    },

    async deleteComment(commentId: number, boardId: number): Promise<boolean> {
      try {
        await commentRepository.deleteComment(commentId)
        await this.loadComments(boardId)
        return true
      } catch (error) {
        console.error('❌ 댓글 삭제 실패:', error)
        return false
      }
    },

    async updateComment(commentId: number, content: string, boardId: number): Promise<boolean> {
      try {
        await commentRepository.updateComment(commentId, content)
        await this.loadComments(boardId)
        return true
      } catch (error) {
        console.error('❌ 댓글 수정 실패:', error)
        return false
      }
    },
  },
})
