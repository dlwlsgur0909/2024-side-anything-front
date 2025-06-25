<script setup>

import { ref, inject, onMounted } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import Pagination from '../../components/common/Pagination.vue';

const customAxios = inject('customAxios');

// 페이지네이션 관련 변수
const currentPage = ref(1);
const totalPages = ref(0);

// 내 동행 신청 목록
const myApplicationList = ref([]);

// 내 동행 신청 목록 조회 API
function getMyCompanionApplicationList() {

  customAxios
    .get(`/companions/my-applications?page=${currentPage.value}`)
    .then(res => {
      myApplicationList.value = res.data.applicationList;
      totalPages.value = res.data.totalPages;
    })
    .catch(error => {
    })

}

// 최초 내 동행 신청 목록 조회
onMounted(() => {
  getMyCompanionApplicationList();
})

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getMyCompanionApplicationList();
}

// 내 동행 신청 취소
function cancelApplication({applicationId, postTitle}) {

  globalStore.confirm.openConfirm(`${postTitle} 동행 신청을 취소하시겠습니까?`, () => {
    customAxios
      .patch(`/companions/my-applications/${applicationId}`)
      .then(res => {
        getMyCompanionApplicationList();
      })
      .catch(error => {
      })
  })


}

// 내 동행 신청 삭제
function deleteApplication({applicationId, postTitle}) {

  globalStore.confirm.openConfirm(`${postTitle} 동행 신청을 삭제하시겠습니까?`, () => {
    customAxios
      .delete(`/companions/my-applications/${applicationId}`)
      .then(res => {
        getMyCompanionApplicationList();
      })
      .catch(error => {
      })
  })

}

</script>

<template>
  <div class="main">

    <div class="my-companion-application-list-container" v-if="myApplicationList.length > 0">

      <div class="list-item-header">
        <div class="header-post-title-status">제목</div>
        <div class="header-post-location">장소</div>
        <div class="header-application-status">신청 상태</div>
      </div>

      <div class="list-item-container" 
        v-for="(myApplication) in myApplicationList" :key="myApplication.applicationId"
      >

        <div class="item-info">
          <div class="item-post-title-status">
            <div class="title-status">
              {{ myApplication.postTitle }}
              <span class="post-status-label">
                ({{ myApplication.postStatus }})
              </span>
            </div>
          </div>
          <div class="item-post-location">
            {{ myApplication.postLocation }}
          </div>
          <div class="item-application-status">
            <span class="application-status-label">
              {{ myApplication.applicationStatus }}
            </span>
          </div>
        </div>
        
        <div class="cancel-delete-button-container">
          <span 
            v-if="myApplication.isCancelable"
            class="cancel-button" @click="cancelApplication(myApplication)" 
          >
            취소 
          </span>
          <span 
            v-else class="cancel-button-disabled"
          >
            취소 
          </span>
          <span class="delete-button" @click="deleteApplication(myApplication)">
            삭제
          </span>
        </div>
        
      </div>
    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">신청한 동행이 없습니다 😢</span>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

  </div>
</template>

<style scoped>

.my-companion-application-list-container {
  display: flex;
  flex-direction: column;
}

.list-item-header {
  display: flex;
  padding: 10px;
  font-weight: 600;
  user-select: none;
}

.header-post-title-status {
  flex: 6;
  display: flex;
  justify-content: center;
}

.header-post-location {
  flex: 2;
  display: flex;
  justify-content: center;
}

.header-application-status {
  flex: 2;
  display: flex;
  justify-content: flex-end;
}

.list-item-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  user-select: none;
}

.item-info {
  display: flex;
  align-items: center;
}

.item-post-title-status {
  flex: 6;
  display: flex;
  flex-direction: column;
}

.title-status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-status-label {
  font-size: 14px;
  font-weight: 600;
}

.item-post-location {
  flex: 2;
  display: flex;
  justify-content: center;
  word-break: keep-all;
  white-space: normal; 
  text-align: center;     
}

.item-application-status {
  flex: 2;
  display: flex;
  justify-content: flex-end;
}

.application-status-label {
  width: 60px;
  height: 30px;
  padding: 5px 10px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: black;
  border-radius: 15px;
  text-align: center;
}

.cancel-delete-button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
}

.cancel-button:hover,
.delete-button:hover {
  color: red;
  cursor: pointer;
}

.cancel-button-disabled {
  color: gray;
  cursor: not-allowed;
}

.no-content {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.no-content-message {
  font-weight: 500;
}

</style>
