import { createAxiosInstance } from '@/common/utils/axiosInstance'


export const sendPreferenceAnswers = async (answers: (string[] | null)[], accountId: string | null) => {

  const axios = createAxiosInstance()

  if (!accountId) {
    alert('account_id가 없습니다. 로그인 후 이용해주세요.')
    return
  }

  try {
    const response = await axios.post('/account-prefer/save', {
      account_id: accountId,
      answers
    })

    if (response.data.success) {
      alert('선호도 제출이 완료되었습니다!')
    } else {
      alert('제출 실패: 서버 응답이 실패로 표시되었습니다.')
    }
  } catch (error) {
    alert('제출 중 오류가 발생했습니다.')
  }
}
