<template>
    <v-overlay :model-value="show" class="report-overlay" persistent>
      <div class="report-modal">
        <div class="modal-header">
          <div class="modal-title">🚨 신고 상세 정보</div>
        </div>
  
        <div class="modal-body">
          <div
            v-for="(value, label) in reportInfoList"
            :key="label"
            class="info-row"
          >
            <div class="label">{{ label }}</div>
            <div class="value">{{ value || '-' }}</div>
          </div>
        </div>
  
        <div class="modal-footer">
          <button class="confirm-btn" @click="emit('update:show', false)">
            확인
          </button>
        </div>
      </div>
    </v-overlay>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    show: boolean
    report: any
  }>()
  const emit = defineEmits(['update:show'])
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString('ko-KR')
  }
  
  const translateTargetType = (type: string) => {
    switch (type) {
      case 'BOARD': return '게시글'
      case 'COMMENT': return '댓글'
      default: return type
    }
  }
  
  const translateReason = (code: string) => {
    const reasonMap: Record<string, string> = {
      SPAM: '불법광고',
      ABUSE: '욕설/인신공격',
      REPEAT: '도배성글/댓글반복',
      PRIVACY: '개인정보노출/사생활침해',
      SEXUAL: '음란성/선정성',
      FALSE_INFO: '허위정보/가짜리뷰',
      DISCRIMINATION: '차별/혐오표현',
      ETC: '기타부적절한행위'
    }
    return reasonMap[code] || code
  }
  
  const reportInfoList = computed(() => {
    return {
      '신고 ID': props.report?.id,
      '신고자 ID': props.report?.reporter_id,
      '신고 대상 ID': props.report?.target_id,
      '대상 유형': translateTargetType(props.report?.target_type),
      '신고 사유': translateReason(props.report?.reason_type),
      '신고 일시': formatDate(props.report?.created_at),
      '처리 여부': props.report?.processed ? '완료' : '대기중',
      '처리자 ID': props.report?.processed_by || '-',
      '처리 일시': formatDate(props.report?.processed_at) || '-'
    }
  })
  </script>
  
  <style scoped>
  .report-overlay {
    z-index: 2200;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .report-modal {
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
    padding: 16px 20px;
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
  
  .modal-footer {
    padding: 16px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: center;
  }
  
  .confirm-btn {
    background-color: #ff6e20a9;
    width: 80px;
    border-radius: 20px;
    color: white;
    font-weight: 500;
    padding: 6px 16px;
  }
  </style>