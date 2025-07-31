<template>
  <v-container class="user-management-container">
    <div class="header-area">
      <div class="title">
        <v-icon class="me-2">mdi-account</v-icon>
        사용자 관리
      </div>
      <v-text-field
        v-model="search"
        class="search-input"
        placeholder="이메일 또는 닉네임 검색"
        variant="outlined"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-magnify"
        clearable
      />
    </div>

    <v-card class="user-card" elevation="1">
      <v-table class="custom-table">
        <thead>
          <tr>
            <th class="nickname-field">닉네임</th>
            <th>이메일</th>
            <th>가입경로</th>
            <th>가입일</th>
            <th>상태</th>
            <th>조치</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
            <td data-label="닉네임">
              <span class="user-link" @click="openUserModal(user.id)">
                {{ user.profile?.nickname || '-' }}
              </span>
            </td>
            <td data-label="이메일">{{ user.email }}</td>
            <td data-label="가입경로">
              <span :class="['chip-path', pathColor(user.account_path)]">
                {{ getPathLabel(user.account_path) }}
              </span>
            </td>
            <td data-label="가입일">{{ formatDate(user.created_at) }}</td>
            <td data-label="상태">
              <span :class="['badge', statusColor(user.account_status)]">
                {{ getStatusLabel(user) }}
              </span>
            </td>
            <td data-label="조치" class="action-btn-td">
              <template v-if="user.email === ADMIN_EMAIL"> - </template>
              <template v-else>
                <template v-if="user.account_status === 0">
                  <!-- 활성 상태: 임시정지 & 영구정지 버튼 -->
                  <button class="action-btn gray" @click="suspend(user.id)">
                    임시정지
                  </button>
                  <button class="action-btn red" @click="ban(user.id)">
                    영구정지
                  </button>
                </template>

                <template v-else-if="user.account_status === 2">
                  <!-- 탈퇴 상태 -->
                  탈퇴 상태
                </template>

                <template v-else-if="user.account_status === 1">
                  <!-- 임시정지 상태 -->
                  <button class="action-btn gray" @click="unsuspend(user.id)">
                    임시정지 해제
                  </button>
                </template>

                <template v-else-if="user.account_status === 4">
                  <!-- 영구정지 상태 -->
                  <button class="action-btn red" @click="unban(user.id)">
                    영구정지 해제
                  </button>
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <UserModal
      v-if="selectedUser"
      :user="selectedUser"
      v-model:show="showModal"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/store/admin/adminStore'
import UserModal from './modal/UserModal.vue'

const adminStore = useAdminStore()

const search = ref('')
const showModal = ref(false)
const selectedUser = ref<any>(null)

const ADMIN_EMAIL = 'hungll.snack@gmail.com'

