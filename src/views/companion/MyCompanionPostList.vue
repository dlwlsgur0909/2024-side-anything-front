<script setup>

import { ref, inject, onMounted } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import Pagination from '../../components/common/Pagination.vue';

const customAxios = inject('customAxios');

// 페이지네이션 관련 변수
const currentPage = ref(1);
const totalPages = ref(0);

// 내 동행 모집 목록
const myCompanionPostList = ref([]);

// 내 동행 모집 목록 조회 API
function getMyCompanionPostList() {
  customAxios
    .get(`/companions/my-posts?page=${currentPage.value}`)
    .then(res => {
      myCompanionPostList.value = res.data.companionPostList;
      totalPages.value = res.data.totalPages;
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    })
}

// 최초 내 동행 모집 목록 조회
onMounted(() => {
  getMyCompanionPostList();
})

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getMyCompanionPostList();
}


</script>

<template>
  <div class="main">

    <div class="my-companion-post-list-container" v-if="myCompanionPostList.length > 0">

      <div class="list-item-container" 
        v-for="(myCompanionPost) in myCompanionPostList" :key="myCompanionPost.id"
      >
        <div class="item-post-title-status">
          <div class="title-status">
            {{ myCompanionPost.title }}
            <span class="post-status-label">
              ({{ myCompanionPost.status }})
            </span>
          </div>
        </div>
        <div class="item-post-location">
          장소: {{ myCompanionPost.location }}
        </div>
        <div class="item-post-duration">
            {{ myCompanionPost.startDate }} ~ {{ myCompanionPost.endDate }}
        </div>
      </div>

    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">신청한 동행이 없습니다 😢</span>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

  </div>
</template>

<style scoped>

.my-companion-application-list-container {
  display: flex;
  flex-direction: column;
}

.list-item-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
}

.list-item-container:hover {
  color: #fff;
  background: #524FE1;
}

.item-post-title-status {
  display: flex;
  justify-content: center;
}

.title-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-status-label {
  font-size: 14px;
  font-weight: 600;
}

.item-post-location {
  display: flex;
  justify-content: center;
  word-break: keep-all;
  text-align: center;     
}

.item-post-duration {
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.no-content {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.no-content-message {
  font-weight: 500;
}

</style>
