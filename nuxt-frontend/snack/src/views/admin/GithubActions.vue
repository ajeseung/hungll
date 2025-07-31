<template>
  <section class="actions-monitor-wrapper">
    <h2 class="section-title">GitHub Actions 모니터링</h2>
    <p class="section-sub">헝글(HUNGLL) 프로젝트의 실시간 CI/CD 상태를 확인할 수 있어요.</p>

    <!-- 🟧 커스텀 버튼 UI -->
    <div class="repo-tabs">
      <button
        v-for="repo in repositories"
        :key="repo.url"
        :class="['repo-tab', { active: selectedRepo === repo.url }]"
        @click="selectRepo(repo.url)"
      >
        {{ repo.label }}
      </button>
    </div>

    <!-- ⏳ 로딩 -->
    <div v-if="loading" class="loading-box">
      <div class="spinner" />
      <p class="loading-text">워크플로우 데이터를 불러오는 중입니다...</p>
    </div>

    <!-- ✅ 워크플로우 리스트 -->
    <ul v-if="!loading && selectedRepo" class="workflow-list">
      <li
        v-for="run in adminStore.workflows"
        :key="run.id"
        :class="['workflow-item', run.conclusion === 'failure' ? 'error' : 'success']"
      >
        <div class="workflow-header">
          <h3 class="workflow-name">{{ run.name }}</h3>
          <button class="link-btn" @click="viewDetails(run.html_url)">🔗</button>
        </div>
        <div class="workflow-meta">
          <span class="badge" :class="run.conclusion">{{ statusLabel(run.status, run.conclusion) }}</span>
          <span class="created-at">{{ formatDate(run.created_at) }}</span>
        </div>
      </li>

      <li v-if="adminStore.workflows.length === 0" class="empty-msg">
        워크플로우 실행 내역이 없습니다.
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '@/store/admin/adminStore'

const adminStore = useAdminStore()
const loading = ref(false)

const repositories = [
  { label: 'Frontend', url: 'https://github.com/hungll-snack/snack-nuxt-frontend' },
  { label: 'Backend', url: 'https://github.com/hungll-snack/snack-django-backend' },
  { label: 'FastAPI', url: 'https://github.com/hungll-snack/snack-fastapi-ai' },
]

const selectedRepo = ref<string | null>(null)

const selectRepo = async (repoUrl: string) => {
  selectedRepo.value = repoUrl
  await fetchWorkflowRuns()
}

const fetchWorkflowRuns = async () => {
  const token = localStorage.getItem('userToken')
  if (!token) {
    alert('GitHub 인증 토큰이 없습니다.')
    return
  }

  loading.value = true
  try {
    await adminStore.fetchGithubWorkflow(token, selectedRepo.value!)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const viewDetails = (url: string) => {
  window.open(url, '_blank')
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Asia/Seoul',
  }).format(date)
}

const statusLabel = (status: string, conclusion: string | null) => {
  if (status === 'completed' && conclusion === 'success') return '성공'
  if (status === 'completed' && conclusion === 'failure') return '실패'
  if (status === 'in_progress') return '진행 중'
  return status
}
</script>

<style scoped>
.actions-monitor-wrapper {
  padding: 2rem;
}
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.section-sub {
  color: #666;
  margin-bottom: 1.5rem;
}
.repo-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}
.repo-tab {
  background: #eee;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}
.repo-tab.active {
  background-color: #f76808;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.loading-box {
  text-align: center;
}
.spinner {
  border: 4px solid #eee;
  border-top: 4px solid #f76808;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}
.loading-text {
  margin-top: 0.5rem;
  color: #666;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.workflow-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.workflow-item {
  border: 1px solid #eee;
  border-left: 6px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: background 0.2s;
}
.workflow-item.success {
  border-left-color: #2ecc71;
  background-color: #f9fdf9;
}
.workflow-item.error {
  border-left-color: #e74c3c;
  background-color: #fff2f2;
}
.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.workflow-name {
  font-weight: 600;
  font-size: 1rem;
}
.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
.workflow-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #555;
  margin-top: 4px;
}
.badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}
.badge.success {
  background: #e8f5e9;
  color: #27ae60;
}
.badge.failure {
  background: #fdecea;
  color: #c0392b;
}
.empty-msg {
  text-align: center;
  color: #999;
  font-size: 0.95rem;
  padding: 2rem 0;
}
</style>
