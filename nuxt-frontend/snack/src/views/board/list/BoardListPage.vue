<template>
  <v-container fluid>
    <v-row>
      <!-- 좌측: 검색 -->
      <v-col cols="12" md="3" class="search-col">
        <SearchSection @search="onSearch" />
      </v-col>

      <!-- 우측: 테이블 -->
      <v-col cols="12" md="9" class="table-col">
        <TableSection
          :title="searchParams.title"
          :author="searchParams.author"
          :start_date="searchParams.start_date"
          :end_date="searchParams.end_date"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchSection from './SearchSection.vue'
import TableSection from './TableSection.vue'
useHead({
  title: '헝글- 밥친구 찾기 게시판 & 밥친구 찾기 사이트',
  meta: [
    {
      name: 'description',
      content: '혼밥은 이제 그만! 헝글(HUNGLL) 밥친구 게시판에서 함께 식사할 친구를 찾아보세요. 지역, 시간대, 식사 스타일별로 다양한 모임이 등록되어 있습니다.',
    },
    {
      name: 'keywords',
      content: '헝글, 밥친구, 밥약, 식사메이트, 밥약, 혼밥탈출, 식사모임, 맛집모임',
    },
    { property: 'og:title', content: '헝글 - 밥친구 찾기 게시판' },
    { property: 'og:description', content: '서울 어디서든 밥친구를 찾을 수 있는 헝글 게시판! 편하게 모임을 만들고 함께 맛집을 즐겨보세요.' },
    { property: 'og:image', content: 'https://hungll.com/og/hungle_hgl.png' },
    { property: 'og:url', content: 'https://hungll.com/board/all' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
})

const searchParams = ref({
  title: '',
  author: '',
  start_date: '',
  end_date: ''
})

const onSearch = (params: {
  title: string
  author: string
  start_date: string
  end_date: string
}) => {
  searchParams.value = { ...params }
}
</script>

<style scoped>
.search-col {
  padding-right: 8px;
}
.table-col {
  padding-left: 8px;
}
</style>
