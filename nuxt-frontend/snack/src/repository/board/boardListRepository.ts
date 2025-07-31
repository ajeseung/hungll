// src/repository/board/boardListRepository.ts
import { createAxiosInstance } from '@/common/utils/axiosInstance'

const getAxios = () => {
  const token = localStorage.getItem('userToken') || ''
  const accountId = localStorage.getItem('account_id') || ''
  return createAxiosInstance(token, accountId)
}

interface BoardListRequestPayload {
  page: number
  perPage: number
  title?: string
  author?: string
  start_date?: string
  end_date?: string
  status?: string
  sort?: string
}

export const boardListRepository = {
  async requestBoardList(payload: BoardListRequestPayload) {
    try {
      const response = await getAxios().get('board/all', {
        params: {
          page: payload.page,
          per_page: payload.perPage,
          title: payload.title,
          author: payload.author,
          start_date: payload.start_date,
          end_date: payload.end_date,
          status: payload.status,
          sort: payload.sort,
        },
      })

      const { boards, total_pages, current_page } = response.data
      return {
        boardList: boards || [],
        totalPages: total_pages || 0,
        currentPage: current_page || 1,
      }
    } catch (error) {
      console.error('❌ boardListRepository > requestBoardList 오류:', error)
      return {
        boardList: [],
        totalPages: 0,
        currentPage: 1,
      }
    }
  },
}
