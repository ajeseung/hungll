<template>
  <v-container class="dashboard-container">
    <!-- 👋 관리자 인삿말 -->
    <section class="greeting-section">
      <v-icon class="greeting-icon" size="36">mdi-emoticon-happy-outline</v-icon>
      <h2 class="greeting-text">안녕하세요, <strong>{{ nickname }}</strong> 님 👋</h2>
      <p class="greeting-subtext">
        헝글(HUNGLL) 운영에 필요한 주요 기능들을 아래에서 바로 접근하실 수 있어요.
      </p>
    </section>

    <!-- ✨ 기능 섹션 -->
    <section class="features-section">
      <div class="feature" v-for="card in cards" :key="card.title" @click="card.action">
        <v-icon size="32" class="feature-icon">{{ card.icon }}</v-icon>
        <div class="feature-texts">
          <h3 class="feature-title">{{ card.title }}</h3>
          <p class="feature-subtitle">{{ card.subtitle }}</p>
        </div>
      </div>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const nickname = ref('유제나')
const router = useRouter()

const goToMonitoring = () => router.push('/admin/github-actions')
const goToUserManagement = () => router.push('/admin/user-management')
const goToReportManagement = () => router.push('/admin/report-management')
const goToWorkflowSettings = () => router.push('/admin/workflow-settings')

const cards = [
  {
    icon: 'mdi-github',
    title: 'GitHub Actions 모니터링',
    subtitle: '워크플로우 실행 상태를 실시간으로 확인',
    action: goToMonitoring,
  },
  {
    icon: 'mdi-account-multiple-outline',
    title: '사용자 관리',
    subtitle: '관리자 및 일반 사용자 계정 관리',
    action: goToUserManagement,
  },
  {
    icon: 'mdi-alert-circle-outline',
    title: '신고 관리',
    subtitle: '사용자 신고 관리',
    action: goToReportManagement,
  },
  {
    icon: 'mdi-cog-outline',
    title: '워크플로우 설정',
    subtitle: 'GitHub Actions 템플릿 및 자동화 설정',
    action: goToWorkflowSettings,
  },
]
</script>

<style scoped>
.dashboard-container {
  padding: 40px 16px;
  max-width: 1000px;
  margin: 0 auto;
}

/* 👋 인삿말 섹션 */
.greeting-section {
  text-align: center;
  margin-bottom: 40px;
}
.greeting-icon {
  color: #ff7043;
  margin-bottom: 12px;
}
.greeting-text {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}
.greeting-subtext {
  font-size: 0.95rem;
  color: #666;
  margin-top: 8px;
}

/* ✨ 기능 섹션 */
.features-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 무조건 2열 */
  gap: 24px;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  transition: 0.2s ease;
  height: 120px;
  cursor: pointer;
  background: #f9f9f9;
}
.feature:hover {
  background-color: #ffece4;
}
.feature-icon {
  color: #ff7043;
  margin-top: 4px;
}
.feature-texts {
  display: flex;
  flex-direction: column;
}
.feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}
.feature-subtitle {
  font-size: 0.88rem;
  color: #666;
  margin-top: 4px;
}
</style>
