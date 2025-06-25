<script setup>

import { ref, inject, onMounted } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';
import Pagination from '../../components/common/Pagination.vue';

const customAxios = inject('customAxios');

// 페이지네이션 관련 변수
const currentPage = ref(1);
const totalPages = ref(0);

// 검색어 
const keyword = ref('');

// 동행 모집 목록 
const postList = ref([]);

// 동행 모집 목록 조회 API
function getCompanionPostList() {

  // request parameter에 인코딩이 필요한 특수문자가 들어가면 에러가 발생하므로 encodeURIComponent 사용
  customAxios
    .get(`/companions?page=${currentPage.value}&keyword=${encodeURIComponent(keyword.value)}`)
    .then(res => {
      postList.value = res.data.postList;
      totalPages.value = res.data.totalPages;
    })
    .catch(error => {
    })

}

// 검색 이벤트
function onClickSearch() {
  keyword.value = keyword.value.trim();
  currentPage.value = 1;
  getCompanionPostList();

}

// 최초 동행 모집 목록 조회
onMounted(() => {

  // 저장된 검색어, 현재 페이지 정보
  const savedKeyword = sessionStorage.getItem('keyword');
  const savedCurrentPage = Number(sessionStorage.getItem('currentPage'));

  sessionStorage.removeItem('keyword');
  sessionStorage.removeItem('currentPage');

  keyword.value = savedKeyword ? savedKeyword : '';
  currentPage.value = savedCurrentPage ? savedCurrentPage : 1;

  getCompanionPostList();
})

// 동행 모집 상세 페이지 이동
function goToCompanionPostDetail(postId) {

  // 검색어, 현재 페이지 정보 저장
  sessionStorage.setItem('keyword', keyword.value);
  sessionStorage.setItem('currentPage', currentPage.value);

  globalStore.router.push({
    name: 'CompanionPostDetail',
    params: {
      companionPostId: postId
    }
  });
}

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getCompanionPostList();
}

// 버튼 설정
const buttonConfig = {
  search: {
    label: '검색',
    fontColor: 'white',
    backgroundColor: 'black'
  }
}

</script>

<template>
  <div class="main">

    <div class="companion-post-search-container">
      <input type="text" 
        class="companion-post-search-box" placeholder="제목 / 장소"
        v-model="keyword" @keyup.enter="onClickSearch()"
      />
      <CommonButton
        class="companion-post-search-button"
        :label="buttonConfig.search.label"
        :fontColor="buttonConfig.search.fontColor"
        :background-color="buttonConfig.search.backgroundColor"
         @click="onClickSearch()"
      />
    </div>


    <div class="companion-post-list-container" v-if="postList.length > 0">
      <div class="list-item-container" 
        v-for="(post) in postList" :key="post.id"
        @click="goToCompanionPostDetail(post.id)"
      >
        <div class="item-title-status">
          {{ post.title }}
          <span class="item-status-label">
            {{ post.status }}
          </span>
        </div>
        <div class="item-location">
          장소: {{ post.location }}
        </div>
        <div class="item-duration">
          {{ post.startDate }} ~ {{ post.endDate }}
        </div>
      </div>
    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">등록된 동행이 없습니다 😢</span>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

  </div>
</template>

<style scoped>

.companion-post-search-container {
  display: flex;
  gap: 20px;
}

.companion-post-search-box {
  height: 40px;
  border-radius: 5px;
  flex: 1;
}

.companion-post-search-button {
  flex: 1;
  max-width: 100px;
}

.companion-post-list-container {
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
  background: #514fe1;
  color: #fff;
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
