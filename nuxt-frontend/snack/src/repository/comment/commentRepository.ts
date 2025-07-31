const getAxios = async () => {
  const { createAxiosInstance } = await import('@/common/utils/axiosInstance')  
  const token = process.client ? localStorage.getItem('userToken') || '' : ''
  const accountId = process.client ? localStorage.getItem('account_id') || '' : ''
  return createAxiosInstance(token, accountId)
}

export const commentRepository = {

  async fetchCommentsByBoard(boardId: number, page = 1) {
    const axios = await getAxios()
    const response = await axios.get(`/comment/board/${boardId}?page=${page}&page_size=10`)
    return {
      comments: response.data?.comments || [],
      total: response.data?.total || 0,
    }
  },

  async createComment(payload: { board_id: number; content: string; author_id: number }) {
    const axios = await getAxios()
    const response = await axios.post('/comment/create', payload)
    return response.data
  },

  async createReply(payload: { board_id: number; content: string; parent_id: number; author_id: number }) {
    const axios = await getAxios()
    const response = await axios.post('/comment/reply', payload)
    return response.data
  },

  async deleteComment(commentId: number) {
    const axios = await getAxios()
    const response = await axios.delete(`/comment/delete/${commentId}`)
    return response.data?.success === true
  },

  async updateComment(commentId: number, content: string) {
    const axios = await getAxios()
    const response = await axios.put(`/comment/update/${commentId}`, { content })
    return response.data?.success === true
  },
}
