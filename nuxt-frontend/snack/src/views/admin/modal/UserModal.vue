<template>
  <v-overlay :model-value="show" class="user-overlay" persistent>
    <div class="user-modal">
      <div class="modal-header">
        <div class="modal-title">👤 사용자 상세 정보</div>
      </div>

      <div class="modal-body">
        <div
          v-for="(value, label) in userInfoList"
          :key="label"
          class="info-row"
        >
          <div class="label">{{ label }}</div>
          <div class="value" :class="labelClass(label, value)">
            <template v-if="label === '가입경로' || label === '상태'">
              <span :class="['chip', getStyle(label, value)]">{{ value }}</span>
            </template>
            <template v-else>
              {{ value || '-' }}
            </template>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button block class="confirm-btn" @click="emit('update:show', false)">
          확인
        </button>
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  user: any
}>()

const emit = defineEmits(['update:show'])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR')
}

const getStyle = (label: string, value: string) => {
  if (label === '가입경로') {
    return {
      Kakao: 'kakao',
      Github: 'github',
      Naver: 'naver',
      Google: 'google',
    }[value]
  }
  if (label === '상태') {
    return {
      활성: 'badge-active',
      탈퇴: 'badge-withdrawn',
      임시정지: 'badge-suspended',
      영구정지: 'badge-banned',
    }[value]
  }
  return ''
}

const labelClass = (label: string, value: string) =>
  ['가입경로', '상태'].includes(label) ? 'badge-cell' : ''
const PATH_LABELS = {
  Kakao: 'Kakao',
  github: 'Github',
  Naver: 'Naver',
  Google: 'Google',
} as const

const STATUS_LABELS = {
  0: '활성',
  1: '탈퇴',
  2: '임시정지',
  4: '영구정지',
} as const

const userInfoList = computed(() => {
  const p = props.user?.profile || {}
  return {
    이름: p.name,
    닉네임: p.nickname,
    이메일: props.user.email,
    가입경로:
      PATH_LABELS[props.user.account_path as keyof typeof PATH_LABELS] ||
      props.user.account_path,

    가입일: formatDate(props.user.created_at),
    상태:
      STATUS_LABELS[props.user.account_status as keyof typeof STATUS_LABELS] ||
      '-',

    연락처: p.phone_num,
    주소: p.address,
    성별: p.gender,
    생년월일: p.birth,
    '구독 여부': p.subscribed ? '구독중' : '미구독',
  }
})
</script>

<style scoped>
.user-overlay {
  z-index: 2200;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-modal {
  background: white;
  max-width: 480px;
  min-width: 340px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 500;
}

.modal-body {
  padding: 20px 24px;
  flex: 1;
  overflow-y: auto;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}

.label {
  font-weight: 600;
  color: #444;
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
}
.value {
  color: #222;
  flex: 2;
  text-align: right;
  word-break: break-word;
  font-size: 13px;
}
.badge-cell .value {
  display: flex;
  justify-content: flex-end;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}
.confirm-btn {
  background-color: #ff6e20a9;
  width: 80px;
  border-radius: 20px;
  color: white;
  font-weight: 500;
}

/* ✅ chip & badge 공통 스타일 */
.chip,
.badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  color: white;
  min-width: 50px;
  text-align: center;
}

.kakao {
  background-color: #fee500;
  color: #3d1d1d;
}
.github {
  background-color: #6f42c1;
}
.naver {
  background-color: #03c75a;
}
.google {
  background-color: #4285f4;
}
.badge-active {
  background-color: #d0e7ff;
  color: #0062cc;
}
.badge-withdrawn {
  background-color: #e0e0e0;
  color: #333;
}
.badge-suspended {
  background-color: #dcdcdc;
  color: #555;
}
.badge-banned {
  background-color: #ffe0e0;
  color: #d00000;
}
</style>
