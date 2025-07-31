export const boardDetailRepository = {
  async getBoardDetail(boardId: number) {
    try {
      const { createAxiosInstance } = await import('@/common/utils/axiosInstance')

      const token = localStorage.getItem('userToken') || ''
      const accountId = localStorage.getItem('account_id') || ''
      const axios = createAxiosInstance(token, accountId)

      const { data } = await axios.get(`/board/${boardId}`)
      console.log('📥 boardDetail 응답:', data)
      return data
    } catch (error: any) {
      console.error('❌ 게시글 상세 요청 실패:', error)
      throw new Error(error?.response?.data?.error || '게시글 정보를 불러오지 못했습니다.')
    }
  },

  async updateBoard(board: any) {
    try {
      const { createAxiosInstance } = await import('@/common/utils/axiosInstance')

      const token = localStorage.getItem('userToken') || ''
      const accountId = localStorage.getItem('account_id') || ''
      const axios = createAxiosInstance(token, accountId)

      const res = await axios.put(`/board/update/${board.board_id}`, {
        title: board.title,
        content: board.content,
        end_time: board.end_time,
        restaurant: board.restaurant_,
      })

      console.log('📤 게시글 수정 응답:', res.data)

      return res?.data?.success || false
    } catch (error: any) {
      console.error('❌ 게시글 수정 실패:', error)
      throw new Error(error?.response?.data?.error || '게시글 수정에 실패했습니다.')
    }
  },
}
