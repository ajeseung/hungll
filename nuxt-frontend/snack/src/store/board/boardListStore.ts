// src/store/board/boardListStore.ts
import { defineStore } from 'pinia'
import { boardListRepository } from '@/repository/board/boardListRepository'

interface Board {
  board_id: number
  title: string
  author_nickname: string
  end_time: string
  status: string
  image_url: string
  created_at?: string
  author_account_id?: string
}


interface BoardState {
  boardList: Board[]
  currentPage: number
  totalPages: number
}

export const useBoardListStore = defineStore('boardListStore', {
  state: (): BoardState => ({
    boardList: [],
    currentPage: 1,
    totalPages: 0,
  }),

  actions: {
    async fetchBoardList(params: {
      page: number
      perPage: number
      title?: string
      author?: string
      start_date?: string
      end_date?: string
      status?: string
      sort?: string
    }) {
      const res = await boardListRepository.requestBoardList(params)
      this.boardList = res.boardList
      this.currentPage = res.currentPage
      this.totalPages = res.totalPages
    },
  },
})
