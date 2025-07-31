import { createAxiosInstance } from '@/common/utils/axiosInstance'

const getAxios = () => {
  const token = localStorage.getItem('userToken') || ''
  const accountId = localStorage.getItem('account_id') || ''
  return createAxiosInstance(token, accountId)
}

const getHeaders = () => {
  return {
    usertoken: localStorage.getItem('userToken') || '',
    'account-id': localStorage.getItem('account_id') || '',
    'Content-Type': 'application/json'
  }
}

const getAIBaseUrl = () => {
    const config = useRuntimeConfig()
    return config.public.AI_BASE_URL
}

export const llmChatRepository = {
  async streamChat(query: string, onDelta: (chunk: string) => void) {
    const aiBaseUrl = getAIBaseUrl()
    const response = await fetch(`${aiBaseUrl}/llm/search`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ query })
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      if (chunk) onDelta(chunk)
    }
  },

  async saveChatHistory(user_message: string, bot_response: string) {
    const axios = getAxios()
    return axios.post('/chat-history/save', {
      user_message,
      bot_response
    })
  }
}
