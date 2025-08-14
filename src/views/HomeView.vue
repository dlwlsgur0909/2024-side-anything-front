<script setup>

import { ref, inject, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore.js';
import globalStore from '../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';
import CommonStatusLabel from '@/components/common/CommonStatusLabel.vue';

const auth = useAuthStore();
const customAxios = inject('customAxios');


const myCompanionPostList = ref([]);
const myCompanionApplicationList = ref([]);

// 내 동행 신청 목록
function getMyCompanionApplicationList() {
  customAxios
    .get('/companions/my-applications')
    .then(res => {
      myCompanionApplicationList.value = res.data.applicationList
    })
    .catch(error => {})
}

// 내 동행 모집 목록
function getMyCompanionPostList() {
  customAxios
    .get('/companions/my-posts')
    .then(res => {
      myCompanionPostList.value = res.data.postList;
    })
    .catch(error => {})
}

// 초기 데이터 로드
onMounted(() => {
  getMyCompanionApplicationList();
  getMyCompanionPostList();
})

// 내 동행 모집 페이지 이동
function goToMyCompanionPostList() {
  globalStore.router.push('/myCompanionPostList');
}

// 내 동행 신청 페이지 이동
function goToMyCompanionApplicationList() {
  globalStore.router.push('/myCompanionApplicationList');
}

// 로그인 시 권한도 저장해서 admin이 아닌 경우 admin 버튼 숨김 처리 필요
function admin() {
  globalStore.router.push('/admin');
}

// 버튼 설정
const buttonConfig = {
  myInfo: {
    label: '내 정보',
    fontColor: '#fff',
    backgroundColor: '#000'
  },
  logout: {
    label: '로그아웃',
    fontColor: '#fff',
    backgroundColor: 'red'
  }
}

</script>

<template>
  <div class="main">
    <div class="home-greeting-container">
      <h1>안녕하세요 {{ auth.member?.name }}님 😊</h1>
    </div>

    <div class="my-menu">
      <CommonButton
        class="my-info-button"
        @click="auth.logout()"
        :label="buttonConfig.myInfo.label"
        :fontColor="buttonConfig.myInfo.fontColor"
        :backgroundColor="buttonConfig.myInfo.backgroundColor"
      />
      <CommonButton
        class="logout-button"
        @click="auth.logout()"
        :label="buttonConfig.logout.label"
        :fontColor="buttonConfig.logout.fontColor"
        :backgroundColor="buttonConfig.logout.backgroundColor"
      />
    </div>

    <div class="monthly-recommended-place">
      <span class="title-label">이달의 추천 여행지</span>
    </div>

    <div class="my-companion-application">
      <span class="title-label" @click="goToMyCompanionApplicationList()">내 동행 신청</span>
      <div class="my-companion-application-list" v-if="myCompanionApplicationList.length > 0">
        <div class="list-header">
          <span class="post-title-header">동행명</span>
          <span class="post-location-header">장소</span>
          <span class="status-header">상태</span>
        </div>
        <div class="list-content" v-for="(application) in myCompanionApplicationList" :key="application.id">
          <span class="post-title">{{ application.postTitle }}</span>
          <span class="post-location">{{ application.postLocation }}</span>
          <CommonStatusLabel
            class="status"
            :status="application.applicationStatus"
          />
        </div>
      </div>
      <span class="no-content" v-else>아직 신청한 동행이 없습니다😢</span>
    </div>
    
    <div class="my-companion-post">
      <span class="title-label" @click="goToMyCompanionPostList()">내 동행 모집</span>
      <div class="my-companion-post-list" v-if="myCompanionPostList.length > 0">
        <div class="list-header">
          <span class="post-title-header">동행명</span>
          <span class="post-location-header">장소</span>
          <span class="status-header">상태</span>
        </div>
        <div class="list-content" v-for="(post) in myCompanionPostList" :key="post.id">
          <span class="post-title">{{ post.title }}</span>
          <span class="post-location">{{ post.location }}</span>
          <CommonStatusLabel
            class="status"
            :status="post.status"
          />
        </div>
      </div>
      <span class="no-content" v-else>아직 등록한 동행이 없습니다😢</span>
    </div>
  </div>
</template>

<style>

.home-greeting-container {
  display: flex;
  justify-content: center;
}

.my-menu {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.monthly-recommended-place {
  display: flex;
  flex-direction: column;
  border: 1px solid red;
}

.my-companion-application {
  display: flex;
  flex-direction: column;
}

.my-companion-post {
  display: flex;
  flex-direction: column;
}

.title-label {
  align-self: flex-start;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.title-label:hover {
  color: #524FE1;
}

.my-companion-application-list,
.my-companion-post-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.list-header {
  display: flex;
  padding-bottom: 5px;
  border-bottom: 1px solid #000;
}

.post-title-header {
  flex: 7;
  text-align: center;
  font-weight: 600;
}

.post-location-header {
  flex: 2;
  text-align: center;
  font-weight: 600;
}

.status-header {
  flex: 1;
  text-align: center;
  font-weight: 600;
}

.list-content {
  display: flex;
}

.post-title {
  flex: 7;
  text-align: center;
}

.post-location {
  flex: 2;
  text-align: center;
}

.no-content {
  font-weight: 600;
  text-align: center;
}

.my-info-button,
.logout-button {
  flex: 1;
}

@media(max-width: 600px) {
  .my-menu {
    flex-direction: column;
    align-items: center;
  }

  .my-info-button,
  .my-portfolio-button,
  .my-info-button,
  .logout-button {
    width: 30%;
  }
}

</style>
