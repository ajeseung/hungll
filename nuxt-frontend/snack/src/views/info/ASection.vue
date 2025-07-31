<template>
  <section class="intro-section">
    <div class="intro-wrapper">
      <!-- 핸드폰 이미지 영역 -->
      <div class="intro-right animate-delay">
        <div class="phone-wrapper">
          <img
            src="@/assets/images/home/handphone.png"
            alt="핸드폰 사진"
            class="handphone rotated"
          />
        </div>

        <div class="floating-bubbles">
          <transition name="slide-up"
            ><div class="mini-bubble b" v-show="showB">
              서울 맛집 찾아볼까?
            </div></transition
          >
          <transition name="slide-up"
            ><div class="mini-bubble a" v-show="showA">
              내 취향은 뭐지?
            </div></transition
          >
          <transition name="slide-up"
            ><div class="mini-bubble c" v-show="showC">
              밥친구도 찾아볼까?
            </div></transition
          >
        </div>
      </div>
      <!-- 말풍선 영역 -->
      <div class="intro-left animate">
        <div ref="speechBubbleRef" class="speech-bubble" name="slide-up">
          <div style="height: 100px">
            <transition name="slide-up">
              <h1 v-show="showTitle" v-html="typedText"></h1>
            </transition>
          </div>

          <transition name="slide-up">
            <p class="description">
              헝글과 대화하며
              <span class="highlight-orange">당신의 취향에 맞는 식당</span>을
              추천받으세요!<br />
              <span class="highlight-orange">밥친구까지 찾아주는</span> 트렌디한
              AI 서비스,<br />
              <strong>헝글(HUNGLL)</strong>
            </p>
          </transition>

          <transition name="slide-up">
            <div class="option-buttons">
              <button class="shadow-button" @click="goToPrefer('/board/all')">
                삼겹살엔 된찌 VS 김찌? 👉 밥친구 찾으러가기
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div v-if="copied" class="copy-popup">✅ 이메일 주소가 복사되었습니다</div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const typedText = ref('')
const currentMessageIndex = ref(0)
const typingSpeed = 70
const eraseSpeed = 30
const delayBetween = 1500
const copied = ref(false)
const showA = ref(false)
const showB = ref(false)
const showC = ref(false)
const speechBubbleRef = ref<HTMLElement | null>(null)
const showTitle = ref(false)
const showDesc = ref(false)
const showButton = ref(false)

const triggerSpeechAnimation = () => {
  showTitle.value = showDesc.value = showButton.value = false

  setTimeout(() => (showTitle.value = true), 300)
  setTimeout(() => (showDesc.value = true), 800)
  setTimeout(() => (showButton.value = true), 1300)
}

const messages = [
  '서울 맛집 추천, 헝글이 책임질게요',
  '밥친구를 찾고 있다면, 헝글에서 시작하세요',
  '혼밥그만! 밥친구와 함께해요',
  '당신의 취향을 분석하는 똑똑한 AI 헝글!',
]

const typeLoop = async () => {
  const message = messages[currentMessageIndex.value]
  for (let i = 0; i <= message.length; i++) {
    typedText.value = message.slice(0, i) + '<span class="cursor">|</span>'
    await new Promise((resolve) => setTimeout(resolve, typingSpeed))
  }
  await new Promise((resolve) => setTimeout(resolve, delayBetween))
  for (let i = message.length; i >= 0; i--) {
    typedText.value = message.slice(0, i) + '<span class="cursor">|</span>'
    await new Promise((resolve) => setTimeout(resolve, eraseSpeed))
  }
  currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.length
  typeLoop()
}

const triggerBubbleAnimation = () => {
  showA.value = showB.value = showC.value = false
  setTimeout(() => (showB.value = true), 300)
  setTimeout(() => (showA.value = true), 800)
  setTimeout(() => (showC.value = true), 1300)
}

const phoneRef = ref<HTMLElement | null>(null)

const handleScroll = () => {
  const section = document.querySelector('.intro-section')
  const rect = section?.getBoundingClientRect()

  if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
    triggerBubbleAnimation()
    triggerSpeechAnimation()
    if (speechBubbleRef.value) {
      speechBubbleRef.value.style.animation =
        'bubbleAppear 1s ease-out forwards'
    }
    if (
      phoneRef.value &&
      !phoneRef.value.classList.contains('slide-up-appear')
    ) {
      phoneRef.value.classList.add('slide-up-appear')
    }
  }
}

