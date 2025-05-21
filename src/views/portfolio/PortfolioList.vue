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

// 내 포트폴리오 목록 조회 API
function getPortfolioList() {

  customAxios
    .get('/portfolios')
    .then(res => {
      console.log(res);
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
    fontColor: 'black',
    backgroundColor: 'white'
  }
}

function savePortfolio() {
  globalStore.router.push('/portfolioSave')  
}

</script>

<template>
  <div class="main">
    {{ props.username }}
    <div class="portfolio-list-button-container">
      <CommonButton
        @click="savePortfolio()"
        :label="buttonConfig.save.label"
        :fontColor="buttonConfig.save.fontColor"
        :background-color="buttonConfig.save.backgroundColor"
      />
    </div>
  </div>
</template>

<style scoped>

.portfolio-list-button-container {
  display: flex;
  flex-direction: column;
  border: 1px solid red;
}

</style>
