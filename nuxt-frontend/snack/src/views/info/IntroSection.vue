<template>
  <section class="intro-section">
    <div class="logo-wrapper">
      <img src="@/assets/images/logo/hungle_full_big.png" alt="HUNGLL 로고" class="logo" />
    </div>
    <br />
    <h1 class="hook-text" v-html="typedText"></h1>

    <p class="description gradient-text">
      헝글과 대화하며 당신의 취향에 맞는 식당을 추천받으세요!<br />
      나와 맞는 밥친구까지 찾아주는 트렌디한 AI 서비스, <strong>헝글(HUNGLL)</strong>
    </p>
    <br /><br /><br />

    <div class="flip-card-button" @click="copyEmail">
      <div class="flip-card-inner" :class="{ flipped: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <div class="flip-card-front">헝글 팀에 문의하기</div>
        <div class="flip-card-back">
          <span>📩 이메일 복사</span>
        </div>
      </div>
    </div>

    <div v-if="copied" class="copy-popup">✅ 복사되었습니다</div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const messages = [
  '<span class="highlight-text">서울의 인증된 맛집</span> 리스트, 헝글이 추천해요.',
  '<span class="highlight-text">당신에게 꼭 맞는 맛</span>집을 헝글이 찾아드립니다.',
  '<span class="highlight-text">당신의 취향을 기억</span>하는 스마트한 헝글!',
  '<span class="highlight-text">헝글에서 밥친구</span>를 만드세요!',
]

const typedText = ref('')
const currentMessageIndex = ref(0)
const typingSpeed = 50
const delayBetween = 1500

function extractVisibleCharacters(html: string): string[] {
  const div = document.createElement('div')
  div.innerHTML = html

  const result: string[] = []
  const traverse = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result.push(...(node.textContent || '').split(''))
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(`<${(node as Element).tagName.toLowerCase()}${getAttrs(node as Element)}>`)

      node.childNodes.forEach(traverse)

      result.push(`</${(node as Element).tagName.toLowerCase()}>`)
    }
  }

  const getAttrs = (el: Element) =>
    [...el.attributes]
      .map((attr) => ` ${attr.name}="${attr.value}"`)
      .join('')

  div.childNodes.forEach(traverse)
  return result
}

const typeLoop = async () => {
  const message = messages[currentMessageIndex.value]
  const chars = extractVisibleCharacters(message)

  for (let i = 0; i <= chars.length; i++) {
    typedText.value = chars.slice(0, i).join('') + '<span class="cursor">|</span>'
    await new Promise(resolve => setTimeout(resolve, typingSpeed))
  }

  await new Promise(resolve => setTimeout(resolve, delayBetween))

  for (let i = chars.length; i >= 0; i--) {
    typedText.value = chars.slice(0, i).join('') + '<span class="cursor">|</span>'
    await new Promise(resolve => setTimeout(resolve, typingSpeed / 2))
  }

  currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.length
  typeLoop()
}

onMounted(() => {
  typeLoop()
})

const copied = ref(false)
const isHovered = ref(false)

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('hungll.snack@gmail.com')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('복사 실패:', e)
  }
}
</script>


<style scoped>
.intro-section {
  position: relative;
  text-align: center;
  padding: 40px 20px 120px;
  overflow: hidden;
}

.logo-wrapper {
  margin-bottom: 32px;
}
.logo {
  width: 160px;
  max-width: 80%;
}

.hook-text {
  font-size: 50px;
  font-weight: 700;
  color: #ff6f00;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
  margin-bottom: 24px;
  min-height: 100px;
}


.cursor {
  animation: blink 1s step-start infinite;
  color: #ff6f00;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.description {
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: 36px;
  color: #444;
}
.gradient-text {
  background: linear-gradient(to bottom, #ff9800, #ff5722);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.flip-card-button {
  width: 240px;
  height: 60px;
  margin: 0 auto;
  perspective: 1000px;
  animation: bounce-scale 2s infinite;
}

@keyframes bounce-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  backface-visibility: hidden;
  font-size: 16px;
}

.flip-card-front {
  background-color: #ff6f00;
  color: white;
  z-index: 2;
}

.flip-card-back {
  transform: rotateY(180deg);
  background-color: white;
  color: #ff6f00;
  border-image: linear-gradient(45deg, #ff6f00, #ff1744) 1;
  box-shadow: 0 0 12px #ff572266;
}

.copy-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #000000dd;
  padding: 14px 28px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  animation: fadeOut 2s ease-out forwards;
  z-index: 100;
}
@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@media (max-width: 1024px) {
  .hook-text {
    font-size: 36px;
    line-height: 1.4;
  }
  .description {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  .hook-text {
    font-size: 28px;
    text-align: center;
    padding: 0 10px;
    line-height: 1.3;
  }
  .description {
    font-size: 14px;
    padding: 0 12px;
    line-height: 1.6;
  }
}
.highlight-text {
  background: linear-gradient(to top, #ff9800 40%, #ff1744 40%);
  font-weight: 700;
  padding: 0 2px;
  color: #000; /* 강조한 텍스트도 검정 */
}


</style>
