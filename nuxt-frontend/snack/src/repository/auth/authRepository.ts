import { createAxiosInstance } from '@/common/utils/axiosInstance'
import type { Provider } from '@/store/auth/authStore'

const getAxios = () => {
  const token = localStorage.getItem('userToken') || ''
  const accountId = localStorage.getItem('account_id') || ''

  return createAxiosInstance(token, accountId)
}

export const authRepository = {
  async getLoginUrl(provider: Provider): Promise<string> {
    const response = await getAxios().get(`/${provider}-oauth/request-login-url`)

    console.log('request rul 성공햇다는 뜻 -repo :' ,response.data.url)
    return response.data.url
  },

  async getAccessToken(provider: Provider, code: string) {
    const response = await getAxios().post(`/${provider}-oauth/redirect-access-token`, { code })
    const userToken = response.headers['usertoken'] || response.data.userToken
    const accountId = response.headers['account-id'] || response.data['account-id'];
    const statusCode = response.status 
    console.log('getAccessToken response -repo :' ,response)
    console.log('getAccessToken userToken  -repo:' ,userToken)
    console.log('getAccessToken accountId -repo :' ,accountId)

    if (!userToken || !accountId) {
      throw new Error('로그인 응답에 필요한 정보가 없습니다.')
    }

    return { userToken, accountId, statusCode }
  },

  async logout(provider: Provider, userToken: string) {
    await getAxios().post(`/authentication/${provider}-logout`, { userToken })
    
    console.log('123')
    localStorage.removeItem('userToken')
    localStorage.removeItem('account_id')
    localStorage.removeItem('isAmdin')
  },

  async validateToken(userToken: string): Promise<boolean> {
    const response = await getAxios().post('/authentication/validation', { userToken })
    return !!response.data?.valid
  },

  // ✅ 여기가 탈퇴 API 
  async deactivateAccount(accountId: string) {
    try {
      const response = await getAxios().post('/delete-account/account/deactivate', {
        account_id: accountId,
      })
      return response.data
    } catch (error) {
      console.error('🔴 계정 비활성화 실패:', error)
      throw error
    }
  },
}
