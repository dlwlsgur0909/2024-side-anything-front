<script setup>

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../js/auth.js';
import { inject } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const router = useRouter();
const customAxios = inject('customAxios');

// 아이디, 이메일
const username = ref('');
const email = ref('');
const createdAt = ref('');

const isUsernameUnique = ref(false);
const isEmailUnique = ref(false);


// 회원 정보 조회
function memberDetail() {

  customAxios
  .get(`http://localhost:8080/members/${props.username}`)
  .then(res => {
    username.value = res.data.username;
    email.value = res.data.email;
    createdAt.value = res.data.createdAt;
  })
  .catch(e => {
    alert(e.response.data.errorMessage);
    router.push('/');
  })
  

  
}

memberDetail();

// 아이디 중복 검사
async function duplicateUsernameCheck() {

  const request = {
    usernameOrEmail: username.value
  };

  const response = await axios.post('http://localhost:8080/auth/duplicate/username', request)
  isUsernameUnique.value = response.data;
}

// 이메일 중복 검사
async function duplicateEmailCheck() {

  const request = {
    usernameOrEmail: email.value
  };

  const response = await axios.post('http://localhost:8080/auth/duplicate/email', request)
  isEmailUnique.value = response.data;
}


// 취소 -> 로그인 페이지
function cancel() {
  router.push('/');
}

</script>

<template>
  <div class="main-container">
    <div class="my-info-container">
      <div class="my-info-header">
        {{ props.username }}님의 정보
      </div>
      <div class="id-section">
        <span class="id-label">아이디</span>
        <input class="id-input-box" type="text" placeholder="아이디" v-model="username">
      </div>
      <div class="email-section">
        <span class="email-label">이메일</span>
        <input class="email-input-box" type="text" placeholder="이메일" v-model="email">
      </div>
      <div class="button-section">
        <button @click="join()">비밀번호 변경</button>
        <button @click="cancel()">취소</button>
      </div>
    </div>
  </div>

</template>

<style scoped>

.main-container {
  width: 80%;
  padding: 5%;
  border: 1px solid #333;
}

.my-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.my-info-header {
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
}

.id-section,
.email-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  gap: 5px;
}

.id-label,
.email-label {
  font-size: 14px;
  font-weight: 700;
}

.id-input-box,
.email-input-box {
  height: 30px;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}

</style>
