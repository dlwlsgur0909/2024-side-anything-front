<script setup>

import { ref, inject } from 'vue'; 
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';
import Pagination from '../../components/common/Pagination.vue';

const customAxios = inject('customAxios');
const auth = useAuthStore();
const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

// 페이지네이션 관련 변수
const currentPage = ref(1);
const totalElements = ref(0); // totalElements는 현재 사용하지 않음 
const totalPages = ref(0);

// 검색어 
const keyword = ref('');

// 포트폴리오 목록 
const portfolioList = ref([]);

// 내 포트폴리오 목록 조회 API
function getPortfolioList() {

  keyword.value = keyword.value.trim();

  // request parameter에 인코딩이 필요한 특수문자가 들어가면 에러가 발생하므로 encodeURIComponent 사용
  customAxios
    .get(`/portfolios?page=${currentPage.value}&keyword=${encodeURIComponent(keyword.value)}`)
    .then(res => {
      portfolioList.value = res.data.portfolioList;
      totalElements.value = res.data.totalElements;
      totalPages.value = res.data.totalPages;
    })
    .catch(error => {
    })

}

// 최초 포트폴리오 목록 조회
getPortfolioList();

// 포트폴리오 저장 페이지 이동
function goToPortfolioSave() {
  globalStore.router.push('/portfolioSave');  
}

// 포트폴리오 상세 페이지 이동
function goToPortfolioDetail(portfolioId) {
  globalStore.router.push({
    name: 'PortfolioDetail',
    params: {
      portfolioId: portfolioId
    }
  });
}

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getPortfolioList();
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

    <div class="portfolio-search-container">
      <input type="text" 
        class="portfolio-search-box" placeholder="포트폴리오명 / 작성자"
        v-model="keyword" @keyup.enter="getPortfolioList()"
      />
      <CommonButton
        class="portfolio-search-button"
        :label="buttonConfig.search.label"
        :fontColor="buttonConfig.search.fontColor"
        :background-color="buttonConfig.search.backgroundColor"
         @click="getPortfolioList()"
      />
    </div>


    <div class="portfolio-list-container" v-if="portfolioList.length > 0">
      <div class="portfolio-list-header">
          <span class="header-portfolio-id">번호</span>
          <span class="header-portfolio-name">포트폴리오명</span>
          <span class="header-member-name">작성자</span>
      </div>

      <div class="portfolio-list-item" 
        v-for="(portfolio) in portfolioList" :key="portfolio.portfolioId"
        @click="goToPortfolioDetail(portfolio.portfolioId)"
      >
        <div class="item-portfolio-id">
          {{ portfolio.portfolioId }} 
        </div>
        <div class="item-portfolio-name">
          {{ portfolio.portfolioName }}
        </div>
        <div class="item-member-name">
          {{ portfolio.memberName }}
        </div>
      </div>
    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">등록된 포트폴리오가 없습니다 😢</span>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

    <div class="portfolio-list-button-container">
      <CommonButton
        @click="goToPortfolioSave()"
        :label="buttonConfig.save.label"
        :fontColor="buttonConfig.save.fontColor"
        :background-color="buttonConfig.save.backgroundColor"
      />
    </div>
  </div>
</template>

<style scoped>

.portfolio-search-container {
  display: flex;
  gap: 20px;
}

.portfolio-search-box {
  height: 40px;
  border-radius: 5px;
  flex: 1;
}

.portfolio-search-button {
  width: 100px;
}

.portfolio-list-container {
  display: flex;
  flex-direction: column;
}

.portfolio-list-header {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px dashed black;
}

.header-portfolio-id {
  width: 15%;
  text-align: left;
}

.header-portfolio-name {
  width: 70%;
  text-align: center;
}

.header-member-name {
  width: 15%;
  text-align: center;
}

.portfolio-list-item {
  display: flex;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #000;
}

.portfolio-list-item:hover {
  cursor: pointer;
  background: #514fe1;
  color: #fff;
  border-radius: 5px;
}

.item-portfolio-id {
  display: flex;
  justify-content: flex-start;
  width: 15%;
}

.item-portfolio-name {
  display: flex;
  justify-content: center;
  width: 70%;
}

.item-member-name {
  display: flex;
  text-align: center;
  width: 15%;
}

.portfolio-list-button-container {
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
