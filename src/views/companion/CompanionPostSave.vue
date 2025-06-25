<script setup>

import { ref, inject } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const customAxios = inject('customAxios');

// 동행 모집 관련 변수
const title = ref('');
const content = ref('');
const location = ref('');
const startDate = ref('');
const endDate = ref('');

const today = new Date().toISOString().split('T')[0];

// 버튼 설정
const buttonConfig = {
  save: {
    label: '등록하기',
    fontColor: 'white',
    backgroundColor: 'black'
  }
}

// 동행 모집 저장 API
function saveCompanionPost() {

  if(!validateCompanionPostSaveRequest()) {
    return;
  }

  const request = {
    title: title.value,
    content: content.value,
    location: location.value,
    startDate: startDate.value,
    endDate: endDate.value
  }

  customAxios
    .post('/companions', request)
    .then(res => {
      globalStore.router.push('/myCompanionPostList');
    })
    .catch(error => {
    })

}

// 동행 모집 저장 요청 검증
function validateCompanionPostSaveRequest() {

  if(!title.value?.trim()) {
    globalStore.alert.openAlert('모집 제목을 입력해주세요');
    return false;
  }

  if(!content.value?.trim()) {
    globalStore.alert.openAlert('모집 내용을 입력해주세요');
    return false;
  }

  if(!location.value?.trim()) {
    globalStore.alert.openAlert('장소를 입력해주세요')
    return false;
  }

  if(!startDate.value?.trim()) {
    globalStore.alert.openAlert('시작일을 입력해주세요');
    return false;
  }

  if(!endDate.value?.trim()) {
    globalStore.alert.openAlert('종료일을 입력해주세요');
    return false;
  }

  if(startDate.value > endDate.value) {
    globalStore.alert.openAlert('시작일이 종료일 이후입니다');
    return false;
  }

  return true;
}

// 모집 내용 글자 수 검증
function validateContentLimit() {

  if(content.value?.length > 500) {
    globalStore.alert.openAlert('최대 500자까지 입력 가능합니다');
    content.value = content.value.slice(0, 500);
  }

}

// 뒤로가기
function goToMyCompanionPostList() {
  globalStore.router.push('/myCompanionPostList');
}

</script>

<template>
  <div class="main">

    <div class="companion-post-save-button-container">
      <svg 
        class="prev-button"
        @click="goToMyCompanionPostList()"
        xmlns="http://www.w3.org/2000/svg" height="24" fill="none" 
        stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
      >
        <line x1="10" y1="12" x2="2222" y2="12" />
        <polyline points="12 5 5 12 12 19" />
      </svg>

      <CommonButton
        class="save-button"
        @click="saveCompanionPost()"
        :label="buttonConfig.save.label"
        :fontColor="buttonConfig.save.fontColor"
        :background-color="buttonConfig.save.backgroundColor"
      />
    </div>

    <div class="companion-post-save-container">
      <div class="companion-post-title">
        <label class="subject" for="companion-post-save-title">모집 제목</label>
        <input 
          type="text" 
          class="title-input"
          id="companion-post-save-title"
          v-model="title"
          placeholder="제목"
        >
      </div>
      <div class="companion-post-content">
        <label class="subject" for="companion-post-save-content">모집 내용</label>
        <textarea 
          class="content-textarea"
          id="companion-post-save-content"
          v-model="content"
          placeholder="모집 인원, 일정과 같은 상세 내용"
          @input="validateContentLimit()"  
        />
        <span class="content-length">
          {{ `${content.length}/500` }}
        </span>

      </div>
      <div class="companion-post-location">
        <label class="subject" for="companion-post-save-location">장소</label>
        <input 
          type="text"
          class="location-input"
          id="companion-post-save-location"
          v-model="location"
          placeholder="동행 장소"
        >
      </div>

      <div class="companion-post-duration-container">
        <span class="subject">기간</span>
        
        <div class="duration-container">
          <div class="start-date-container">
            <label class="subject-mini">시작일</label>
            <input 
              type="date"
              class="start-date-input"
              v-model="startDate"
              :min="today"
            >
          </div>
          <div class="end-date-container">
            <label class="subject-mini">종료일</label>
            <input 
              type="date"
              class="end-date-input"
              v-model="endDate"
              :min="today"
            >
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>

.companion-post-save-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject {
  font-weight: bold;
  font-size: 18px;
}

.subject-mini {
  font-weight: 600;
  font-size: 14px;
}

.subject-wanring {
  display: flex;
  flex-direction: column;
}
  
.companion-post-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-input {
  height: 25px;
  font-size: 16px;
}

.companion-post-content {
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

.companion-post-location {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.location-input {
  height: 25px;
  font-size: 14px;
}

.companion-post-duration-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.duration-container {
  display: flex;
  gap: 20px;
}

.start-date-container,
.end-date-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.start-date-input,
.end-date-input {
  height: 25px;
}

.companion-post-save-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prev-button {
  width: 30px;
  cursor: pointer;
}

.prev-button:hover {
  color: #524FE1;
}

.save-button {
  width: 30%;
}

@media(max-width: 500px) {
  .duration-container {
    flex-direction: column;
  }
}

@media(max-width: 200px) {
  .start-date-container,
  .end-date-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

</style>
