<template>
  <div class="mypage-container">
    <aside class="profile-menu">
      <div class="profile-top">
        <div class="avatar-circle">😊</div>
        <p class="nickname">
          <strong>{{ accountStore.nickname }}</strong> 님
        </p>
      </div>

      <div class="menu-list">
        <button
          class="menu-btn pill"
          :class="{ active: selectedMenu === 'profile' }"
          @click="selectedMenu = 'profile'"
        >
          나의 프로필
        </button>

        <button
          class="menu-btn pill"
          :class="{ active: selectedMenu === 'scrap' }"
          @click="selectedMenu = 'scrap'"
        >
          나의 찜 목록
        </button>
      </div>
    </aside>

    <main class="content-area">
      <div v-if="selectedMenu === 'profile'" class="profile-wrapper">
        <div class="scrap-header">기본 정보</div>
        <ul class="info-list">
          <li>
            <span class="label">이름</span><span>{{ accountStore.name }}</span>
          </li>
          <li>
            <span class="label">닉네임</span>
            <span v-if="!isEditing">{{ accountStore.nickname }}</span>
            <div v-if="isEditing">
              <input v-model="nickname" placeholder="닉네임을 입력하세요" />
              <button @click="checkNickname">중복 확인</button>
              <p v-if="nicknameCheckResult === true" class="available-msg">
                사용 가능한 닉네임입니다.
              </p>
              <p v-if="nicknameCheckResult === false" class="error-msg">
                이미 사용 중인 닉네임입니다.
              </p>
            </div>
          </li>
          <li v-if="accountStore.gender">
            <span class="label">성별</span
            ><span>{{ accountStore.gender }}</span>
          </li>
          <li v-if="accountStore.age">
            <span class="label">나이</span><span>{{ accountStore.age }}</span>
          </li>
          <li v-if="accountStore.birth">
            <span class="label">생년월일</span
            ><span>{{ accountStore.birth }}</span>
          </li>
          <li v-if="accountStore.email">
            <span class="label">이메일</span
            ><span>{{ accountStore.email }}</span>
          </li>
          <li v-if="accountStore.accountPath === 'Google' || accountStore.phoneNum">
            <span class="label">전화번호</span>
            <span v-if="!isEditing">{{ accountStore.phoneNum || 'N' }}</span>
            <input
              v-if="isEditing && accountStore.accountPath === 'Google'"
              v-model="phoneNum"
              @input="formatPhoneNumber"
              maxlength="13"
              placeholder="01012345678"
            />
          </li>
          <li>
            <span class="label">주소</span>
            <span v-if="!isEditing">{{
              accountStore.address || 'N'
            }}</span>
            <input
              v-if="isEditing"
              v-model="address"
              placeholder="예: 서울특별시 강남구 테헤란로 123"
            />
          </li>
          <li>
            <span class="label">가입 경로</span
            ><span>{{ accountStore.accountPath }}</span>
          </li>
          <li>
            <span class="label">가입 일자</span
            ><span>{{ formatDate(accountStore.accountRegister) }}</span>
          </li>
        </ul>

        <div class="profile-footer">
          <v-btn v-if="!isEditing" class="edit-btn" flat @click="toggleEdit"
            >수정하기</v-btn
          >
          <v-btn
            v-if="isEditing"
            class="save-btn"
            flat
            :disabled="!isModified"
            @click="saveProfile"
            >저장하기</v-btn
          >
          <v-btn v-if="isEditing" class="cancel-btn" flat @click="toggleEdit"
            >취소</v-btn
          >
        </div>

        <div class="scrap-header">알림 설정</div>
        <ul class="info-list">
          <li>
            <span class="label">게시글 알림</span>
            <div
              class="toggle-switch"
              :class="alarmBoardStatus ? 'on' : 'off'"
              @click="toggleAlarm('board')"
            >
              <div class="toggle"></div>
              <span>{{ alarmBoardStatus ? 'ON' : 'OFF' }}</span>
            </div>
          </li>
          <li>
            <span class="label">댓글 알림</span>
            <div
              class="toggle-switch"
              :class="alarmCommentStatus ? 'on' : 'off'"
              @click="toggleAlarm('comment')"
            >
              <div class="toggle"></div>
              <span>{{ alarmCommentStatus ? 'ON' : 'OFF' }}</span>
            </div>
          </li>
        </ul>

        <div class="scrap-header">
          구독 및 결제
          <span class="notice">(현재 테스트 중이며 실제 서비스 운영이 아닙니다)</span>
          <button
            v-if="!subscribeStore.isSubscribed"
            class="subscribe-btn"
            @click="navigateToSubscribe"
          >
            헝글패스 구독하기
          </button>
          
          <button
            v-if="subscribeStore.isSubscribed"
            class="subscribe-btn gray"
            @click="cancelSubscription"
          >
            구독 해지
          </button>
        </div>

        <div v-if="subscribeStore.isSubscribed">
          <ul class="info-list">
            <li><span class="label">구독 상태</span><span>구독중</span></li>
            <li><span class="label">구독 상품</span><span>{{ subscribeStore.planName }}</span></li>
            <li><span class="label">만료일</span><span>{{ formatDate(subscribeStore.endDate) }}</span></li>
            <li><span class="label">결제 금액</span><span>{{ paymentsStore.paymentInfo?.amountWithCurrency || 'N/A' }}</span></li>
            <li><span class="label">결제 방법</span><span>{{ paymentsStore.paymentInfo?.method || 'N/A' }}</span></li>
            <li><span class="label">결제 일자</span><span>{{ formatDate(paymentsStore.paymentInfo?.approvedAt || '') || 'N/A' }}</span></li>
            <li v-if="paymentsStore.paymentInfo?.receipt_url">
              <span class="label">영수증</span>
              <span>
                <a :href="paymentsStore.paymentInfo.receipt_url" target="_blank" style="color: #ff6f00; font-weight: 600;">
                  영수증 보기
                </a>
              </span>
            </li>
          </ul>
        </div>
        <p v-else class="none-subscribe">현재 구독 중이 아닙니다.</p>
        </div>
      
        <div v-if="selectedMenu === 'scrap'">
        <MyScrapList />
      </div>
    </main>
  </div>

  <div class="withdraw">
    <v-btn class="withdraw-btn" flat @click="handleWithdraw">회원 탈퇴</v-btn>
  </div>

  <div class="admin-entry" @click="openAdminModal">
    관리자 페이지로 이동하기
  </div>

  <template v-if="showAdminModal">
    <div class="modal-backdrop" @click.self="closeAdminModal">
      <div class="admin-modal">
        <h3>관리자 코드 입력</h3>
        <input
          v-model="adminCode"
          type="password"
          class="admin-input"
          placeholder="관리자 코드를 입력하세요"
        />
        <div class="modal-buttons">
          <button class="card-btn" @click="submitAdminCode">확인</button>
          <button class="cancel-btn" @click="closeAdminModal">취소</button>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/store/account/accountStore'
