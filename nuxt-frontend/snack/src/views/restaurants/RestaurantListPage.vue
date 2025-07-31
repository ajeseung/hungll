<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12" class="search-col">
        <div class="restaurant-list-wrapper">
          <!-- 검색창 -->
          <input
            v-model="keyword"
            @keydown.enter="search"
            placeholder="식당명을 검색하세요"
            class="search-input"
          />

          <!-- 지역 필터 -->
          <div class="filter-section">
            <div class="filter-group">
              <div class="filter-header">
                <h4 class="filter-title">서울시</h4>
                <button
                  class="toggle-filter-btn"
                  @click="areaFilterExpanded = !areaFilterExpanded"
                >
                  {{ areaFilterExpanded ? '필터 접기 ⬆' : '필터 펼치기 ⬇' }}
                </button>
              </div>

              <div v-show="areaFilterExpanded" class="filter-button-group">
                <button
                  v-for="area in areas"
                  :key="area"
                  :class="[
                    'filter-button',
                    selectedAreas.includes(area) ? 'selected' : '',
                  ]"
                  @click="toggleArea(area)"
                >
                  {{ area }} ({{ areaCounts[area] || 0 }})
                </button>
              </div>

              <div v-if="selectedAreas.length > 0" class="selected-summary">
                <span>선택된 지역: {{ selectedAreas.join(', ') }}</span>
                <button class="reset-btn" @click="selectedAreas = []">
                  초기화
                </button>
              </div>
            </div>
          </div>

          <!-- 맛집 리스트 -->
          <h2 class="list-title">🍽️ 맛집 목록</h2>
          <div
            v-for="r in filteredRestaurants"
            :key="r.id"
            class="restaurant-card"
            @click="openDetail(r)"
          >
            <div class="flex-1">
              <div class="restaurant-name">
                {{ r.name }}
              </div>
              <div class="address">📍 {{ r.address }}</div>
            </div>
            <div class="button-row">
              <button class="friend-btn" @click.stop="handleFindFriend(r)">
                밥 친구 모임 ({{ r.friendCount || 0 }})
              </button>
              <button class="bookmark-icon" @click.stop="toggleScrap(r)">
                <v-icon size="24" color="orange">
                  {{
                    restaurantStore.isRestaurantScrapped(r.id)
                      ? 'mdi-bookmark'
                      : 'mdi-bookmark-outline'
                  }}
                </v-icon>
              </button>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 상세 모달 -->
    <RestaurantModal :show="showModal" @close="showModal = false" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRestaurantsStore } from '@/store/restaurants/restaurantsStore'
