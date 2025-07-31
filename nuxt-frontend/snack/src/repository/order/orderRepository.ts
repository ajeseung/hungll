import { createAxiosInstance } from '@/common/utils/axiosInstance'

export const orderRepository = {
  async createOrder(subscribeId: number, price: number) {
    const token = localStorage.getItem('userToken') || ''
    const accountId = localStorage.getItem('account_id') || ''
    const axios = createAxiosInstance(token, accountId)

    const response = await axios.post('/orders/create', {
      items: [
        {
          id: subscribeId,  
          quantity: 1,
          price: price,
        },
      ],
      total: price,
      userToken: token,         
    })

    return response.data.orderId
  },
}
