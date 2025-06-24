<script setup>

import { ref, inject, onMounted, onUnmounted } from 'vue'; 
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';

const props = defineProps({
  companionPostId: {
    type: String,
    required: true
  }
})

const auth = useAuthStore();
const customAxios = inject('customAxios');

// 동행 모집 상세 관련 변수
const title = ref('');
const content = ref('');
const location = ref('');
const writer = ref('');
const startDate = ref('');
const endDate = ref('');
const isClosed = ref(false);
const isApplied = ref(false);

const memberId = ref('');

// 동행 신청 관련 변수
const displayApplication = ref(false);
const message = ref('');

// 버튼 설정
const buttonConfig = {
  update: {
    label: '마감하기',
    fontColor: 'white',
    backgroundColor: 'black',
  },
  delete: {
    label: '삭제하기',
    fontColor: 'white',
    backgroundColor: 'red',
  },
  application: {
    label: '신청하기',
    fontColor: 'white',
    backgroundColor:'#524FE1',
  },
  apply: {
    label: '신청',
    fontColor: 'white',
    backgroundColor: 'black'
  },
  cancel: {
    label: '취소',
    fontColor: 'white',
    backgroundColor: 'red'
  }
}

// 동행 모집 상세 API
function getCompanionPostDetail() {

  customAxios
    .get(`/companions/${props.companionPostId}`)
    .then(res => {
      title.value = res.data.title;
      content.value = res.data.content;
      location.value = res.data.location;
      writer.value = res.data.writer;
      startDate.value = res.data.startDate;
      endDate.value = res.data.endDate;
      isClosed.value = res.data.isClosed;
      memberId.value = res.data.memberId;
      isApplied.value = res.data.isApplied;

      if(res.data.isClosed) {
        buttonConfig.application.label = '모집마감';
        buttonConfig.application.backgroundColor = 'black';
      }else if(res.data.isApplied) {
        buttonConfig.application.label = '신청완료';
      }

    })
    .catch(error => {
      globalStore.router.push('/companionPostList');
    })

}

// 최초 데이터 로드
onMounted(async () => {
  getCompanionPostDetail();
})

// 동행 모집 마감 API
function closeCompanionPost() {

  globalStore.confirm.openConfirm("동행 모집을 마감하시겠습니까?", () => {
    customAxios
      .patch(`/companions/${props.companionPostId}`)
      .then(res => {
        getCompanionPostDetail();
      })
      .catch(error => {

      })
  })

}
    
// 동행 모집 삭제
function deleteCompanionPost() {

  globalStore.confirm.openConfirm('동행 모집을 삭제하시겠습니까?', () => {
    customAxios
      .delete(`/companions/${props.companionPostId}`)
      .then(res => {
        globalStore.router.push('/companionPostList');
      })
      .catch(error => {

      })
  })

}

// 뒤로가기
function goToCompanionPostList() {
  globalStore.router.push('/companionPostList');
}

// 신청하기 버튼 클릭
function openApplication() {
  displayApplication.value = true;
}

// 취소 버튼 클릭
function closeApplication() {
  displayApplication.value = false;
}

// 동행 신청 API
function saveCompanionApplication() {

  if(!message.value?.trim()) {
    globalStore.alert.openAlert('신청 메세지를 작성해주세요');
    return;
  }

  const request = {
    message: message.value
  };

  customAxios
    .post(`/companions/${props.companionPostId}/application`, request)
    .then(res => {
      displayApplication.value = false;
      message.value = '';
      globalStore.router.push('/myCompanionApplicationList');
    })
    .catch(error => {
      globalStore.router.push('/companionPostList');
    })

}

</script>