import { accountRepository } from '@/repository/account/accountRepository'
import { useAuthStore } from '@/store/auth/authStore'
import { useAdminStore } from '@/store/admin/adminStore'
import { useSubscribeStore } from '@/store/subscribe/subscribeStore'
import { usePaymentsStore } from '@/store/payments/paymentsStore'
import type { PaymentInfo } from '@/store/payments/paymentsStore'
import MyScrapList from '@/views/mypage/MyScrapList.vue'

const accountStore = useAccountStore()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const subscribeStore = useSubscribeStore()
const paymentsStore = usePaymentsStore()
const router = useRouter()

const selectedMenu = ref<'profile' | 'scrap'>('profile')
const isEditing = ref(false)
const isModified = ref(false)
const nicknameCheckResult = ref<null | boolean>(null)
const paymentInfo = ref<PaymentInfo | null>(null)

const nickname = ref(accountStore.nickname)
const phoneNum = ref(accountStore.phoneNum)
const address = ref(accountStore.address)
const alarmBoardStatus = ref(accountStore.alarmBoardStatus)
const alarmCommentStatus = ref(accountStore.alarmCommentStatus)

watch(
  [nickname, phoneNum, address],
  ([newNickname, newPhoneNum, newAddress]) => {
    isModified.value =
      newNickname !== accountStore.nickname ||
      newPhoneNum !== accountStore.phoneNum ||
      newAddress !== accountStore.address
  }
)

