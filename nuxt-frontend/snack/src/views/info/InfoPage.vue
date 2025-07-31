<!-- InfoPage.vue -->
<template>
  <div class="info-page">
    <div class="background-logos">
      <img
        v-for="n in 10"
        :key="n"
        src="@/assets/images/logo/hungle_full_big.png"
        class="bg-logo"
        :style="generateRandomStyle(n)"
        alt="배경 로고"
      />
    </div>
    <div ref="introSectionRef">
      <IntroSection @next="scrollToHungll" />
    </div>
    <div ref="introSectionRef">
      <ASection />
    </div>
    <div ref="hungllSectionRef">
      <BSection />
    </div>
    <div ref="whySectionRef">
      <CSection />
    </div>
    <div ref="boardSectionRef">
      <DSection />
    </div>
    <div ref="teamSectionRef">
      <TeamSection />
    </div>

    <footer class="hungll-footer">
      <div class="footer-info-wrapper">
        <p class="footer-line">주소: 서울특별시 송파구 새말로8길 26, 3층 (문정동)</p>
        <p class="footer-line">문의: hungll.snack@gmail.com</p>
        <div class="footer-line">
          <router-link to="/policy/terms-info" class="footer-link">이용약관</router-link>
          <span class="divider">|</span>
          <router-link to="/policy/privacy-info" class="footer-link">개인정보처리방침</router-link>
          <span class="divider">|</span>
          <router-link to="/policy/child-info" class="footer-link">아동보호정책</router-link>
        </div>
        <p class="footer-copy">Copyright © 2025 에디(EDDI). All rights reserved.</p>
      </div>
    </footer>
    <SurveyPopup />

    <div
      class="gradient-arrow"
      :class="{ up: sectionIndex === 4 }"
      @click="toggleScroll"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IntroSection from '~/views/info/IntroSection.vue'
import ASection from '@/views/info/ASection.vue'
import BSection from '@/views/info/BSection.vue'
import CSection from '@/views/info/CSection.vue'
import DSection from '@/views/info/DSection.vue'
import TeamSection from '@/views/info/TeamSection.vue'
import SurveyPopup from '@/views/info/SurveyPopup.vue'

useHead({
  title: '헝글 - 인증 맛집 & 밥친구 찾기 서비스',
  meta: [
    {
      name: 'description',
      content: '헝글에서 나에게 딱 맞는 식당과 사람을 찾아보세요.',
    },
    {
      name: 'keywords',
      content: '맛집 추천, 밥약, 밥친구, 헝글, AI 추천, 밥친구 찾기, 서울 식당,밥약, 헝글 서비스',
    },
    // Open Graph
    { property: 'og:title', content: '헝글 - 서울 맛집 & 밥친구 찾기 서비스' },
    { property: 'og:description', content: '헝글은 서울의 맛집을 추천하고, 함께 밥먹을 친구도 연결해드립니다. 혼밥은 그만!' },
    { property: 'og:image', content: 'https://hungll.com/og/hungle_hgl.png' },
    { property: 'og:url', content: 'https://hungll.com/' },
    { property: 'og:type', content: 'website' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '헝글 - 맛집 추천 & 밥친구 찾기' },
    { name: 'twitter:description', content: '헝글 서비스로 새로운 당신의 취향에 맞는 새로운 식사 경험을 시작하세요.' },
    { name: 'twitter:image', content: 'https://hungll.com/og/hungle_hgl.png' },
  ]
})

const sectionIndex = ref(0)
const introSectionRef = ref<HTMLElement | null>(null)
const hungllSectionRef = ref<HTMLElement | null>(null)
const whySectionRef = ref<HTMLElement | null>(null)
const boardSectionRef = ref<HTMLElement | null>(null)
const teamSectionRef = ref<HTMLElement | null>(null)

const scrollTo = (refEl: HTMLElement | null, index: number) => {
  if (!refEl) return
  refEl.scrollIntoView({ behavior: 'smooth' })
  sectionIndex.value = index
}

const scrollToIntro = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const scrollToHungll = () => scrollTo(hungllSectionRef.value, 1)
const scrollToWhy = () => scrollTo(whySectionRef.value, 2)
const scrollToBoard = () => scrollTo(boardSectionRef.value, 3)
const scrollToTeam = () => scrollTo(teamSectionRef.value, 4)

const toggleScroll = () => {
  if (sectionIndex.value === 0) scrollToHungll()
  else if (sectionIndex.value === 1) scrollToWhy()
  else if (sectionIndex.value === 2) scrollToBoard()
  else if (sectionIndex.value === 3) scrollToTeam()
  else scrollToIntro()
}

const generateRandomStyle = (index: number) => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const size = Math.random() * 15 + 20
  const rotate = Math.random() * 360
  const duration = Math.random() * 5 + 5
  const opacity = (Math.random() * 0.04 + 0.02).toFixed(2)

  return {
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}vw`,
    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    animationDuration: `${duration}s`,
    opacity,
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === introSectionRef.value) sectionIndex.value = 0
          else if (entry.target === hungllSectionRef.value) sectionIndex.value = 1
          else if (entry.target === whySectionRef.value) sectionIndex.value = 2
          else if (entry.target === boardSectionRef.value) sectionIndex.value = 3
          else if (entry.target === teamSectionRef.value) sectionIndex.value = 4
        }
      })
    },
    { threshold: 0.6 }
  )

  if (introSectionRef.value) observer.observe(introSectionRef.value)
  if (hungllSectionRef.value) observer.observe(hungllSectionRef.value)
  if (whySectionRef.value) observer.observe(whySectionRef.value)
  if (boardSectionRef.value) observer.observe(boardSectionRef.value)
  if (teamSectionRef.value) observer.observe(teamSectionRef.value)
})
</script>

<style scoped>
.info-page {
  position: relative;
  padding: 0px 20px 0px;
  z-index: 1;
  overflow-x: hidden;
}

.background-logos {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.bg-logo {
  position: absolute;
  animation: floatMove ease-in-out infinite;
}

@keyframes floatMove {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    transform: translate(-48%, -52%) scale(1.2);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.gradient-arrow {
  width: 28px;
  height: 28px;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 10;

  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  background: linear-gradient(to bottom, #ff9800, #ff5722);
  animation: bounce 1.5s infinite;
  transition: transform 0.3s ease, clip-path 0.3s ease;
}

.gradient-arrow:hover {
  transform: translateX(-50%) scale(1.6);
}

.gradient-arrow.up {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: linear-gradient(to top, #ff9800, #ff5722);
}

.hungll-footer {
  background-color: #f9f9f9;
  padding: 24px 16px 40px;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  border-top: 1px solid #ddd;
  margin-top: 80px;
}

.footer-info-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.footer-line {
  margin: 4px 0;
  font-size: 13px;
  color: #444;
}

.footer-copy {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.footer-link {
  text-decoration: none;
  color: #555; 
  font-weight: 500;
  margin: 0 6px;
}

.footer-link:hover {
  color: #222;
}


@keyframes bounce {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -10px);
  }
}

</style>
