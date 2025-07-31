import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const accountRepository = {
  async getAccountInfo() {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
  
    const { data } = await axios.get('/account/get')
    return data
  },
  
  async getProfileInfo() {

    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    console.log(accountId)
    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.get('/account-profile/get')

    return data
  },

  async updateProfileInfo(profileData: any) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.patch('/account-profile/update', profileData, {
      headers: {
        'account-id': accountId,
        'usertoken': token,
      },
    })

    return data
  },

  async checkNicknameDuplication(nickname: string) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''

    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.post('/account-profile/check-nickname-duplication', {
      account_nickname: nickname
    })
    return data
  },
  
  async updateAlarmSettings(alarmBoardStatus: boolean, alarmCommentStatus: boolean) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)
    const { data } = await axios.patch('/account-profile/update', {
      alarm_board_status: alarmBoardStatus,
      alarm_comment_status: alarmCommentStatus
    }, {
      headers: {
        'account-id': accountId,
        'usertoken': token,
      },
    })
    return data
  }
}