const toggleEdit = () => {
  if (isEditing.value) {
    nickname.value = accountStore.nickname
    phoneNum.value = accountStore.phoneNum
    address.value = accountStore.address
    isModified.value = false
  }
  isEditing.value = !isEditing.value
}

const checkNickname = async () => {
  if (nickname.value === accountStore.nickname) {
    nicknameCheckResult.value = true
    return
  }

  try {
    const response = await accountRepository.checkNicknameDuplication(
      nickname.value
    )
    nicknameCheckResult.value = response.available
  } catch (error) {
    console.error('닉네임 중복 확인 에러:', error)
    nicknameCheckResult.value = false
  }
}

const toggleAlarm = async (type: string) => {
  if (type === 'board') {
    alarmBoardStatus.value = !alarmBoardStatus.value
  } else if (type === 'comment') {
    alarmCommentStatus.value = !alarmCommentStatus.value
  }

  await accountStore.alarmSettings(
    type,
    type === 'board' ? alarmBoardStatus.value : alarmCommentStatus.value
  )
}

const saveProfile = async () => {
  if (!isModified.value) return
  if (
    nickname.value !== accountStore.nickname &&
    nicknameCheckResult.value === false
  ) {
    alert('닉네임이 이미 사용 중입니다.')
    return
  }

  try {
    await accountStore.updateProfile({
      account_nickname: nickname.value,
      phone_num: phoneNum.value,
      account_add: address.value,
    })
    await accountStore.getAccount()
    alert('프로필이 수정되었습니다.')
    isEditing.value = false
    isModified.value = false
  } catch (error) {
    console.error('❌ 프로필 수정 실패:', error)
    alert('프로필 수정에 실패했습니다.')
  }
}

const formatPhoneNumber = () => {
  phoneNum.value = phoneNum.value
    .replace(/[^0-9]/g, '')
    .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    .slice(0, 13)
}

const handleWithdraw = async () => {
  if (confirm('회원 탈퇴하시겠습니까?')) {
    await authStore.withdrawAccount()
    router.push('/')
  }
}

const showAdminModal = ref(false)
const adminCode = ref('')

const openAdminModal = () => {
  showAdminModal.value = true
}
const closeAdminModal = () => {
  showAdminModal.value = false
  adminCode.value = ''
}

const submitAdminCode = async () => {
  const resultMessage = await adminStore.checkAdminCode(adminCode.value)
  alert(resultMessage)
  closeAdminModal()
  if (resultMessage === '관리자 권한이 부여되었습니다.') {
    localStorage.setItem('isAdmin', 'true')
    sessionStorage.setItem('admincheck', 'true')
    router.push('/admin')
  }
}

const navigateToSubscribe = () => {
  router.push('/subscribe/select')
}

const cancelSubscription = async () => {
  await subscribeStore.cancelSubscribe()
  alert('구독이 취소되었습니다.')
}

