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

// 내 동행 모집 상세 관련 변수
const title = ref('');
const content = ref('');
const location = ref('');
const writer = ref('');
const startDate = ref('');
const endDate = ref('');
const isClosed = ref(false);
const applicationList = ref([]);

// 버튼 설정
const buttonConfig = {
  close: {
    label: '마감하기',
    fontColor: 'white',
    backgroundColor: 'black',
  },
  delete: {
    label: '삭제하기',
    fontColor: 'white',
    backgroundColor: 'red',
  },
  applicationList: {
    label: '신청현황',
    fontColor: 'white',
    backgroundColor:'#524FE1',
  },
  approve: {
    label: '승인',
    fontColor: 'white',
    backgroundColor: '#524FE1'
  },
  reject: {
    label: '거절',
    fontColor: 'white',
    backgroundColor: 'red'
  }
}

// 동행 모집 상세 API
async function getMyCompanionPostDetail() {

  await customAxios
    .get(`/companions/my-posts/${props.companionPostId}`)
    .then(res => {
      title.value = res.data.title;
      content.value = res.data.content;
      location.value = res.data.location;
      startDate.value = res.data.startDate;
      endDate.value = res.data.endDate;
      isClosed.value = res.data.isClosed;
      applicationList.value = res.data.applicationList;
    })
    .catch(error => {
      globalStore.router.push('/myCompanionPostList');
    })

}

// 최초 데이터 로드
onMounted(async () => {
  getMyCompanionPostDetail();
})

// 동행 모집 마감 API
function closeCompanionPost() {

  globalStore.confirm.openConfirm("동행 모집을 마감하시겠습니까?", () => {
    customAxios
      .patch(`/companions/${props.companionPostId}`)
      .then(res => {
        getMyCompanionPostDetail();
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
        globalStore.router.push('/myCompanionPostList');
      })
      .catch(error => {

      })
  })

}

// 뒤로가기
function goToCompanionPostList() {
  globalStore.router.push('/myCompanionPostList');
}

// 내 동행 모집 신청현황 팝업 관련 변수
const displayApplicationList = ref(false);

// 내 동행 모집 신청현황 클릭
function openApplicationList() {
  if(applicationList.value.length < 1) {
    globalStore.alert.openAlert('신청 내역이 없습니다')
    return;
  }

  displayApplicationList.value = true;
}

// 내 동행 모집 신청현황 닫기
function closeApplicationList() {
  displayApplicationList.value = false;
}

// 동행 신청 승인
function approveCompanionApplication(companionApplicationId) {

  const request = {
    isApproval: true
  };

  customAxios
    .patch(`/companions/${props.companionPostId}/applications/${companionApplicationId}`, request)
    .then(res => {
      getMyCompanionPostDetail();
    })
    .catch(error => {

    })

}

// 동행 신청 거절
function rejectCompanionApplication(companionApplicationId) {
  
  const request = {
    isApproval: false
  };

  customAxios
    .patch(`/companions/${props.companionPostId}/applications/${companionApplicationId}`, request)
    .then(async (res) => {
      await getMyCompanionPostDetail();
      displayApplicationList.value = applicationList.value > 0;
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

      <div class="close-delete-button-container">
        <CommonButton
          class="close-button"
          @click="closeCompanionPost()"
          :label="buttonConfig.close.label"
          :fontColor="buttonConfig.close.fontColor"
          :background-color="buttonConfig.close.backgroundColor"
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
    </div>

    <div class="companion-post-detail-container">
      <div class="companion-post-duration">
        <span class="subject">모집 기간</span>
        {{ startDate }} ~ {{ endDate }}
      </div>

      <div class="companion-post-title">
        <label class="subject" for="companion-post-detail-title">모집 제목</label>
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

      <CommonButton
        class="application-list-button"
        @click="openApplicationList()"
        :label="buttonConfig.applicationList.label"
        :fontColor="buttonConfig.applicationList.fontColor"
        :background-color="buttonConfig.applicationList.backgroundColor"
      />
    </div>

    <div class="screen-block" v-if="displayApplicationList" @click="closeApplicationList()">
    </div>

    <div class="application-list-container" v-if="displayApplicationList">
      <div class="close-application-list-button-container">
        <svg 
          class="close-application-list-button"
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          @click="closeApplicationList()"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="list-item" v-for="application in applicationList" :key="application.id">
        <div class="info-message">
          {{ application.message }}
        </div>

        <div class="item-applicant-status-info">
          <span>{{ application.nickname }}</span>
          <span>{{ application.dob }}</span>
          <span>{{ application.gender }}</span>
          <span class="application-status-label">{{ application.status }}</span>
        </div>

        <div class="approve-reject-button-container">
          <CommonButton
            class="approve-button"
            @click="approveCompanionApplication(application.id)"
            :label="buttonConfig.approve.label"
            :fontColor="buttonConfig.approve.fontColor"
            :background-color="buttonConfig.approve.backgroundColor"
            :disabled="isClosed"
          />
          <CommonButton
            class="reject-button"
            @click="rejectCompanionApplication(application.id)"
            :label="buttonConfig.reject.label"
            :fontColor="buttonConfig.reject.fontColor"
            :background-color="buttonConfig.reject.backgroundColor"
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

.close-delete-button-container {
  display: flex;
  gap: 10px;
  width: 60%;
  min-width: 100px;
}

.close-button,
.delete-button {
  flex: 1;
}

.screen-block {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0000003f;
  user-select: none;
  z-index: 90000;
}

.application-list-container {
  position: fixed;
  top: 100px;
  width: 100%;
  max-width: 600px;
  height: 700px;
  padding: 20px;
  background: #fff;
  overflow-y: scroll;
  z-index: 90000;
}

.close-application-list-button-container {
  display: flex;
  justify-content: flex-end;
}

.close-application-list-button {
  width: 30px;
  cursor: pointer;
}

.close-application-list-button:hover {
  color: red;
}

.list-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
}

.info-message {
  font-size: 14px;
  white-space: pre-line;
}

.item-applicant-status-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
}

.application-status-label {
  padding: 3px 10px;
  color: #fff;
  background: #000;
  border-radius: 15px;
  font-size: 14px;
}

.approve-reject-button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.approve-button,
.reject-button {
  flex: 1;
  height: 30px;
  min-width: 40px;
  cursor: pointer;
}

</style>
