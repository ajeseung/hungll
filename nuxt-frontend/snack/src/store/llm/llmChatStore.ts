import { defineStore } from 'pinia'

export const useLLMChatStore = defineStore('llmChat', {
  state: () => ({
    messages: [] as { role: 'user' | 'bot'; content: string }[],
    currentBotText: '',
    modalOpen: false,
  }),

  actions: {
    addUserMessage(content: string) {
      this.messages.push({ role: 'user', content })
    },
    startBotStreaming() {
      this.currentBotText = ''
    },
    updateBotStreaming(chunk: string) {
      this.currentBotText += chunk
    },
    commitBotMessage() {
      this.messages.push({ role: 'bot', content: this.currentBotText })
      this.currentBotText = ''
    },
    clearChat() {
      this.messages = []
      this.currentBotText = ''
    },
        openModal() {
      this.modalOpen = true
    },
    closeModal() {
      this.modalOpen = false
    }
  }
})