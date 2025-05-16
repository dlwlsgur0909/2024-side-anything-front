<script setup>

import { useAuthStore } from '../stores/authStore.js';
import globalStore from '../stores/globalStore.js';

const auth = useAuthStore();

function myInfo() {
  globalStore.router.push({
    name: 'Member',
    params: {
      username: auth.member.username
    },
  });
}

// 로그인 시 권한도 저장해서 admin이 아닌 경우 admin 버튼 숨김 처리 필요
function admin() {
  globalStore.router.push('/admin');
}

</script>

<template>
  <div class="home">
    <h1>This is Home page</h1>
    <button @click="myInfo()">내 정보</button>
    <button @click="auth.logout()">로그아웃</button>
    <button @click="admin()">관리자</button>
  </div>
</template>

<style>

</style>
