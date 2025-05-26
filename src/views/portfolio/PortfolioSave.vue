<script setup>

import { ref, inject } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const customAxios = inject('customAxios');

const portfolioName = ref('');
const portfolioContent = ref('');
const portfolioUrl = ref('');
const isPublic = ref(true);

// 파일 Drag&Drop
const fileInput = ref(null);
const uploadFile = ref(null);
const isDragOver = ref(false);

function onDragOver() {
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}

function onDrop(e) {
  isDragOver.value = false;
  if(e.dataTransfer.files.length > 1) {
    globalStore.alert.openAlert('첨부파일은 1개만 등록 가능합니다');
    return;
  }
  uploadFile.value = e.dataTransfer.files[0];
}

function openFileInput() {
  fileInput.value.click();
}

function changeFile(e) {
  uploadFile.value = e.target.files[0];
}

// 버튼 설정
const buttonConfig = {
  save: {
    label: '등록하기',
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

// 포트폴리오 저장 API
function savePortfolio() {

  if(!validatePortfolioSaveRequest()) {
    return;
  }

  const formData = new FormData();

  const request = {
    portfolioName: portfolioName.value,
    portfolioContent: portfolioContent.value,
    portfolioUrl: portfolioUrl.value,
    isPublic: isPublic.value
  }

  formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));
  formData.append('file', uploadFile.value);

  customAxios
    .post('/portfolios', formData)
    .then(res => {
      globalStore.router.push({
        name: 'PortfolioDetail',
        params: {
          portfolioId: res.data
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
    <div class="portfolio-save-container">
      <div class="portfolio-name">
        <label class="subject" for="portfolio-save-name">
          포트폴리오 제목
        </label>
        <input 
          type="text" 
          class="name-input"
          id="portfolio-save-name"
          v-model="portfolioName"
        >
      </div>
      <div class="portfolio-content">
        <label class="subject" for="portfolio-save-content">포트폴리오 내용</label>
        <textarea 
          class="content-textarea"
          id="portfolio-save-content"
          v-model="portfolioContent"
          @input="validateContentLimit()"  
        />
        <span class="content-length">
          {{ `${portfolioContent.length}/500` }}
        </span>

      </div>
      <div class="portfolio-url">
        <label class="subject" for="portfolio-save-url">포트폴리오 URL</label>
        <input 
          type="text"
          class="url-input"
          id="portfolio-save-url"
          v-model="portfolioUrl"
          placeholder="https://www.example.com"
        >
      </div>

      <div class="portfolio-file">
        <label class="subject">첨부파일</label>
        <div 
          :class="isDragOver ? 'on-drag file-drop-zone' : 'file-drop-zone' "
          @dragover.prevent="onDragOver()"
          @dragleave.prevent="onDragLeave()"
          @drop.prevent="(e) => onDrop(e)"
          @click="openFileInput()"
        >
          <p v-if="!uploadFile">클릭하거나 파일을 드랍하여 업로드</p>
          <p v-else class="upload-file-name">{{ uploadFile.name }}</p>
          <input 
            class="file-input"
            ref="fileInput"
            type="file"
            hidden
            @change="e => changeFile(e)"
          >
        </div>
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

    <div class="portfolio-save-button-container">
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

.portfolio-save-container {
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
  font-size: 14px;
}

.portfolio-file {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-drop-zone {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  border: 2px dashed gray;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  color: gray;
  cursor: pointer;
  user-select: none;
}

.on-drag {
  background: rgba(128, 128, 128, 0.281);
}

.upload-file-name {
  font-size: 14px;
  color: #000;
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

.portfolio-save-button-container {
  display: flex;
  flex-direction: column;
}

</style>
