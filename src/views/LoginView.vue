<script setup>

import { ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import Authentication from '../components/Authentication.vue';
import { useAuthStore } from '../js/auth.js';


const router = useRouter();
const route = useRoute();
const auth = useAuthStore();


// 아이디, 비밀번호
const username = ref();
const password = ref();

// 인증여부
const isVerified = ref(true);

// 회원가입
function join() {
  router.push('/join');
}

// 로그인
function login() {

  if(!validateLogin()) {
    return;
  }

  const request = {
    username: username.value,
    password: password.value
  }

  auth.login(request,
    (data) => {
      auth.setMember(data);
      router.push('/');
    },
    async (error) => {
      alert(error.response.data.errorMessage);
      if(error.response.data.errorCode === '403') {
        await sendEmail();
        isVerified.value = false;
      }
    }
  )
}

// 로그인 정보 유효성 검사
function validateLogin() {

  if(!username.value?.trim()) {
    alert('아이디를 입력해주세요');
    return false;
  }

  if(!password.value?.trim()) {
    alert('비밀번호를 입력해주세요');
    return false;
  }

  return true;
}

// 인증메일 발송
async function sendEmail() {

  const request = {
    usernameOrEmail: username.value,
  };

  await axios
    .post("http://localhost:8080/auth/send", request)
    .then((res) => {
      alert('인증메일이 발송되었습니다');
    })
    .catch(e => {
      alert(e.response.data.errorMessage);
      isVerified.value = true;
    })
}


</script>

<template>
  <div class="main-container">
    <div class="login-container" v-if="isVerified">
      <div class="id-section">
        <input class="id-input-box" type="text" placeholder="아이디" v-model="username">
      </div>
      <div class="password-section">
        <input class="password-input-box" type="password" placeholder="비밀번호" v-model="password">
      </div>
      <div class="button-section">
        <button @click="login()">로그인</button>
        <button @click="join()">회원가입</button>
        <button>ID/PW 찾기</button>
      </div>
    </div>
    <Authentication 
      v-if="!isVerified"
      :username="username"
      :password="password"
    />
  </div>

</template>

<style scoped>

.main-container {
  width: 80%;
  padding: 5%;
  border: 1px solid #333;

}

.login-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.id-section,
.password-section {
  display: flex;
  justify-content: center;
}

.id-input-box,
.password-input-box {
  height: 30px;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}

</style>
