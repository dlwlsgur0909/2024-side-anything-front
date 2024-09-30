<script setup>

import { useAuthStore } from '../js/auth.js';
import globalStore from '../stores/globalStore.js';

const auth = useAuthStore();

function myInfo() {
  globalStore.router.push({
    name: 'member',
    params: {
      username: auth.member.username
    },
  });
}

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
