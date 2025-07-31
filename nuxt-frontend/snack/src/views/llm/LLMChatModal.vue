<template>
  <transition name="slide-up">
    <section
      v-if="chatStore.modalOpen"
      class="hungll-chat-section"
      @click.self="chatStore.closeModal()"
    >
      <div class="chat-card visible">
        <div class="chat-wrapper">
          <transition-group name="chat" tag="div" class="chat-list">
            <div
              v-for="(msg, i) in chatStore.messages"
              :key="i"
              :class="['chat-bubble-wrapper', msg.role]"
            >
              <div :class="['chat-bubble', msg.role]">
                <span>{{ msg.content }}</span>
              </div>
            </div>
            <div v-if="chatStore.currentBotText" class="chat-bubble-wrapper bot">
              <div class="chat-bubble bot">{{ chatStore.currentBotText }}</div>
            </div>
          </transition-group>
        </div>

        <div class="chat-input-wrapper">
          <input
            v-model="message"
            type="text"
            class="chat-input"
            placeholder="헝글에게 추천받아보세요 ✨"
            @keyup.enter="sendMessage"
          />
        </div>
      </div>
    </section>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useLLMChatStore } from '@/store/llm/llmChatStore'
import { llmChatRepository } from '@/repository/llm/llmChatRepository'
import { useAccountStore } from '@/store/account/accountStore'
import { accountRepository } from '~/repository/account/accountRepository'

const chatStore = useLLMChatStore()
const accountStore = useAccountStore()
const message = ref('')
const nickname = ref('')

const scrollToBottom = () => {
  nextTick(() => {
    const wrapper = document.querySelector('.chat-wrapper')
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight
    }
  })
}

watch(
  () => chatStore.modalOpen,
  async (isOpen) => {
    if (!isOpen) {
      document.body.classList.remove('modal-open')
      return
    }

    document.body.classList.add('modal-open')
    console.log('💡 chat modal opened!')

    if (!accountStore.nickname) {
      console.log('👀 닉네임 없음 → getAccount 실행')
      await accountRepository.getProfileInfo()
    }

    if (chatStore.messages.length === 0 && accountStore.nickname) {
      nickname.value = accountStore.nickname
      const greeting = `안녕하세요 ${nickname.value}님! 무엇을 도와드릴까요? ✨`
      chatStore.messages.push({ role: 'bot', content: greeting })
    }

    scrollToBottom()
  }
)

const sendMessage = async () => {
  const query = message.value.trim()
  if (!query) return

  chatStore.addUserMessage(query)
  chatStore.startBotStreaming()
  message.value = ''
  scrollToBottom()

  try {
    await llmChatRepository.streamChat(query, (chunk) => {
      console.log('💬 chunk', chunk)
      chatStore.updateBotStreaming(chunk)
      scrollToBottom()
      
    })

    chatStore.commitBotMessage()

    await llmChatRepository.saveChatHistory(query, chatStore.currentBotText)
  } catch (e) {
    console.error('❌ LLM API 실패', e)
    chatStore.messages.push({
      role: 'bot',
      content: '미안해요! 헝글이 딱맞는 대답을 찾기위해 알아보고있어요 💡'
    })
  }
}
</script>

<style scoped>
.hungll-chat-section {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 40px 20px;
}

.chat-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  max-width: 680px;
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.8s ease;
}
.chat-card.visible {
  transform: translateY(0);
  opacity: 1;
}

.chat-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  box-sizing: border-box;
  height: 100%;
}

.chat-wrapper::-webkit-scrollbar {
  width: 8px;
}
.chat-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff9800, #ff5722);
  border-radius: 4px;
}
.chat-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
.chat-wrapper {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #ff9800 transparent;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-bubble-wrapper {
  display: flex;
}
.chat-bubble-wrapper.user {
  justify-content: flex-end;
}
.chat-bubble-wrapper.bot {
  justify-content: flex-start;
}

.chat-bubble {
  position: relative;
  padding: 14px 20px;
  border-radius: 20px;
  max-width: 80%;
  animation: fadeSlideUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  word-break: break-word;
}
.chat-bubble.user {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border-bottom-right-radius: 4px;
}
.chat-bubble.bot {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-enter-active {
  transition: all 0.6s ease;
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.chat-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.chat-input-wrapper {
  width: 100%;
  background: white;
  border-radius: 30px;
  padding: 12px;
}
.chat-input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 30px;
  border: 2px solid transparent;
  background: transparent;
  outline: none;
  color: #222;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 102, 0, 0.4);
  transition: 0.3s ease;
}
.chat-input::placeholder {
  color: #aaa;
}
.chat-input:focus {
  border-color: #ff6f00;
  box-shadow: 0 0 12px #ff6f00;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>

<style>
body.modal-open,
body.modal-open .v-application,
body.modal-open .v-main,
body.modal-open .v-content {
  overflow: hidden !important;
  height: 100vh !important;
}
</style>
