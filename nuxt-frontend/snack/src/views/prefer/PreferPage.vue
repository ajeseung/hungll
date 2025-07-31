<template>
  <div class="prefer-wrapper" v-if="currentQuestion && hasValidOptions">
    <img :src="babyImage" alt="추천 캐릭터" class="cute-img" />

    <div class="info-message">
      👀 <span>선호도 조사를 통해 <strong>더 적합한 맛집</strong>을 추천해드릴 수 있어요!</span>
    </div>



    <div class="question-box">
      <h2 class="question-title">{{ currentQuestion.question }}</h2>
    </div>

    <div class="card-row">
      <div
        v-for="(option, idx) in currentQuestion.options"
        :key="idx"
        class="option-card"
        :class="{ selected: selectedIndices.includes(idx) }"
        @click="toggleSelectOption(idx)"
      >
        <div class="card-front">
          <template v-if="option !== '기타'">
            {{ option }}
          </template>
          <template v-else>
            <div v-if="customInputIndex === idx">
              <input
                v-model="tempCustomAnswer"
                placeholder="직접 입력"
                class="custom-input"
                @click.stop
              />
              <button class="confirm-btn" @click.stop="confirmCustomOption(idx)">완료</button>
            </div>
            <div v-else>
              <span>기타</span>
            </div>
          </template>
        </div>
        <div class="card-back">
          <span>선택 완료</span>
          <div class="check-circle">✔</div>
        </div>
      </div>
    </div>

    <div class="submit-wrapper">
      <template v-if="currentIndex === 0">
        <button
          class="submit-btn"
          @click="handleNext"
          :disabled="selectedIndices.length === 0 && !customAnswer"
        >
          다음
        </button>
      </template>

      <template v-else-if="currentIndex < questions.length - 1">
        <button class="submit-btn" @click="handlePrev">이전</button>
        <button
          class="submit-btn"
          @click="handleNext"
          :disabled="selectedIndices.length === 0 && !customAnswer"
        >
          다음
        </button>
      </template>

      <template v-else>
        <button class="submit-btn" @click="handlePrev">이전</button>
        <button
          class="submit-btn"
          @click="handleSubmit"
          :disabled="selectedIndices.length === 0 && !customAnswer"
        >
          제출 완료
        </button>
      </template>
    </div>

    <div class="skip-wrapper">
      <p class="skip-msg">⏩ 건너뛰면 일반적인 맛집만 추천됩니다.</p>
      <button class="skip-btn" @click="handleSkip">지금 건너뛰기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sendPreferenceAnswers } from '@/repository/prefer/preferRepository'
import babyImage from '@/public/images/logo/baby.png'

interface Question {
  question: string
  options: string[]
  multi?: boolean
  requiresAdult?: boolean
}

const router = useRouter()

const initialQuestions: Question[] = [
  { question: '당신의 나이대는?', options: ['10대', '20대', '30대', '40대', '50대+'] }
]

