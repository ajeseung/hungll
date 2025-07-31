<template>
    <v-dialog :model-value="show" @update:model-value="closeModal" max-width="380px">
      <v-card class="modal-card">
        <v-card-title class="modal-header">
          헝글로 연결
          <button class="close-btn" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </button>
        </v-card-title>
  
        <v-card-text class="modal-content">
          <p class="qr-title">QR코드</p>
  
          <img :src="qrCodeImage" alt="QR 코드" class="qr-code" />
  
          <p class="qr-description">
            <br />
            휴대전화의 카메라 또는 앱으로 QR 코드를 촬영해주세요.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  import qrCodeImage from '@/assets/images/qrcode.png'
  
  const props = defineProps({ show: Boolean });
  const emit = defineEmits(["update:show"]);
  
  const closeModal = () => {
    emit("update:show", false);
  };
  </script>
  
  <style scope>
.modal-card {
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }
  
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
    font-size: 18px;
    padding: 4px;
  }
  
  .modal-content {
    text-align: center;
    padding: 20px;
  }
  
  .qr-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .qr-code {
    width: 180px;
    height: 180px;
    margin: 10px auto;
    display: block;
  }
  
  .qr-description {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
    line-height: 1.4;
  }
  
  </style>