<script setup>

import { useAuthStore } from '../js/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push('/login');
}


</script>

<template>
  <div class="home">
    <h1>This is Home page</h1>
    <button @click="logout()">로그아웃</button>
  </div>
</template>

<style>

</style>
