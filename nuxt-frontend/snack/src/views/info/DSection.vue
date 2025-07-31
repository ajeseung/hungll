<template>
  <section class="board-intro-section" ref="sectionRef">
    <div class="card-container">
      <div class="card-list">
        <div
          v-for="(card, i) in cards"
          :key="i"
          :class="[
            'intro-card',
            i % 2 === 0 ? 'left' : 'right',
            { visible: cardVisible[i] },
          ]"
          :style="cardVisible[i] ? { animationDelay: `${i}s` } : {}"
        >
          <div class="card-interactive-content" :class="i === 1 ? 'reverse' : ''">
            <img class="intro-image" :src="card.image" alt="intro" />
            <div class="intro-text">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-description" v-html="card.description"></p>

              <!-- 👇 버튼 영역 -->
              <div class="card-button-wrapper">
                <button v-if="i === 0" @click="showAlert = true" class="card-button">헝글챗 이용해보기</button>
                <button v-else-if="i === 1" @click="goTo('/board/all')" class="card-button">밥친구 찾기</button>
                <button v-else-if="i === 2" @click="goTo('/restaurants/all')" class="card-button">서울 맛집 찾기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 모달 alert -->
    <DSectionAlert v-if="showAlert" @close="showAlert = false" />
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DSectionAlert from '@/views/info/BSectionAlert.vue'


import image1 from '@/assets/images/intro/1.jpg'
import image2 from '@/assets/images/intro/2.jpg'
import image3 from '@/assets/images/intro/3.png'

const sectionRef = ref<HTMLElement | null>(null)
const cardVisible = ref<boolean[]>([])
const showAlert = ref(false)
const router = useRouter()

const goTo = (path: string) => {
  router.push(path)
}

const cards = [
  {
    title: '헝글챗을 이용해보세요.',
    description: `
    <br />
    헝글챗은 단순한 맛집 추천을 넘어,<br />
    <span class="highlight">사용자의 감정 상태와 기분, 실시간 날씨와 같은 맥락적 요소를 종합적으로 분석</span>하여<br />
    지금 이 순간의 나에게 가장 적절한 서울 맛집을 제안합니다.`,
    image: image1,
  },
  {
    title: '마음 맞는 사람과 맛집 탐방!',
    description: `
    비슷한 취향을 가진 사람들과 함께하는 식사,<br />
    헝글은 단순한 만남을 넘어,<br />
    당신에게 꼭 맞는 밥친구와의 가치 있는 경험을 만들어갑니다.
    `,
    image: image2,
  },
  {
    title: '서울 맛집, 믿고 보는 헝글픽',
    description: `
    헝글은 수많은 식당 중에서도,<br />
    검증된 리뷰와 데이터를 기반으로,<br />
    서울에서 가장 신뢰할 수 있는 <span class="highlight-underline">추천 맛집 리스트</span>를 제공합니다.
    `,
    image: image3,
  },
]

const triggerCardAnimation = () => {
  cardVisible.value = cards.map(() => false)
  cards.forEach((_, i) => {
    setTimeout(() => {
      cardVisible.value[i] = true
    }, i * 200)
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerCardAnimation()
        }
      })
    },
    { threshold: 0.1 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<style scoped>
.board-intro-section {
  padding: 120px 20px;
  display: flex;
  justify-content: center;
  background: #fff;
}

.card-container {
  max-width: 700px;
  width: 100%;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 80px;
  
}

.intro-card {
  opacity: 0;
  transform: translateY(40px);
  pointer-events: none;
  
}

.intro-card.visible {
  animation: fadeUp 0.8s ease forwards;
  pointer-events: auto;
}

.intro-card.left {
  align-self: flex-start;
}

.intro-card.right {
  align-self: flex-end;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-interactive-content {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  height: 300px;

  box-shadow:
    inset 3px 3px 6px rgba(181, 78, 78, 0.009),
    inset -3px -3px 6px rgba(0, 0, 0, 0.178);
    
}

.card-interactive-content.reverse {
  flex-direction: row-reverse;
}

.intro-image {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.intro-text p {
  font-size: 16px;
  color: #444;
}
.highlight {
  background: rgba(255, 190, 60, 0.5); /* 연주황 형광펜 느낌 */
  padding: 2px 4px;
  border-radius: 4px;
  color: #000; /* ✅ 글자색 명시해줘야 확실히 보임 */
  font-weight: 600; /* ✅ 더 잘 보이게 강조해도 좋음 */
}
.card-button-wrapper {
  margin-top: 20px;
  text-align: center;
}

.card-button {
  background: linear-gradient(90deg, #ff9800, #ff5722);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.card-button:hover {
  background: linear-gradient(90deg, #ffac33, #ff7043);
}

</style>
