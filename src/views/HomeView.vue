<script setup>

import { useAuthStore } from '../stores/authStore.js';
import globalStore from '../stores/globalStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const auth = useAuthStore();

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
  myCompanionPost: {
    label: '내 동행 모집',
    fontColor: '#fff',
    backgroundColor: '#000'
  },
  myCompanionApplication: {
    label: '내 동행 신청',
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
        class="my-companion-post-button"
        @click="goToMyCompanionPostList()"
        :label="buttonConfig.myCompanionPost.label"
        :fontColor="buttonConfig.myCompanionPost.fontColor"
        :backgroundColor="buttonConfig.myCompanionPost.backgroundColor"
      />
      <CommonButton
        class="my-companion-application-button"
        @click="goToMyCompanionApplicationList()"
        :label="buttonConfig.myCompanionApplication.label"
        :fontColor="buttonConfig.myCompanionApplication.fontColor"
        :backgroundColor="buttonConfig.myCompanionApplication.backgroundColor"
      />
      <CommonButton
        class="logout-button"
        @click="auth.logout()"
        :label="buttonConfig.logout.label"
        :fontColor="buttonConfig.logout.fontColor"
        :backgroundColor="buttonConfig.logout.backgroundColor"
      />
    </div>
    <div>
      포트폴리오 목록 (등록일/조회수/좋아요 기준 top 5) 
    </div>
    <button @click="admin()">관리자</button>
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

.my-companion-post-button,
.my-companion-application-button,
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
  .logout-button {
    width: 30%;
  }
}

</style>
