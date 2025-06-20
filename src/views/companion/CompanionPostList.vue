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
const companionPostList = ref([]);

// 동행 모집 목록 조회 API
function getCompanionPostList() {

  // request parameter에 인코딩이 필요한 특수문자가 들어가면 에러가 발생하므로 encodeURIComponent 사용
  customAxios
    .get(`/companions?page=${currentPage.value}&keyword=${encodeURIComponent(keyword.value)}`)
    .then(res => {
      companionPostList.value = res.data.companionPostList;
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


// 동행 모집 저장 페이지 이동
function goToCompanionPostSave() {
  globalStore.router.push('/companionPostSave');  
}

// 동행 모집 상세 페이지 이동
function goToCompanionPostDetail(companionPostId) {

  // 검색어, 현재 페이지 정보 저장
  sessionStorage.setItem('keyword', keyword.value);
  sessionStorage.setItem('currentPage', currentPage.value);

  globalStore.router.push({
    name: 'CompanionPostDetail',
    params: {
      companionPostId: companionPostId
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
  save: {
    label: '등록하기',
    fontColor: 'white',
    backgroundColor: 'black'
  },
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


    <div class="companion-post-list-container" v-if="companionPostList.length > 0">
      <div class="list-item-container" 
        v-for="(companionPost) in companionPostList" :key="companionPost.id"
        @click="goToCompanionPostDetail(companionPost.id)"
      >
        <div class="item-info">
          <div class="item-id">
            {{ companionPost.id }}
          </div>
          <div class="item-title">
            {{ companionPost.title }}
          </div>
          <div class="item-location">
            {{ companionPost.location }}
          </div>
          <div class="item-status">
            {{ companionPost.status }}
          </div>
        </div>

        <div class="item-duration">
          기간:
          {{ companionPost.startDate }}
          ~
          {{ companionPost.endDate }}
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

    <div class="companion-post-list-button-container">
      <CommonButton
        @click="goToCompanionPostSave()"
        :label="buttonConfig.save.label"
        :fontColor="buttonConfig.save.fontColor"
        :background-color="buttonConfig.save.backgroundColor"
      />
    </div>

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
  width: 100px;
}

.companion-post-list-container {
  display: flex;
  flex-direction: column;
}

.list-item-container {
  display: flex;
  flex-direction: column;
  min-height: 60px;
  word-break: break-all;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
}

.list-item-container:hover {
  background: #514fe1;
  color: #fff;
}

.item-info {
  display: flex;
  align-items: center;
}

.item-id {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.item-title {
  flex: 6;
  display: flex;
  justify-content: center;
}

.item-location {
  flex: 1.5;
  display: flex;
  justify-content: center;
}

.item-status {
  flex: 1.5;
  display: flex;
  justify-content: center;
  padding: 3px 0;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: black;
  border-radius: 15px;
}

.item-duration {
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
  font-weight: 500;
  font-size: 14px;
}

.companion-post-list-button-container {
  display: flex;
  flex-direction: column;
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
