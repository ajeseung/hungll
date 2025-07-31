<template>
  <v-dialog
    :model-value="props.show"
    @update:modelValue="(val) => emit('close')"
    :width="dialogWidth"
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card v-if="restaurant" class="modal-card">
      <div class="modal-bookmark-icon" @click="toggleScrap">
        <v-icon size="30" color="orange">
          {{ isScrapped ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
        </v-icon>
      </div>
      <v-card-title class="modal-title">
        {{ restaurant.name }}
      </v-card-title>
      <v-card-text class="modal-content">
        <p class="info-line">
          <strong>📍 주소:</strong> {{ restaurant.address }}
        </p>
        <p class="info-line">
          <strong>⏰ 영업시간:</strong> {{ restaurant.closed || '정보 없음' }}
        </p>
        <div id="modal-map" class="map-area" />
      </v-card-text>

      <v-card-actions class="modal-actions">
        <v-btn class="friend-btn" @click="handleFindFriend">
          밥 친구 모임 ({{ restaurant.friendCount || 0 }})
        </v-btn>
        <v-spacer />
        <v-btn text @click="$emit('close')">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, computed, nextTick } from 'vue'
import { useRestaurantsStore } from '@/store/restaurants/restaurantsStore'
import { useRouter } from 'vue-router'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const restaurantStore = useRestaurantsStore()
const router = useRouter()

const restaurant = computed(() => restaurantStore.selectedRestaurant)
const dialogWidth = computed(() => (window.innerWidth <= 480 ? '90vw' : '600'))

const isScrapped = computed(() => 
  restaurantStore.isRestaurantScrapped(restaurant.value.id)
)

const toggleScrap = async () => {
  const accountId = localStorage.getItem('account_id')
  const userToken = localStorage.getItem('userToken')

  if(!accountId || !userToken) {
    alert('로그인 후 이용할 수 있습니다 😊')
    return
  }
  await restaurantStore.toggleScrap(restaurant.value.id)
}

watch(
  () => props.show,
  async (val) => {
    if (val && restaurant.value) {
      await nextTick()
      initModalMap()
    }
  }
)

const initModalMap = () => {
  if (!restaurant.value) return

  window.kakao.maps.load(() => {
    const container = document.getElementById('modal-map') as HTMLElement
    if (!container) return

    const { latitude, longitude } = restaurant.value
    if (!latitude || !longitude) return

    const center = new window.kakao.maps.LatLng(latitude, longitude)
    const map = new window.kakao.maps.Map(container, {
      center,
      level: 3,
    })

    new window.kakao.maps.Marker({
      map,
      position: center,
    })
  })
}

const handleFindFriend = () => {
  const accountId = localStorage.getItem('account_id')
  const userToken = localStorage.getItem('userToken')
  if (accountId && userToken) {
    router.push('/board/all')
  } else {
    alert('로그인 후 이용할 수 있습니다 😊')
  }
}
</script>

<!-- scoped 제거!! -->
<style>
.modal-card {
  padding: 8px;
  border-radius: 20px;
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  padding: 16px 24px 0;
}

.modal-content {
  padding: 16px 24px;
  font-size: 14px;
  color: #555;
}

.info-line {
  margin-bottom: 10px;
  line-height: 1.6;
}

.map-area {
  width: 100%;
  height: 200px;
  margin-top: 12px;
  border-radius: 12px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.08);
}

.modal-actions {
  padding: 12px 24px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.friend-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  background: linear-gradient(to right, #ff9800, #ff5722);
  color: white;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
  margin-right: auto;
}

.friend-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #ffb74d, #ff7043);
}

.bookmark-btn {
  margin-left: auto;
  margin-right: 8px;
  font-size: 18px;
  color: #ff9800;
}

/* ✅ 모바일 대응 */
@media (max-width: 480px) {
  
  .modal-title {
    font-size: 16px;
    padding: 12px 16px 0;
  }

  .modal-content {
    padding: 12px 16px;
    font-size: 12px;
  }

  .info-line {
    font-size: 12px;
    margin-bottom: 8px;
    line-height: 1.4;
    text-align: left; /* ✅ 왼쪽 정렬 */
  }

  .modal-actions {
    padding: 12px 16px 16px;
    flex-direction: row; /* ✅ 한 줄 정렬 유지 */
    align-items: center;
    justify-content: space-between; /* ✅ 좌우로 정렬 */
    gap: 0;
  }

  .friend-btn {
    font-size: 13px;
    padding: 8px 14px;
    border-radius: 999px;
    width: auto;
    min-width: 140px;
  }

  .v-btn {
    min-width: auto;
  }

  #modal-map {
    height: 140px;
    border-radius: 10px;
  }

  .v-dialog.v-dialog--active {
    max-width: 92vw !important;
    margin: 0 auto;
    border-radius: 20px !important;
  }

  .modal-bookmark-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 10;
  }

}

/* ✅ 모달 배경 전체 흐림 효과 */
.v-overlay__scrim {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}
</style>
