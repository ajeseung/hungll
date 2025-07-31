<template>
  <div class="scrap-wrapper">
    <div class="scrap-header">나의 찜 목록</div>

    <div v-if="restaurantStore.scrapList.length > 0" class="scrap-list">
      <div
        v-for="r in restaurantStore.scrapList"
        :key="r.id"
        class="scrap-card"
      >
        <div class="card-content">
          <div class="card-title">{{ r.name }}</div>
          <div class="card-date">찜한 날짜: {{ formatDate(r.created_at) }}</div>
        </div>
        <button class="card-delete-btn" @click="toggleScrap(r.id)">삭제</button>
      </div>
    </div>

    <div v-else class="scrap-content centered">
      <p class="empty-message">
        현재 찜한 목록이 없습니다.<br />더 많은 식당을 담아보세요!
      </p>
      <button class="card-btn" @click="goToRestaurantAll">맛집 찾기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRestaurantsStore } from '@/store/restaurants/restaurantsStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const restaurantStore = useRestaurantsStore()
const router = useRouter()

const toggleScrap = async (restaurantId: number) => {
  await restaurantStore.toggleScrap(restaurantId)
  await restaurantStore.loadScrapsFromServer()
}

const goToRestaurantAll = () => {
  router.push('/restaurants/all')
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

onMounted(() => {
  restaurantStore.loadScrapsFromServer()
})
</script>

<style scoped>
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

.scrap-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  justify-content: center;
  place-items: center; /* 카드 정렬 보정 */
  padding-bottom: 24px;
}

.scrap-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  aspect-ratio: 1 / 1;
  max-width: 220px;
  width: 100%;
  box-sizing: border-box;
}

.scrap-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.card-content {
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.card-date {
  font-size: 13px;
  color: #666;
}

.card-delete-btn {
  align-self: center;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  background: #ff9800;
  color: white;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: none;
}

.card-delete-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
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
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card-btn:hover {
  transform: scale(1.05);
}
</style>
