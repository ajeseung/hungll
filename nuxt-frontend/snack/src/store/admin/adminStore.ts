// src/store/admin/adminStore.ts
import { defineStore } from 'pinia'
import { adminRepository } from '@/repository/admin/adminRepository'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    workflows: [] as any[], // GitHub 워크플로우 목록
    allAccounts: [] as any[],
    selectedAccount: null as any,
    reportList: [] as any[],
    selectedReport: null as any,
  }),

  actions: {
    async checkAdminCode(code: string): Promise<string | null> {
      try {
        const res = await adminRepository.validateAdminCode(code)
        if (res.success) {
          return res.message || '관리자 인증에 성공했습니다.'
        } else {
          return res.message || '관리자 인증에 실패했습니다.'
        }
      } catch (error: any) {
        return error.response?.data?.message || '서버 오류로 관리자 인증 실패'
      }
    },

    async fetchGithubWorkflow(
      userToken: string,
      repoUrl: string
    ): Promise<void> {
      try {
        const data = await adminRepository.requestGithubWorkflow(
          userToken,
          repoUrl
        )
        this.workflows = data
      } catch (error) {
        console.error('❌ GitHub 워크플로우 불러오기 실패:', error)
        throw error
      }
    },

    async triggerGithubWorkflow(
      userToken: string,
      repoUrl: string,
      workflowName: string
    ): Promise<void> {
      try {
        await adminRepository.triggerGithubWorkflow(
          userToken,
          repoUrl,
          workflowName
        )
      } catch (error) {
        console.error('❌ GitHub 워크플로우 실행 실패:', error)
        throw error
      }
    },

    async fetchAllAccounts(): Promise<void> {
      try {
        const data = await adminRepository.getAllAccount()
        this.allAccounts = data
      } catch (err) {
        console.error('❌ 전체 사용자 목록 로드 실패:', err)
        throw err
      }
    },

    async fetchSelectAccount(accountId: number): Promise<void> {
      try {
        const data = await adminRepository.getSelectAccount(accountId)
        this.selectedAccount = data
      } catch (err) {
        console.error('❌ 사용자 상세 정보 로드 실패:', err)
        throw err
      }
    },

    // src/store/admin/adminStore.ts

    async banUser(accountId: number, reason = '관리자 영구 정지') {
      try {
        const result = await adminRepository.requestUserBan(accountId, reason)
        // 성공 후 allAccounts 갱신
        await this.fetchAllAccounts()
        return result
      } catch (err) {
        console.error('❌ 사용자 영구 정지 실패:', err)
        throw err
      }
    },

    async unbanUser(accountId: number) {
      try {
        const result = await adminRepository.requestUserUnban(accountId)
        await this.fetchAllAccounts()
        return result
      } catch (err) {
        console.error('❌ 사용자 차단 해제 실패:', err)
        throw err
      }
    },

    async suspendUser(
      userId: number,
      reason: string,
      duration: number
    ): Promise<boolean> {
      try {
        const res = await adminRepository.suspendUser(userId, reason, duration)
        return res.success
      } catch (err) {
        console.error('❌ 임시정지 실패:', err)
        return false
      }
    },

    async unsuspendUser(userId: number): Promise<boolean> {
      try {
        const res = await adminRepository.unsuspendUser(userId)
        return res.success
      } catch (err) {
        console.error('❌ 임시정지 해제 실패:', err)
        return false
      }
    },

    async fetchReportList(): Promise<void> {
      try {
        const reports = await adminRepository.getReportList()
        this.reportList = reports
      } catch (err) {
        console.error('❌ 신고 리스트 불러오기 실패:', err)
        throw err
      }
    },

    async fetchReportDetail(reportId: number): Promise<void> {
      try {
        const report = await adminRepository.getReportDetail(reportId)
        this.selectedReport = report
      } catch (err) {
        console.error('❌ 신고 상세 조회 실패:', err)
        throw err
      }
    },

    async deleteReport(reportId: number): Promise<boolean> {
      try {
        const res = await adminRepository.deleteReport(reportId)
        return res.success === true
      } catch (err) {
        console.error('❌ 신고 삭제 실패:', err)
        return false
      }
    },

    async processReport(reportId: number): Promise<boolean> {
      try {
        const res = await adminRepository.updateReportStatus(reportId)
        return res.success === true
      } catch (err) {
        console.error('❌ 신고 상태 업데이트 실패:', err)
        return false
      }
    },
  },
})