const formatDate = (rawDate: string) => {
  if (!rawDate) return ""
  const isoDate = rawDate.replace(" ", "T")
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return "미기입"

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}.${month}.${day}`  
}

onMounted(async () => {
  await accountStore.getAccount()
  await accountStore.loadAccount()
  await subscribeStore.loadSubscribeStatus()
  const storedPayment = localStorage.getItem('paymentInfo')
  if (storedPayment) {
    paymentsStore.paymentInfo = JSON.parse(storedPayment)
  }
})

</script>

<style scoped>
.mypage-container {
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: calc(100vh - 200px);
  box-sizing: border-box;
  align-items: stretch;
}

.profile-menu {
  width: 260px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: #fff8ee;
  border-radius: 50%;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(255, 102, 0, 0.2);
}

.nickname {
  font-size: 16px;
  font-weight: bold;
}

.menu-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: auto;
}

.menu-btn {
  width: 100%;
  padding: 16px 12px;
  background: #f4f4f4;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  transition: 0.2s ease;
  cursor: pointer;
}
.menu-btn.pill {
  border-radius: 999px;
}
.menu-btn.active {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
}

.edit-btn,
.save-btn,
.cancel-btn {
  margin-top: 5px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
}

.profile-footer {
  margin-top: 0;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.withdraw-btn {
  background: #f2f2f2;
  color: #c62828;
  font-weight: 600;
  border-radius: 10px;
  width: 150px;
  margin-top: 32px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.profile-wrapper,
.scrap-wrapper {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(255, 102, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scrap-header {
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
  color: #e65100;
}

.scrap-content.centered {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.scrap-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.scrap-card {
  background: #fff8ee;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
  border: 1px solid #ffcc80;
}

.scrap-card:hover {
  transform: translateY(-4px);
}

.card-content {
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #ff6f00;
  margin-bottom: 8px;
}

.card-date {
  font-size: 13px;
  color: #888;
}

.card-delete-btn {
  align-self: flex-end;
}

.empty-message {
  color: #666;
  line-height: 1.6;
}

.card-btn {
  padding: 10px 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: 600;
  font-size: 15px;
}

.info-list {
  width: 100%;
  margin-top: 5px;
  font-size: 14px;
  color: #444;
}
.info-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.info-list + .scrap-header {
  margin-top: 20px;
}
.label {
  font-weight: 600;
  color: #888;
}

.admin-entry {
  text-align: center;
  margin-top: 40px;
  font-size: 12px;
  color: #bbb;
  cursor: pointer;
  user-select: none;
}
.admin-entry:hover {
  color: #999;
}

.withdraw {
  display: flex;
  justify-content: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.admin-modal {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.admin-modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
}

.admin-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.cancel-btn {
  background: #eee;
  color: #444;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 14px;
}

@media (max-width: 700px) {
  .mypage-container {
    flex-direction: column;
    padding: 24px 16px;
  }

  .profile-menu {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    gap: 16px;
  }

  .profile-top {
    gap: 12px;
    margin-bottom: 0;
  }

  .menu-list {
    gap: 8px;
    margin-bottom: 0;
  }

  .withdraw-btn {
    width: auto;
    margin-top: 0;
  }

  .content-area {
    width: 100%;
  }
}

.available-msg {
  color: green;
}

.error-msg {
  color: red;
}

.toggle-switch {
  position: relative;
  width: 52px;
  height: 26px;
  background: #e0e0e0;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  box-sizing: border-box;
}

.toggle-switch.on {
  background: linear-gradient(135deg, #ff9800, #ff5722);
}

.toggle-switch .toggle {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  position: absolute;
  top: 2px;
  left: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.on .toggle {
  transform: translateX(26px);
}

.toggle-switch.off .toggle {
  transform: translateX(0);
}

.toggle-switch span {
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  width: 100%;
  text-align: center;
  pointer-events: none;
  transition:
    color 0.3s,
    transform 0.3s;
}

.toggle-switch.on span {
  transform: translateX(-12px);
  color: white;
}

.toggle-switch.off span {
  transform: translateX(7px);
  color: #666;
}

.subscribe-btn {
  background-color: #ff9800;
  color: #fff;
  border: none;
  padding: 4px 10px;
  margin-left: 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
  font-size: 10px;
}

.subscribe-btn.gray {
  background-color: #ccc;
  color: white;
}

.none-subscribe{
  font-size: 12px;
  color: #999;  
}

.d-flex {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}


</style>
