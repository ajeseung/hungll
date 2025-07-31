import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const paymentsRepository = {
  async processPayment(paymentKey: string, orderId: string, amount: number, orderInfoId: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const response = await axios.post('/payments/process', {
      userToken: token,
      paymentKey,
      orderId,
      amount,
      orderInfoId,
    })

    return response.data
  },
}
