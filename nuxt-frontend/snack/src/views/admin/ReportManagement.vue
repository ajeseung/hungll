<template>
  <v-container class="report-container">
    <h2 class="page-title">🚨 사용자 신고 관리</h2>

    <div class="table-wrapper">
      <v-card class="rounded-xl elevation-1 report-card">
        <v-table density="comfortable">
          <thead class="report-table-head">
            <tr>
              <th>ID</th>
              <th>신고자</th>
              <th>대상</th>
              <th>유형</th>
              <th>사유</th>
              <th>일시</th>
              <th>상태</th>
              <th>조치</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in reportList"
              :key="item.id"
              class="clickable-row"
              @click="openReportDetail(item.id)"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.reporter_id }}</td>
              <td>{{ item.target_id }}</td>
              <td>{{ translateTargetType(item.target_type) }}</td>
              <td>{{ translateReason(item.reason_type) }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>
                <span
                  :class="[
                    'status-text',
                    item.processed ? 'text-blue' : 'text-green',
                  ]"
                >
                  {{ item.processed ? '처리완료' : '대기중' }}
                </span>
              </td>
              <td class="action-cell" @click.stop>
                <div class="action-buttons">
                  <v-btn
                    v-if="!item.processed"
                    class="action-btn green"
                    size="small"
                    @click="processReport(item.id)"
                  >
                    처리
                  </v-btn>
                  <v-btn
                    class="action-btn red"
                    size="small"
                    @click="deleteReport(item.id)"
                  >
                    삭제
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      <ReportModal
        :show="dialog"
        :report="selectedReport"
        @update:show="dialog = false"
      /> 
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/store/admin/adminStore'
import ReportModal from '@/views/admin/modal/ReportModal.vue'

const adminStore = useAdminStore()
const reportList = ref<any[]>([])
const dialog = ref(false)
const selectedReport = ref<any>(null)

onMounted(async () => {
  await adminStore.fetchReportList()
  reportList.value = adminStore.reportList
})

const openReportDetail = async (id: number) => {
  await adminStore.fetchReportDetail(id)
  selectedReport.value = adminStore.selectedReport
  dialog.value = true
}

const deleteReport = async (id: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  const success = await adminStore.deleteReport(id)
  if (success) {
    await adminStore.fetchReportList()
    reportList.value = adminStore.reportList
  }
}

const processReport = async (id: number) => {
  const success = await adminStore.processReport(id)
  if (success) {
    await adminStore.fetchReportList()
    reportList.value = adminStore.reportList
  }
}

const formatDate = (isoDate: string | null): string => {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleString()
}

const translateTargetType = (type: string): string => {
  switch (type) {
    case 'BOARD':
      return '게시글'
    case 'COMMENT':
      return '댓글'
    default:
      return type
  }
}

const translateReason = (code: string): string => {
  const reasonMap: Record<string, string> = {
    SPAM: '불법광고',
    ABUSE: '욕설/인신공격',
    REPEAT: '도배성글/댓글반복',
    PRIVACY: '개인정보노출/사생활침해',
    SEXUAL: '음란성/선정성',
    FALSE_INFO: '허위정보/가짜리뷰',
    DISCRIMINATION: '차별/혐오표현',
    ETC: '기타부적절한행위',
  }
  return reasonMap[code] || code
}
</script>

<style scoped>
/* 📦 레이아웃 */
.report-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 16px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.table-wrapper {
  overflow-x: auto;
}

.report-card {
  background-color: #fff;
  min-width: 760px;
}

/* 📊 테이블 헤더 */
.report-table-head th {
  background-color: #f9f9fb;
  font-weight: bold;
  font-size: 14px;
  color: #666;
  text-align: left;
  border-bottom: none !important;
}

/* 📄 테이블 바디 */
td {
  font-size: 14px;
  padding: 12px;
  vertical-align: middle;
  color: #333;
  min-height: 50px;
}

/* 📍 상태 칸 */
.status-text {
  font-size: 13px;
  font-weight: 600;
}
.text-green {
  color: #2e7d32; /* 대기중 - 진한 초록 */
}
.text-blue {
  color: #1565c0; /* 처리완료 - 진한 파랑 */
}

/* 🛠 조치 칸 */
.report-table-head th:last-child {
  text-align: center !important;
}

td:last-child {
  text-align: center;
}

.action-cell {
  text-align: center;
  vertical-align: middle;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 100%;
}

/* 버튼 스타일 (account 관리 스타일 맞춤) */
.action-btn {
  font-size: 13px;
  font-weight: 400;
  border-radius: 9999px; /* pill 스타일 */
  text-transform: none;
  min-width: 60px;
  height: 30px;
  box-shadow: none;
  padding: 0 12px;
}

.action-btn.green {
  background-color: #e0f5e9;
  color: #115515;
}

.action-btn.red {
  background-color: #fdecea;
  color: #c62828;
}

/* 💡 반응형 고려 */
@media (max-width: 600px) {
  .report-container {
    padding: 24px 12px;
  }

  .page-title {
    font-size: 1.25rem;
    margin-bottom: 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-row:hover {
  background-color: #f5f5f5;
}
</style>
