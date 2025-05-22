<script setup>

import { ref, inject } from 'vue'; 
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const props = defineProps({
  portfolioId: {
    type: String,
    required: true
  }
})

const auth = useAuthStore();
const customAxios = inject('customAxios');

const portfolioId = ref('');
const portfolioName = ref('');
const portfolioContent = ref('');
const portfolioUrl = ref('');
const memberId = ref('');
const memberName = ref('');

// 버튼 설정
const buttonConfig = {
  update: {
    label: '수정하기',
    fontColor: 'white',
    backgroundColor: 'black'
  }
}

// 포트폴리오 상세 API
function getPortfolio() {

  customAxios
    .get(`/portfolios/${props.portfolioId}`)
    .then(res => {
      portfolioId.value = res.data.portfolioId;
      portfolioName.value = res.data.portfolioName;
      portfolioContent.value = res.data.portfolioContent;
      portfolioUrl.value = res.data.portfolioUrl;
      memberId.value = res.data.memberId;
      memberName.value = res.data.memberName;
    })
    .catch(error => {
    })

}

getPortfolio();


// 포트폴리오 수정 페이지 이동
function goToPortfolioUpdate() {
  globalStore.router.push({
    name: 'PortfolioUpdate',
    params: {
      portfolioId: portfolioId.value
    }
  });
}

</script>

<template>
  <div class="main">
    <div class="portfolio-detail-container">
      <div class="portfolio-member-name">
        <span class="subject">작성자</span>
        <span>{{ memberName }}</span>
      </div>
      <div class="portfolio-name">
        <label class="subject" for="portfolio-detail-name">
          포트폴리오 제목
        </label>
        <input 
          type="text" 
          class="name-input"
          id="portfolio-detail-name"
          :value="portfolioName"
          disabled
        >
      </div>
      <div class="portfolio-content">
        <label class="subject" for="portfolio-detail-content">포트폴리오 내용</label>
        <textarea 
          class="content-textarea"
          id="portfolio-detail-content"
          :value="portfolioContent"
          disabled
        />

      </div>
      <div class="portfolio-url">
        <label class="subject" for="portfolio-detail-url">포트폴리오 URL</label>
        <input 
          type="text"
          class="url-input"
          id="portfolio-detail-url"
          :value="portfolioUrl || '없음'"
          disabled
        >
      </div>
    </div>

    <div class="portfolio-detail-button-container" v-if="auth.member?.id === memberId">
      <CommonButton
        @click="goToPortfolioUpdate()"
        :label="buttonConfig.update.label"
        :fontColor="buttonConfig.update.fontColor"
        :background-color="buttonConfig.update.backgroundColor"
      />
    </div>
  </div>
</template>

<style scoped>

.portfolio-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject {
  font-weight: bold;
  font-size: 18px;
}

.portfolio-member-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.portfolio-name {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.name-input {
  height: 25px;
  font-size: 16px;
}

.portfolio-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.content-textarea {
  resize: none;
  min-height: 200px;
  font-size: 16px;
}

.content-length {
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #333;
}

.portfolio-url {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.url-input {
  height: 25px;
  font-size: 16px;
}

.portfolio-visibility {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visibility-radio-button-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.portfolio-detail-button-container {
  display: flex;
  flex-direction: column;
}

</style>
