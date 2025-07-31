import { useRuntimeConfig } from '#app'

interface BoardCreatePayload {
  title: string
  content: string
  image_url?: string
  end_time: string
  restaurant_id?: number 
  author_id?: number
}

// ✅ 공통 컨텍스트 로딩 함수
const getContext = async () => {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('userToken') || ''
  const accountId = localStorage.getItem('account_id') || ''
  const axios = await import('@/common/utils/axiosInstance').then(m =>
    m.createAxiosInstance(token, accountId)
  )
  return { config, token, accountId, axios }
}

export const boardCreateRepository = {
  // ✅ 게시글 생성
  async requestCreateBoard(payload: BoardCreatePayload) {
    const { config, token, accountId } = await getContext()

    if (!payload.title || !payload.content || !payload.end_time) {
      console.error('❌ 필수 항목 누락됨')
      throw new Error('필수 항목이 누락되었습니다.')
    }

    const authorId = payload.author_id ?? accountId
    if (!authorId) {
      console.error('❌ author_id 없음')
      throw new Error('로그인이 필요합니다.')
    }

    const jsonPayload = {
      title: payload.title,
      content: payload.content,
      end_time: payload.end_time,
      author_id: Number(authorId),
      restaurant_id: payload.restaurant_id,
      image_url: payload.image_url ?? null,
    }

    const url = `${config.public.MAIN_API_URL}/board/create`
    console.log('📡 요청 URL:', url)
    console.log('📦 전송 payload:', jsonPayload)

    try {
      const res = await $fetch(url, {
        method: 'POST',
        body: jsonPayload,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Account-Id': accountId,
        },
      })

      console.log('✅ 게시글 생성 성공 응답:', res)
      return res
    } catch (error: any) {
      console.error('❌ 요청 중 오류 발생')
      if (error.response) {
        console.error('❌ 서버 응답:', error.response)
      } else if (error.data) {
        console.error('❌ 서버 응답 데이터:', error.data)
      } else {
        console.error('❌ 기타 에러:', error.message || error)
      }
      throw error
    }
  },

  // ✅ 전체 식당 목록 가져오기
  async fetchAllRestaurants() {
    const { config, axios } = await getContext()
    const { data } = await axios.get(`/restaurant/list`)
    return data
  },

  // ✅ 키워드로 식당 검색
  async searchRestaurants(keyword: string) {
    const { config, axios } = await getContext()
    const { data } = await axios.get(`/restaurant/search/?keyword=${encodeURIComponent(keyword)}`)
    return data
  },
}
