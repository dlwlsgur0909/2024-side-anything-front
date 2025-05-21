<script setup>

import { ref, inject } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const props = defineProps({
  portfolioId: {
    type: String,
    required: true
  }
})

const customAxios = inject('customAxios');

const portfolioId = ref('');
const portfolioName = ref('');
const portfolioContent = ref('');
const portfolioUrl = ref('');
const isPublic = ref(true);

// 포트폴리오 상세 API
function getPortfolio() {

customAxios
  .get(`/portfolios/${props.portfolioId}`)
  .then(res => {
    portfolioId.value = res.data.portfolioId;
    portfolioName.value = res.data.portfolioName;
    portfolioContent.value = res.data.portfolioContent;
    portfolioUrl.value = res.data.portfolioUrl;
    isPublic.value = res.data.isPublic;
  })
  .catch(error => {
  })

}

getPortfolio();

// 버튼 설정
const buttonConfig = {
  update: {
    label: '수정하기',
    fontColor: 'white',
    backgroundColor: 'black'
  }
}

// 포트폴리오 내용 글자 수 검증
function validateContentLimit() {

  if(portfolioContent.value?.length > 500) {
    globalStore.alert.openAlert('최대 500자까지 입력 가능합니다');
    portfolioContent.value = portfolioContent.value.slice(0, 500);
  }

}

// 포트폴리오 수정 API
function updatePortfolio() {
  if(!validatePortfolioSaveRequest()) {
    return;
  }

  const request = {
    portfolioName: portfolioName.value,
    portfolioContent: portfolioContent.value,
    portfolioUrl: portfolioUrl.value,
    isPublic: isPublic.value
  }

  customAxios
    .patch(`/portfolios/${portfolioId.value}`, request)
    .then(res => {
      globalStore.router.push({
        name: 'PortfolioDetail',
        params: {
          portfolioId: portfolioId.value
        }
      })
    })
    .catch(error => {
    })

}

// 포트폴리오 요청 검증
function validatePortfolioSaveRequest() {

  if(!portfolioName.value?.trim()) {
    globalStore.alert.openAlert('포트폴리오 제목을 입력해주세요');
    return false;
  }

  if(!portfolioContent.value?.trim()) {
    globalStore.alert.openAlert('포트폴리오 내용을 입력해주세요');
    return false;
  }

  return true;
}

</script>

<template>
  <div class="main">
    <div class="portfolio-update-container">
      <div class="portfolio-name">
        <label class="subject" for="portfolio-update-name">
          포트폴리오 제목
        </label>
        <input 
          type="text" 
          class="name-input"
          id="portfolio-update-name"
          v-model="portfolioName"
        >
      </div>
      <div class="portfolio-content">
        <label class="subject" for="portfolio-update-content">포트폴리오 내용</label>
        <textarea 
          class="content-textarea"
          id="portfolio-update-content"
          v-model="portfolioContent"
          @input="validateContentLimit()"  
        />
        <span class="content-length">
          {{ `${portfolioContent.length}/500` }}
        </span>

      </div>
      <div class="portfolio-url">
        <label class="subject" for="portfolio-update-url">포트폴리오 URL</label>
        <input 
          type="text"
          class="url-input"
          id="portfolio-update-url"
          v-model="portfolioUrl"
          placeholder="https://www.example.com"
        >
      </div>
      <div class="portfolio-visibility">
        <span class="subject">공개범위</span>
        <div class="visibility-radio-button-container">
          <label>
            Public
            <input 
              type="radio"
              id="public"
              :value="true"
              v-model="isPublic"
            >
          </label>
          <label>
            Private
            <input 
              type="radio"
              id="private" 
              :value="false"
              v-model="isPublic"
            >
          </label>
        </div>
      </div>
    </div>

    <div class="portfolio-update-button-container">
      <CommonButton
        @click="updatePortfolio()"
        :label="buttonConfig.update.label"
        :fontColor="buttonConfig.update.fontColor"
        :background-color="buttonConfig.update.backgroundColor"
      />
    </div>
  </div>
</template>

<style scoped>

.portfolio-update-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject {
  font-weight: bold;
  font-size: 18px;
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

.portfolio-update-button-container {
  display: flex;
  flex-direction: column;
}

</style>
