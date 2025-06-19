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
    label: '수정하기',
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

      if(res.data.isApplied) {
        buttonConfig.application.label = '신청완료'
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

// 동행 모집 수정 페이지 이동 
function goToCompanionPostUpdate() {
  alert('수정 로직 확정 후 구현 예정');
  // globalStore.router.push({
    //   name: 'CompanionPostUpdate',
    //   params: {
      //     companionPostId: props.companionPostId
      //   }
      // });
    }
    
// 동행 모집 삭제
function deleteCompanionPost() {
  alert('삭제 로직 확정 후 구현 예정');
  // globalStore.confirm.openConfirm(`삭제하시겠습니까?`, () => {
  //   customAxios
  //     .delete(`/portfolios/${portfolioId.value}`)
  //     .then(res => {
  //       globalStore.router.push('/portfolioList');
  //     })
  //     .catch((error) => {
        
  //     })
  // });

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
      alert('신청 내역 페이지로 이동?');
    })
    .catch(error => {
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
          @click="goToCompanionPostUpdate()"
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
          :disabled="isClosed"
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
      <div class="application-form-container">
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
    </div>

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
  display: flex;
  justify-content: center;
  align-items: center;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 15px;
  width: 300px;
  max-width: 300px;
  background: white;
  border-radius: 10px;
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

@media(max-width: 500px) {

  .companion-post-writer-duration {
    flex-direction: column;
    gap: 20px;
  }

}

</style>