const baseQuestions: Question[] = [
  { question: '음주를 좋아하시나요?', options: ['항상 마셔요', '가끔 마셔요', '거의 안 마셔요', '전혀 안 마셔요'], requiresAdult: true },
  { question: '선호하는 주류는?(중복 가능)', options: ['소주', '맥주', '막걸리', '와인', '위스키','칵테일','안 마셔요'], requiresAdult: true, multi: true },
  { question: '세상에서 가장 맛있는 조합은?', options: ['치킨 + 맥주', '삼겹살 + 소주', '치즈 + 와인', '회 + 소주'], requiresAdult: true },
  { question: '최애 야식은?', options: ['치킨', '라면', '곱창', '엄마 몰래 먹는 과자'] },
  { question: '맛없는 식당에 끌려갔다면?', options: ['분위기 박살낸다 😤', '아무렇지 않게 먹는다 😇', '몰래 배달앱 킨다 📱', '도망감 🏃‍♀️'] },
  { question: '혼밥 자주 하시나요?', options: ['자주함 (마이 웨이)', '가끔', '혼밥은 외로워요 🥲'] },
  { question: '선호하는 음식 타입은? (중복 가능)', options: ['한식', '양식', '일식', '중식', '동남아', '기타'], multi: true },
  { question: '주로 야외에서 밥을 먹는 시간대는?', options: ['아침형 인간', '점심에 몰빵', '저녁 늦게', '야식 없인 못 살아 🍜'] },
  { question: '식당 분위기 선호는?', options: ['조용조용한 곳', '적당히 북적한 곳', '흥겨운 식당 🔊'] },
  { question: '같이 밥 먹고 싶은 친구 연령대는?', options: ['동갑이 최고', '연상이 편함', '연하가 좋아', '나이? 그냥 사람 보고 골라요'], multi: true },
  { question: '식사 스타일은?', options: ['말 많이 해야 함', '말없이 먹는 것도 낭만', '상대가 말하면 나도 말함'] },
  { question: '밥 친구 고르는 기준은?', options: ['말 잘 통하는 사람', '조용한 사람', '밥 빨리 안 먹는 사람 🍚', '같은 드립코드', '음식취향이 맞는 사람', '기타'], multi: true },
  { question: '식사 속도는?', options: ['전광석화급', '보통 속도', '씹고 또 씹는 타입 🐢'] },
  { question: 'MBTI는?', options: ['ENFP', 'ENFJ', 'ENTP', 'ENTJ', 'INFP', 'INFJ', 'INTP', 'INTJ', 'ESFP', 'ESFJ', 'ESTP', 'ESTJ', 'ISFP', 'ISFJ', 'ISTP', 'ISTJ'] },
  { question: '여가시간 무엇을 하며 시간을 보내시나요?', options: ['맛집 탐방', '게임', '친구랑 놀기', '운동 & 헬스', 'OTT 정주행', 'IT 신기술 검색', '독서', '기타'], multi: true },
  { question: '자주 방문하는 지역은?', options: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'], multi: true },
  { question: '처음 만나는 사람과 식사할 때?', options: ['편하다', '약간 부담', '말 안 시켰으면', '밥 먹다 도망가본 적 있음'] },
  { question: '음식 추천 시 가장 중요한 요소는?', options: ['맛', '가격', '인스타 감성 📸', '리뷰 평점', '그냥 감'] }
]

const questions = ref<Question[]>([...initialQuestions])
let hasAppended = false
const currentIndex = ref(0)
const selectedIndices = ref<number[]>([])
const answers = ref<(string[] | null)[]>([])
const customAnswer = ref('')
const tempCustomAnswer = ref('')
const customInputIndex = ref<number | null>(null)

const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
const hasValidOptions = computed(() => !!currentQuestion.value?.options?.length)

const toggleSelectOption = (idx: number) => {
  if (!currentQuestion.value) return
  const isMulti = currentQuestion.value.multi === true
  if (currentQuestion.value.options[idx] === '기타') {
    customInputIndex.value = idx
    return
  }
  if (isMulti) {
    selectedIndices.value = selectedIndices.value.includes(idx)
      ? selectedIndices.value.filter(i => i !== idx)
      : [...selectedIndices.value, idx]
  } else {
    selectedIndices.value = [idx]
  }
}

const confirmCustomOption = (idx: number) => {
  if (!tempCustomAnswer.value.trim()) return
  customAnswer.value = tempCustomAnswer.value.trim()
  if (!selectedIndices.value.includes(idx)) {
    selectedIndices.value.push(idx)
  }
  customInputIndex.value = null
  tempCustomAnswer.value = ''
}

const saveAnswer = () => {
  if (!currentQuestion.value) return
  const selected = selectedIndices.value.map(i => currentQuestion.value!.options[i])
  if (customAnswer.value.trim()) selected.push(customAnswer.value.trim())
  answers.value[currentIndex.value] = selected
}

const handleNext = () => {
  saveAnswer()

  if (currentIndex.value === 0) {
    const selected = answers.value[0] || []
    const isTeenager = selected.includes('10대')
    const filtered = baseQuestions.filter(q => !q.requiresAdult || !isTeenager)
    questions.value = [...initialQuestions, ...filtered]

    currentIndex.value = 1
    selectedIndices.value = []
    customAnswer.value = ''
    customInputIndex.value = null
    tempCustomAnswer.value = ''
    return
  }

  currentIndex.value++
  selectedIndices.value = []
  customAnswer.value = ''
  customInputIndex.value = null
  tempCustomAnswer.value = ''
}


const handlePrev = () => {
  if (currentIndex.value === 0) return
  currentIndex.value--
  const prevQ = questions.value[currentIndex.value]
  const prevAnswers = answers.value[currentIndex.value] || []
  selectedIndices.value = (prevAnswers as string[])
    .map(ans => prevQ.options.indexOf(ans))
    .filter(i => i !== -1)
  customAnswer.value = (prevAnswers as string[]).find(ans => !prevQ.options.includes(ans)) || ''
}

const handleSubmit = async () => {
  saveAnswer()
  const accountId = localStorage.getItem('account_id')
  await sendPreferenceAnswers(answers.value, accountId)
  router.push('/')
}


const handleSkip = async () => {
  const accountId = localStorage.getItem('account_id')
  const padded = [...answers.value, ...Array(19 - answers.value.length).fill(null)]
  await sendPreferenceAnswers(padded, accountId)
  router.push('/')
}

</script>


<style scoped>
.cute-img {
  width: 120px;
  height: auto;
  margin-bottom: 12px;
}
</style>

  <style scoped>

  .cute-img {
  width: 120px;
  height: auto;
  margin-bottom: 12px;
}

  .prefer-wrapper {
    padding: 40px 20px;
    max-width: 600px;
    margin: 0 auto;
    min-height: 500px;
    text-align: center;
  }
  
  .question-box {
    margin-bottom: 24px;
  }
  
  .question-title {
    font-size: 20px;
    font-weight: 700;
    color: #ff6f00;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .card-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .option-card {
    position: relative;
    width: 100px;
    height: 120px;
    background-color: #fff;
    border: 2px solid #ffcc80;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.4s, box-shadow 0.3s;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
  
  .option-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(255, 111, 0, 0.3);
  }
  
  .option-card.selected {
    transform: rotateY(180deg);
  }
  
  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;
    font-weight: bold;
    font-size: 14px;
    padding: 8px;
    color: #333;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .card-front {
    background-color: #fffaf2;
  }
  
  .card-back {
    background-color: #ffe0b2;
    transform: rotateY(180deg);
    flex-direction: column;
    font-size: 13px;
  }
  
  .check-circle {
    margin-top: 6px;
    width: 24px;
    height: 24px;
    background-color: #4caf50;
    color: white;
    border-radius: 50%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .submit-wrapper {
    margin-top: 40px;
  }
  
  .submit-btn {
    background-color: #ffaa00;
    color: white;
    padding: 12px 28px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .submit-btn:hover {
    background-color: #ff9900;
  }
  </style>
  