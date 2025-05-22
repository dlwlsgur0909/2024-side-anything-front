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

const currentPage = ref(1);
const totalElements = ref(0);
const totalPages = ref(0);

const portfolioList = ref([]);

// 내 포트폴리오 목록 조회 API
function getPortfolioList() {

  customAxios
    .get(`/portfolios?page=${currentPage.value}`)
    .then(res => {
      portfolioList.value = res.data.portfolioList;
      totalElements.value = res.data.totalElements;
      totalPages.value = res.data.totalPages;
    })
    .catch(error => {
    })

}

getPortfolioList();

// 버튼 설정
const buttonConfig = {
  save: {
    label: '등록하기',
    fontColor: 'white',
    backgroundColor: 'black'
  }
}

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

</script>

<template>
  <div class="main">

    <div class="portfolio-list-container">
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

</style>
