<script setup>

import { ref, inject, onMounted } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import Pagination from '../../components/common/Pagination.vue';
import CommonButton from '@/components/common/CommonButton.vue';

const customAxios = inject('customAxios');

// 페이지네이션 관련 변수
const currentPage = ref(1);
const totalPages = ref(0);

// 버튼 설정
const buttonConfig = {
  save: {
    label: '등록하기',
    fontColor: 'white',
    backgroundColor: 'black'
  },
}

// 내 동행 모집 목록
const myPostList = ref([]);

// 내 동행 모집 목록 조회 API
function getMyCompanionPostList() {
  customAxios
    .get(`/companions/my-posts?page=${currentPage.value}`)
    .then(res => {
      myPostList.value = res.data.postList;
      totalPages.value = res.data.totalPages;
    })
    .catch(error => {
    })
}

// 최초 내 동행 모집 목록 조회
onMounted(() => {
  getMyCompanionPostList();
})

// 내 동행 모집 상세 페이지 이동
function goToMyCompanionPostDetail(postId) {
  globalStore.router.push({
    name: 'MyCompanionPostDetail',
    params: {
      companionPostId: postId
    }
  });
}

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getMyCompanionPostList();
}

// 동행 모집 저장 페이지 이동
function goToCompanionPostSave() {
  globalStore.router.push('/companionPostSave');  
}

</script>

<template>
  <div class="main">

    <div class="my-companion-post-list-container" v-if="myPostList.length > 0">

      <div class="list-item-container" 
        v-for="(myPost) in myPostList" :key="myPost.id"
        @click="goToMyCompanionPostDetail(myPost.id)"
      >
        <div class="item-title-status">
          {{ myPost.title }}
          <span class="item-status-label">
            {{ myPost.status }}
          </span>
        </div>
        <div class="item-location">
          장소: {{ myPost.location }}
        </div>
        <div class="item-duration">
            {{ myPost.startDate }} ~ {{ myPost.endDate }}
        </div>
      </div>

    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">등록한 동행이 없습니다 😢</span>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

    <CommonButton
      @click="goToCompanionPostSave()"
      :label="buttonConfig.save.label"
      :fontColor="buttonConfig.save.fontColor"
      :background-color="buttonConfig.save.backgroundColor"
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

.item-title-status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.item-status-label {
  font-size: 14px;
  font-weight: 600;
  padding: 5px 10px;
  background: #000;
  color: #fff;
  border-radius: 15px;
}

.item-location {
  display: flex;
  justify-content: center;
  word-break: keep-all;
  text-align: center;     
}

.item-duration {
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
