<template>
  <section class="workflow-settings">
    <h2 class="title">⚙️ 워크플로우 설정 관리</h2>

    <div class="description-box">
      프로젝트별 GitHub Actions 워크플로우를 수동으로 실행할 수 있어요.
    </div>

    <div class="workflow-grid">
      <div
        v-for="workflow in workflows"
        :key="workflow.id"
        class="workflow-card"
      >
        <div class="card-header">
          <div class="name">
            <i class="mdi mdi-file-code-outline icon" />
            {{ workflow.name }}
          </div>
          <button class="deploy-btn" @click="() => triggerWorkflow(workflow)">배포</button>
        </div>

        <div class="status-label">
          워크플로우 수동 트리거 방식입니다.
        </div>

        <div class="card-actions">
          <div v-if="workflow.message" :class="['feedback', workflow.messageType]">
            {{ workflow.message }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '@/store/admin/adminStore'

const adminStore = useAdminStore()

const workflows = ref([
  { id: 1, name: '프론트엔드 배포', repo: 'https://github.com/hungll-snack/snack-nuxt-frontend', workflowName: 'main.yml', message: '', messageType: '' },
  { id: 2, name: '백엔드 테스트', repo: 'https://github.com/hungll-snack/snack-django-backend', workflowName: 'main.yml', message: '', messageType: '' },
  { id: 3, name: 'FastAPI 테스트 및 배포', repo: 'https://github.com/hungll-snack/snack-fastapi-ai', workflowName: 'main.yml', message: '', messageType: '' },
])

const triggerWorkflow = async (workflow: any) => {
  const userToken = localStorage.getItem('userToken')
  if (!userToken) {
    workflow.message = '인증 정보가 없습니다.'
    workflow.messageType = 'error'
    return
  }

  try {
    await adminStore.triggerGithubWorkflow(userToken, workflow.repo, workflow.workflowName)
    workflow.message = '✅ 워크플로우 실행 요청이 전송되었습니다.'
    workflow.messageType = 'success'
  } catch (err) {
    console.error(err)
    workflow.message = '❌ 워크플로우 실행 중 오류가 발생했습니다.'
    workflow.messageType = 'error'
  }
}
</script>

<style scoped>
.workflow-settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px;
}
.title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
}
.description-box {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 32px;
}
.workflow-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.workflow-card {
  flex: 1 1 calc(33.33% - 16px);
  box-sizing: border-box;
  border: 1px solid #ddd;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-weight: 600;
  font-size: 1rem;
}
.card-header .icon {
  margin-right: 8px;
  font-size: 20px;
  color: #666;
}
.deploy-btn {
  background-color: #3cb371;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.deploy-btn:hover {
  background-color: #2e7d32;
}
.status-label {
  padding: 0 16px 8px;
  font-size: 0.85rem;
  color: #666;
}
.card-actions {
  padding: 0 16px 16px;
}
.feedback {
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-top: 10px;
}
.feedback.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}
.feedback.error {
  background-color: #ffebee;
  color: #c62828;
}
@media (max-width: 900px) {
  .workflow-card {
    flex: 1 1 100%;
  }
  .workflow-grid {
    flex-direction: column;
  }
}
</style>
