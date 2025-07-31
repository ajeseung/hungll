// src/repository/admin/adminRepository.ts
import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const adminRepository = {
  async validateAdminCode(adminCode: string) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const response = await axios.post(
      '/github-oauth/request-admin-code-validation',
      {
        admin_code: adminCode,
      }
    )

    return response.data
  },

  async requestGithubWorkflow(userToken: string, repoUrl: string) {
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(userToken, accountId)

    const response = await axios.post('/github-action-monitor/workflow', {
      userToken,
      repoUrl,
    })

    return response.data.workflowInfo || []
  },

  async triggerGithubWorkflow(
    userToken: string,
    repoUrl: string,
    workflowName: string
  ) {
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(userToken, accountId)

    const response = await axios.post('/github-action-monitor/trigger', {
      userToken,
      repoUrl,
      workflowName,
    })

    return response.data
  },
  async getAllAccount() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const res = await axios.get('/admin-user-info/list')
    return res.data.user_list
  },

  async getSelectAccount(accountId: number) {
    const token = localStorage.getItem('userToken') || ''
    const requesterId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, requesterId)

    const res = await axios.get(`/admin-user-info/${accountId}`)
    return res.data.user_info
  },

  // src/repository/admin/adminRepository.ts

  async requestUserBan(targetAccountId: number, reason = '관리자 차단 처리') {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const res = await axios.post('/admin-user-ban/ban', {
      target_account_id: targetAccountId,
      reason,
    })

    return res.data
  },

  async requestUserUnban(accountId: number) {
    const token = localStorage.getItem('userToken') || ''
    const requesterId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, requesterId)

    const res = await axios.put(`/admin-user-ban/unban/${accountId}`)
    return res.data
  },

  // 임시정지
  async suspendUser(targetAccountId: number, reason: string, duration: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const res = await axios.post('/admin-user-suspend/suspend', {
      target_account_id: targetAccountId,
      reason,
      duration,
    })

    return res.data
  },

  // 임시정지 해제
  async unsuspendUser(accountId: number) {
    const token = localStorage.getItem('userToken') || ''
    const requesterId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, requesterId)

    const res = await axios.put(`/admin-user-suspend/unsuspend/${accountId}`)
    return res.data
  },

  async getReportList() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const res = await axios.get('/report/list')
    return res.data.reports
  },

  async getReportDetail(reportId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const res = await axios.get(`/report/detail/${reportId}`)
    return res.data.report
  },

  async deleteReport(reportId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const res = await axios.delete(`/report/delete/${reportId}`)
    return res.data
  },

  async updateReportStatus(reportId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const res = await axios.put(`/report/update/${reportId}`)
    return res.data
  },
}
