<script setup>

import { ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../js/auth.js';
import { useAlertStore } from '../js/alert.js';
import Authentication from '../components/Authentication.vue';
import CommonButton from '../components/common/CommonButton.vue';


const router = useRouter();
const auth = useAuthStore();
const alert = useAlertStore();

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
      alert.openAlert(error.response.data.errorMessage);
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
    alert.openAlert('아이디를 입력해주세요');
    return false;
  }

  if(!password.value?.trim()) {
    alert.openAlert('비밀번호를 입력해주세요');
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
    .post("http://localhost:8090/auth/send", request)
    .then((res) => {
      alert.openAlert('인증메일이 발송되었습니다', 'email-icon.png');
    })
    .catch(e => {
      alert.openAlert(e.response.data.errorMessage);
      isVerified.value = true;
    })
}

// 소셜 로그인

function naverLogin() {
  window.location.href = 'http://localhost:8090/oauth2/authorization/naver';
}

function googleLogin() {
  window.location.href = 'http://localhost:8090/oauth2/authorization/google';
}

// 버튼 설정
const buttonConfig = {

  login: {
    label: '로그인',
    fontColor: 'black',
    backgroundColor: 'white',
  },
  join: {
    label: '회원가입',
    fontColor: 'black',
    backgroundColor: 'white',
  },
  find: {
    label: 'ID/PW 찾기',
    fontColor: 'black',
    backgroundColor: 'white',
  },
  naverLogin: {
    label: 'Naver로 로그인',
    fontColor: 'black',
    backgroundColor: '#fff',
    icon: 'naver-logo.png',
  },
  googleLogin: {
    label: 'Google로 로그인',
    fontColor: 'black',
    backgroundColor: 'white',
    icon: 'google-logo.png',
  },

}


</script>

<template>
  <div class="main-container">

    <div class="logo-section">
      <img class="main-logo" src="../assets/side-anything.svg" alt="logo">
    </div>

    <div class="login-container" v-if="isVerified">
      <div class="id-section">
        <input class="id-input-box" type="text" placeholder="아이디" v-model="username">
      </div>
      <div class="password-section">
        <input class="password-input-box" type="password" placeholder="비밀번호" v-model="password">
      </div>
      <div class="button-section">
        <CommonButton 
          @click="login()"
          :label="buttonConfig.login.label" 
          :fontColor="buttonConfig.login.fontColor" 
          :backgroundColor="buttonConfig.login.backgroundColor" 
        />
        <CommonButton 
          @click="join()"
          :label="buttonConfig.join.label" 
          :fontColor="buttonConfig.join.fontColor" 
          :backgroundColor="buttonConfig.join.backgroundColor" 
        />
        <CommonButton 
          @click="router.push('/find')"
          :label="buttonConfig.find.label" 
          :fontColor="buttonConfig.find.fontColor" 
          :backgroundColor="buttonConfig.find.backgroundColor" 
        />
        <CommonButton 
          @click="naverLogin()"
          :label="buttonConfig.naverLogin.label" 
          :fontColor="buttonConfig.naverLogin.fontColor" 
          :backgroundColor="buttonConfig.naverLogin.backgroundColor"
          :icon="buttonConfig.naverLogin.icon"
        />
        <CommonButton 
          @click="googleLogin()"
          :label="buttonConfig.googleLogin.label" 
          :fontColor="buttonConfig.googleLogin.fontColor" 
          :backgroundColor="buttonConfig.googleLogin.backgroundColor" 
          :icon="buttonConfig.googleLogin.icon"
        />
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 50px;
  width: 80%;
  height: 98vh;
}

.logo-section {
  padding-top: 110px;
}

.main-logo {
  width: 100%;
}

.login-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.id-section,
.password-section {
  display: flex;
  flex-direction: column;
}

.id-input-box,
.password-input-box {
  height: 40px;
  border: 0;
  border-radius: 10px;
}

.button-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

</style>