<template>
  <div class="main">

    <div class="companion-post-detail-button-container">
      <svg 
        class="prev-button"
        @click="goToCompanionPostList()"
        xmlns="http://www.w3.org/2000/svg" height="24" fill="none" 
        stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
      >
        <line x1="10" y1="12" x2="2222" y2="12" />
        <polyline points="12 5 5 12 12 19" />
      </svg>

      <div class="update-delete-button-container" v-if="auth.member?.id === memberId">
        <CommonButton
          class="update-button"
          @click="closeCompanionPost()"
          :label="buttonConfig.update.label"
          :fontColor="buttonConfig.update.fontColor"
          :background-color="buttonConfig.update.backgroundColor"
          :disabled="isClosed"
        />
        <CommonButton
          class="delete-button"
          @click="deleteCompanionPost()"
          :label="buttonConfig.delete.label"
          :fontColor="buttonConfig.delete.fontColor"
          :background-color="buttonConfig.delete.backgroundColor"
        />
      </div>
      <CommonButton v-else
          class="application-button"
          @click="openApplication()"
          :label="buttonConfig.application.label"
          :fontColor="buttonConfig.application.fontColor"
          :background-color="buttonConfig.application.backgroundColor"
          :disabled="isClosed || isApplied"
        />
    </div>

    <div class="companion-post-detail-container">

      <div class="companion-post-writer-duration">
        <div class="companion-post-writer">
          <span class="subject">작성자</span>
          <span>{{ writer }}</span>
        </div>

        <div class="companion-post-duration">
          <span class="subject">모집 기간</span>
          {{ startDate }} ~ {{ endDate }}
        </div>
      </div>


      <div class="companion-post-title">
        <label class="subject" for="companion-post-detail-title">
          모집 제목
        </label>
        <input 
          type="text" 
          class="title-input"
          id="companion-post-detail-title"
          :value="title"
          disabled
        >
      </div>

      <div class="companion-post-content">
        <label class="subject" for="companion-post-detail-content">모집 내용</label>
        <textarea 
          class="content-textarea"
          id="companion-post-detail-content"
          :value="content"
          disabled
        />
      </div>

      <div class="companion-post-location">
        <label class="subject" for="companion-post-detail-location">장소</label>
        <input 
          type="text"
          class="location-input"
          id="companion-post-detail-location"
          :value="location"
          disabled
        >
      </div>
    </div>
    
    <div class="screen-block" v-if="displayApplication">
    </div>
    <transition name="slide-fade">
      <div class="application-form-container" v-if="displayApplication">
        <textarea
          class="application-textarea"
          placeholder="간단한 자기소개나 동행 의사를 적어주세요 (최대 100자)"
          maxlength="100"
          v-model="message"
        />
        <div class="apply-cancel-button-container">
          <CommonButton
            class="apply-button"
            @click="saveCompanionApplication()"
            :label="buttonConfig.apply.label"
            :fontColor="buttonConfig.apply.fontColor"
            :background-color="buttonConfig.apply.backgroundColor"
            :disabled="isClosed"
          />
          <CommonButton
            class="cancel-button"
            @click="closeApplication()"
            :label="buttonConfig.cancel.label"
            :fontColor="buttonConfig.cancel.fontColor"
            :background-color="buttonConfig.cancel.backgroundColor"
            :disabled="isClosed"
          />
        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>

.companion-post-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.subject {
  font-weight: bold;
  font-size: 18px;
}

.companion-post-writer-duration {
  display: flex;
  justify-content: space-between;
}

.companion-post-writer {
  display: flex;
  gap: 10px;
  align-items: center;
}

.companion-post-duration {
  display: flex;
  gap: 10px;
  align-items: center;
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
  font-size: 16px;
}

.companion-post-detail-button-container {
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

.update-delete-button-container {
  display: flex;
  gap: 10px;
  width: 60%;
  min-width: 100px;
}

.update-button,
.delete-button {
  flex: 1;
}

.application-button {
  width: 30%;
}

.screen-block {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0000003f;
  user-select: none;
  z-index: 90000;
}

.application-form-container {
  position: fixed;
  top: calc(50vh - 115px);
  left: calc(50vw - 150px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 15px;
  width: 300px;
  max-width: 300px;
  background: white;
  border-radius: 10px;
  z-index: 90000;
}

.application-textarea {
  resize: none;
  min-height: 150px;
  font-size: 16px;
}

.apply-cancel-button-container {
  display: flex;
  gap: 10px;
}

.apply-button,
.cancel-button {
  flex: 1;
  height: 30px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-50%);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}


@media(max-width: 500px) {

  .companion-post-writer-duration {
    flex-direction: column;
    gap: 20px;
  }

}

</style>
