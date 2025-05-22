<script setup>

import { ref, inject } from 'vue'; 
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const customAxios = inject('customAxios');
const auth = useAuthStore();
const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const portfolioList = ref([]);

// 내 포트폴리오 목록 조회 API
function getPortfolioList() {

  customAxios
    .get('/portfolios')
    .then(res => {
      portfolioList.value = res.data;
    })
    .catch(error => {
      console.log(error);
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

</script>

<template>
  <div class="main">

    <div class="portfolio-list-container">
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
  justify-content: flex-end;
  width: 15%;
}

.portfolio-list-button-container {
  display: flex;
  flex-direction: column;
}

</style>
