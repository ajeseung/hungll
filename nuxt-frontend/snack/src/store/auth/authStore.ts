import { defineStore } from 'pinia'
import { authRepository } from '@/repository/auth/authRepository'
import { useRouter } from 'vue-router'
import { useAccountStore } from '../account/accountStore'
import { accountRepository } from '~/repository/account/accountRepository'
import axios, { AxiosError } from 'axios'


export type Provider = 'kakao' | 'naver' | 'google' | 'github'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    provider: '' as Provider | '',
  }),

  actions: {
    async login(provider: Provider) {
      try {
        const loginUrl = await authRepository.getLoginUrl(provider)
        this.provider = provider
        sessionStorage.setItem('provider', provider)
        window.location.href = loginUrl
      } catch (error) {
        alert(`🔴 ${provider} 로그인 URL 요청 실패`)
        console.error(error)
      }
    },

    async handleOAuthRedirect(router: ReturnType<typeof useRouter>, provider: Provider, code: string) {
      try {
        const { userToken, accountId, statusCode } = await authRepository.getAccessToken(provider, code)
        console.log('oauth 스토어에요 userToken, accountId, statusCode : ', userToken, accountId, statusCode )
        if (!userToken || !accountId) {
          throw new Error('토큰 또는 계정 정보 누락')
        }

        localStorage.setItem('userToken', userToken)
        localStorage.setItem('account_id', accountId)
        this.isAuthenticated = true
        this.provider = provider

        const accountStore = useAccountStore()
        const profile = await accountRepository.getProfileInfo()
        accountStore.setProfile(profile)

        console.log('상태 코드 확인:', statusCode)

        // 상태 코드에 따른 처리
        if (statusCode === 201) {
          router.push('/prefer')
        } else if (statusCode === 200) {
          router.push('/')
        } else if (statusCode === 409) {
          alert('이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.')
          sessionStorage.removeItem('provider')
          router.push('/policy/privacy')
        } else {
          router.push('/')
        }
      } catch (err) {
        const error = err as AxiosError
      
        if (error.response) {
          const status = error.response.status
      
          if (status === 414) {
            alert('일시 정지된 계정입니다. 관리자에게 문의하세요.')
            sessionStorage.removeItem('provider')
            router.push('/')
          } else if (status === 444) {
            alert('영구 정지된 계정입니다. 관리자에게 문의하세요.')
            sessionStorage.removeItem('provider')
            router.push('/')
          } else {
            router.push('/')
          }
        } else {
          alert('OAuth 로그인 처리 중 문제가 발생했습니다.')
          router.push('/policy/privacy')
        }
      }
    },

    logout() {
      const token = localStorage.getItem('userToken')
      if (!token || !this.provider) return


      authRepository.logout(this.provider, token)
      
      localStorage.removeItem('userToken')
      localStorage.removeItem('account_id')
      localStorage.removeItem('isAdmin')

      const accountStore = useAccountStore()
      accountStore.$reset()

      this.isAuthenticated = false
      this.provider = ''
    },

    async validateToken(): Promise<boolean> {
      const token = localStorage.getItem('userToken')
      if (!token) return false

      const valid = await authRepository.validateToken(token)
      this.isAuthenticated = valid
      return valid
    },

    async initializeAuth() {
      const token = localStorage.getItem('userToken')
      if (!token) return

      const valid = await this.validateToken()
      if (valid) {
        this.isAuthenticated = true
        this.provider = sessionStorage.getItem('provider') as Provider || ''
      } else {
        this.logout()
      }
    },

    async withdrawAccount(): Promise<void> {
      const accountId = localStorage.getItem('account_id')
      if (!accountId) {
        alert('계정 정보가 없습니다. 다시 로그인해주세요.')
        return
      }

      try {
        const result = await authRepository.deactivateAccount(accountId)
        if (result?.success) {
          alert('정상적으로 탈퇴 처리되었습니다.')
          this.logout() 
        } else {
          alert('탈퇴 처리에 실패했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        console.error('❌ 탈퇴 처리 중 오류:', error)
        alert('서버 오류로 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  },
})