const filteredUsers = computed(() => {
  const filtered = adminStore.allAccounts.filter(
    (u) =>
      u.email.toLowerCase().includes(search.value.toLowerCase()) ||
      u.profile?.nickname?.toLowerCase()?.includes(search.value.toLowerCase())
  )

  return filtered.sort((a, b) => {
    if (a.email === ADMIN_EMAIL) return -1
    if (b.email === ADMIN_EMAIL) return 1
    return 0
  })
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

function getStatusLabel(user: any) {
  if (user.account_status === 0) return '활성'
  if (user.account_status === 2) return '탈퇴'
  if (user.account_status === 1)
    return `임시정지${user.suspended_until ? ` (${formatDate(user.suspended_until)})` : ''}`
  if (user.account_status === 4) return '영구정지'
  return '알 수 없음'
}

function statusColor(status: number) {
  return (
    {
      0: 'badge-active',
      1: 'badge-withdrawn',
      2: 'badge-suspended',
      4: 'badge-banned',
    }[status] || ''
  )
}

function getPathLabel(path: string) {
  const map: Record<string, string> = {
    Kakao: 'Kakao',
    github: 'Github',
    Naver: 'Naver',
    Google: 'Google',
  }
  return map[path] || path
}

function pathColor(path: string) {
  const map: Record<string, string> = {
    Kakao: 'kakao',
    github: 'github',
    Naver: 'naver',
    Google: 'google',
  }
  return map[path] || ''
}

async function openUserModal(userId: number) {
  selectedUser.value = null
  showModal.value = true
  await adminStore.fetchSelectAccount(userId)
  selectedUser.value = adminStore.selectedAccount
}

async function suspend(userId: number) {
  const reason = prompt('정지 사유를 입력해주세요') || '관리자 판단에 의한 임시정지'
  const duration = Number(prompt('정지 기간 (일)을 숫자로 입력해주세요')) || 7

  try {
    const success = await adminStore.suspendUser(userId, reason, duration)
    if (success) {
      alert('✅ 임시정지 처리되었습니다.')
      await adminStore.fetchAllAccounts()
    }
  } catch (err) {
    alert('❌ 처리 실패')
    console.error(err)
  }
}

async function unsuspend(userId: number) {
  try {
    const success = await adminStore.unsuspendUser(userId)
    if (success) {
      alert('✅ 임시정지 해제 완료!')
      await adminStore.fetchAllAccounts()
    }
  } catch (err) {
    alert('❌ 해제 실패')
    console.error(err)
  }
}

async function ban(userId: number) {
  try {
    const reason =
      prompt('정지 사유를 입력해주세요') || '관리자 판단에 의한 영구정지'
    const success = await adminStore.banUser(userId, reason)
    if (success) {
      alert('✅ 영구정지 처리되었습니다.')
      await adminStore.fetchAllAccounts()
    }
  } catch (err) {
    alert('❌ 처리 중 오류가 발생했습니다.')
    console.error(err)
  }
}

async function unban(userId: number) {
  try {
    const success = await adminStore.unbanUser(userId)
    if (success) {
      alert('✅ 영구정지 해제 완료!')
      await adminStore.fetchAllAccounts()
    }
  } catch (err) {
    alert('❌ 해제 실패')
    console.error(err)
  }
}

onMounted(async () => {
  try {
    await adminStore.fetchAllAccounts()
  } catch (err) {
    console.error('🚨 사용자 목록 로딩 실패:', err)
  }
})
</script>

<style scoped>
.user-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px;
}
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.search-input {
  max-width: 280px;
  border-radius: 50px;
}
.user-card {
  border-radius: 14px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0px 8px;
}
.custom-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  color: #444;
  background-color: #f5f6f9;
}
::v-deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  text-align: center !important;
}
.custom-table td {
  padding: 16px;
  background-color: #ffffff;
  border: none;
  text-align: center; /* ✅ 기본 td 중앙 정렬 */
}
.custom-table td:nth-child(2) {
  text-align: left !important;
}
.user-row:hover td {
  background-color: #f9f9ff;
}
.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.8rem;
  border-radius: 20px;
  font-weight: 500;
}
.badge-active {
  background-color: #d0e7ff;
  color: #0062cc;
  min-width: 47px;
}
.badge-withdrawn {
  background-color: #e0e0e0;
  color: #333;
  min-width: 47px;
}
.badge-suspended {
  background-color: #dcdcdc;
  color: #555;
  min-width: 47px;
}
.badge-banned {
  background-color: #ffe0e0;
  color: #d00000;
  min-width: 47px;
}
.chip-path {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  color: white;
}
.kakao {
  background-color: #fee500;
  color: #3d1d1d;
  min-width: 40px;
}
.github {
  background-color: #6f42c1;
  color: #ffffff;
  min-width: 40px;
}
.naver {
  background-color: #03c75a;
  color: #ffffff;
  min-width: 40px;
}
.google {
  background-color: #4285f4;
  color: #ffffff;
  min-width: 40px;
}
.action-btn {
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  margin-right: 6px;
  cursor: pointer;
}
.action-btn.gray {
  background-color: #e0e0e0;
  color: #444;
}
.action-btn.red {
  background-color: #ffd6d6;
  color: #c62828;
}
.user-link {
  color: #333;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}
.user-link:hover {
  text-decoration: underline;
  color: #0077ccda;
}
.action-btn-td {
  min-width: 180px;
}
.nickname-field {
  min-width: 180px;
}
::v-deep(.v-table > .v-table__wrapper > table > tbody > tr > td),
::v-deep(.v-table > .v-table__wrapper > table > tbody > tr) {
  border-bottom: none !important;
}

/* ✅ 모바일 대응 */
@media (max-width: 768px) {
  .custom-table thead {
    display: none;
  }

  .custom-table tbody tr {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
    padding: 12px;
  }

  .custom-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    font-size: 0.85rem;
    border: none;
    text-align: left !important;
  }
  .custom-table th {
    display: table-cell !important; /* 💡 th는 table 기본 형식 유지 */
    text-align: center !important;
    font-size: 0.85rem;
  }

  .custom-table td::before {
    content: attr(data-label);
    font-weight: 600;
    margin-right: 10px;
    color: #555;
  }

  .action-btn-td {
    display: flex !important;
    justify-content: flex-end !important;
    gap: 6px;
  }

  .custom-table td.action-btn-td::before {
    content: '';
    display: none;
  }
}

::v-deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  border-bottom: none !important;
}
</style>
