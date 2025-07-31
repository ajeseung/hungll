export const boardDeleteRepository = {
    async requestDeleteBoard(boardId: number) {
      if (!boardId) throw new Error('게시글 ID가 필요합니다.')

      const getAxios = async () => {
        const { createAxiosInstance } = await import('@/common/utils/axiosInstance')
        const token = localStorage.getItem('userToken') || ''
        const accountId = localStorage.getItem('account_id') || ''
        return createAxiosInstance(token, accountId)
      }

      try {
        const axios = await getAxios()
        const res = await axios.delete(`/board/delete/${boardId}`)

        if (res?.data?.success) {
          console.log('✅ 게시글 삭제 성공')
          return true
        } else {
          console.warn('⚠️ 게시글 삭제 실패: ', res?.data?.message || '응답 없음')
          return false
        }
      } catch (error: any) {
        console.error('❌ 게시글 삭제 실패:', error.response?.data || error.message)
        throw error
      }
    }
}
