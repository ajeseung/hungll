<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <p>💬 우측 하단의 <strong>헝글 챗봇</strong>을 이용해보세요!</p>
      <div class="button-group single">
        <button class="confirm" @click="$emit('close')">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: 320px;
  animation: popup-fade 0.3s ease-out;
}

.modal-content p {
  font-size: 15px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.button-group.single {
  display: flex;
  justify-content: center;
}

button {
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.confirm {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
}

@keyframes popup-fade {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