onMounted(() => {
  typeLoop()
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const goToPrefer = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.intro-section {
  position: relative;
  padding: 0;
  background: none;
  overflow: hidden;
}

.intro-wrapper {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding-bottom: 80px;
  height: 100%;
}

.intro-left {
  flex: 0 0 60%;
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 1s forwards;
}

.intro-right {
  flex: 0 0 40%;
  opacity: 0;
  transform: translateX(80px);
  animation: fadeInRight 1.2s forwards;
  position: relative;
}

.phone-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.1));
  mask-image: linear-gradient(
    to bottom right,
    black 60%,
    rgba(0, 0, 0, 0) 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to bottom right,
    black 60%,
    rgba(0, 0, 0, 0) 90%,
    transparent
  );
}
.shadow-button {
  background: transparent;
  color: #fff;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 16px;
  border: none;
  cursor: pointer;

  /* 왼쪽 위로 들어간 듯한 입체 그림자 */
  box-shadow:
    -4px -4px 8px rgba(255, 255, 255, 0.15),
    /* 왼쪽 위 하이라이트 */ 2px 2px 6px rgba(0, 0, 0, 0.3); /* 오른쪽 아래 그림자 */

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.shadow-button:hover {
  transform: translateY(-2px);
  box-shadow:
    -5px -5px 10px rgba(255, 255, 255, 0.2),
    3px 3px 8px rgba(0, 0, 0, 0.4);
}

.floating-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.mini-bubble {
  background: #ffffff;
  color: #222;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 14px;
  width: fit-content;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  transition:
    transform 0.3s ease,
    font-size 0.3s ease;
}

.mini-bubble:hover {
  transform: scale(1.1);
}

.mini-bubble.a {
  font-size: 12px;
  bottom: 40px;
  left: -10px;
}

.mini-bubble.a::after {
  content: '';
  position: absolute;
  bottom: 12px;
  right: -10px;
  border-left: 6px solid #ffffff;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.mini-bubble.b {
  font-size: 14px;
  bottom: 60px;
  right: -8px;
}

.mini-bubble.b::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #ffffff;
}

.mini-bubble.c {
  font-size: 15px;
  top: 20px;
  right: 50%;
  transform: translateX(50%);
}

.mini-bubble.c::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 12px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #ffffff;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.speech-bubble {
  background: rgba(255, 255, 255, 0.7);
  color: #333;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08),
              -4px 0 12px rgba(0, 0, 0, 0.08),
              4px 0 12px rgba(0, 0, 0, 0.08);
  position: relative;
  max-width: 90%;
  min-height: 300px;
  transition: opacity 0.6s ease, transform 0.6s ease;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
}



.speech-bubble h1 {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: #000000;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 24px;
}

.option-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: start;
  margin-top: 12px;
}

.option-buttons button {
  color: #000000;
  border-radius: 40px;
  background-color: #ff6f00;
  color: white;
  z-index: 2;
  animation: bounce-scale 2s infinite;
}
@keyframes bounce-scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.option-buttons button:hover {
  background-color: #ff8400;
  color: #fff;
}

.handphone {
  width: 100%;
  max-width: 320px;
  display: block;
  margin: 0 auto;
  transform: rotate(-10deg); /* ← 초기 기울기 유지 */
  transition: transform 0.6s ease;
}
.handphone:hover {
  transform: rotate(10deg); /* 마우스 올렸을 때 오른쪽으로 90도 회전 */
}
.copy-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  z-index: 1000;
  animation: fadeOut 2s ease-out forwards;
}

@keyframes phoneIntroTilt {
  0% {
    opacity: 0;
    transform: translateX(80px) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotate(-10deg); /* ← 등장할 때 왼쪽으로 기울어짐 */
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
}

@media (max-width: 768px) {
  .intro-wrapper {
    flex-direction: column;
    padding: 40px 20px;
    align-items: center; /* 추가 */
  }
  .intro-left {
    flex: 0 0 60%;
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 1s forwards;
  }

  .intro-right {
    flex: 0 0 40%;
    opacity: 0;
    transform: translateX(80px);
    animation: fadeInRight 1.2s forwards;
    position: relative;
  }
  

  .speech-bubble h1 {
    font-size: 24px;
  }
  .option-buttons {
    justify-content: center;
  }
  .mini-bubble.a {
    font-size: 10px;
    bottom: 20px;
    left: 0;
  }
  .mini-bubble.b {
    font-size: 12px;
    bottom: 40px;
    right: 0;
  }
  .mini-bubble.c {
    font-size: 13px;
    top: 10px;
    right: 50%;
    transform: translateX(50%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
.highlight-orange {
  background: linear-gradient(to top, #ffd6ad 40%, transparent 40%);
  font-weight: 600;
  padding: 0 2px;
}

</style>