import RestaurantModal from '@/views/restaurants/RestaurantModal.vue'
import type { Restaurant } from '@/store/restaurants/restaurantsStore'
import { useRouter } from 'vue-router'
useHead({
  title: '헝글 - 서울 맛집 찾기 & 밥친구 찾기',
  meta: [
    {
      name: 'description',
      content:
        '서울 전 지역의 인증된 맛집을 헝글 AI가 추천해드립니다. 당신의 선호도를 바탕으로 최적의 식당을 찾아보세요.',
    },
    {
      name: 'keywords',
      content:
        '헝글, 밥친구찾기, 서울맛집, AI 추천 맛집, 헝글맛집 리스트, 서울맛집 리스트, 혼밥, 밥친구, 식사 모임, 서울 곱창, 서울 와인 맛집, 맛집 찾기, 맛집 추천, 맛집 찾기 서비스', 


    },
    { property: 'og:title', content: '서울 맛집 찾기 - 헝글(HUNGLL)' },
    {
      property: 'og:description',
      content:
        '혼밥은 이제 그만! 서울 맛집을 한눈에 확인하고 밥친구까지 찾아보세요.',
    },
    { property: 'og:image', content: 'https://hungll.com/og/hungle_hgl.png' },
    { property: 'og:url', content: 'https://hungll.com/restaurants/all' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

const restaurantStore = useRestaurantsStore()
const router = useRouter()

const keyword = ref('')
const selectedAreas = ref<string[]>([])
const showModal = ref(false)
const areaFilterExpanded = ref(true)
const scrappedIds = ref<number[]>([])

const areas = [
  '종로구',
  '중구',
  '용산구',
  '성동구',
  '광진구',
  '동대문구',
  '중랑구',
  '성북구',
  '강북구',
  '도봉구',
  '노원구',
  '은평구',
  '서대문구',
  '마포구',
  '양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구',
]

const toggleArea = (area: string) => {
  selectedAreas.value.includes(area)
    ? (selectedAreas.value = selectedAreas.value.filter((a) => a !== area))
    : selectedAreas.value.push(area)
}

const search = () => {
  restaurantStore.searchKeyword = keyword.value
  restaurantStore.searchRestaurants()
}

const openDetail = (r: Restaurant) => {
  restaurantStore.setSelectedRestaurant(r)
  showModal.value = true
}

const handleFindFriend = (r: Restaurant) => {
  const accountId = localStorage.getItem('account_id')
  const userToken = localStorage.getItem('userToken')
  if (accountId && userToken) {
    router.push('/board/all')
  } else {
    alert('로그인 후 이용할 수 있습니다 😊')
  }
}

const filteredRestaurants = computed(() => {
  return restaurantStore.restaurantList.filter((r) => {
    return (
      selectedAreas.value.length === 0 ||
      selectedAreas.value.some((area) => r.address.includes(area))
    )
  })
})

const areaCounts = computed(() => {
  const counts: Record<string, number> = {}
  restaurantStore.restaurantList.forEach((r) => {
    const match = areas.find((area) => r.address.includes(area))
    if (match) {
      counts[match] = (counts[match] || 0) + 1
    }
  })
  return counts
})

onMounted(async () => {
  await restaurantStore.loadAllRestaurants()
  await restaurantStore.loadBoardCounts()
  await restaurantStore.loadScraps()
})

const toggleScrap = async (restaurant: Restaurant) => {
  const accountId = localStorage.getItem('account_id')
  const userToken = localStorage.getItem('userToken')

  if (!accountId || !userToken) {
    alert('로그인 후 이용할 수 있습니다 😊')
    return
  }
  await restaurantStore.toggleScrap(restaurant.id)
}
</script>

<style scoped>
.search-col {
  padding-left: 8px;
}
.restaurant-list-wrapper {
  padding: 16px;
  height: 100%;
  background: #ffffff;
  border-radius: 16px;
  overflow-y: auto;
  max-height: 100vh;
}
.search-input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 999px;
  font-size: 14px;
  background-color: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: #ff9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2);
}
.filter-section {
  margin-bottom: 20px;
}
.filter-group {
  margin-bottom: 12px;
}
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.filter-title {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}
.toggle-filter-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  padding: 2px 6px;
}
.filter-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-button {
  padding: 6px 14px;
  background: #eee;
  color: #333;
  border: none;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.filter-button.selected {
  background: linear-gradient(to right, #ff9800, #ff5722);
  color: #fff;
  font-weight: 700;
}
.selected-summary {
  margin-top: 10px;
  font-size: 13px;
  color: #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.reset-btn {
  background: none;
  border: none;
  color: #ff5722;
  font-size: 12px;
  cursor: pointer;
}
.list-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}
.restaurant-card {
  position: relative; /* 버튼 고정 위치 기준 */
  background: #ffffff;
  padding: 16px;
  padding-right: 130px; /* 우측 요소 침범 방지 */
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column; /* 내부 레이아웃 위→아래 */
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.restaurant-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}
.address {
  font-size: 13px;
  color: #777;
  margin-bottom: 12px;
}

/* .button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
} */

.button-row {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.flex-1 {
  flex: 1;
  min-width: 0;
}

.friend-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  background: #f5f5f5;
  color: #333;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}
.friend-btn:hover {
  transform: scale(1.05);
  background: #e0e0e0;
}
.bookmark-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
/* 기존 위치 고정 스타일 */
.button-row {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 모바일 뷰 대응 */
@media (max-width: 700px) {
  .button-row {
    position: static; /* 절대 위치 해제 */
    margin-top: -8px;
    margin-bottom: 0;
    justify-content: flex-end;
    width: 100%;
  }

  .restaurant-card {
    padding-right: 16px; /* 기존 우측 padding 제거 */
  }

  .restaurant-name {
    font-size: 15px;
  }

  .address {
    font-size: 12px;
  }
}

</style>
