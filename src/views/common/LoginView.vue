<script setup>

import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';
import Authentication from '../../components/Authentication.vue';
import CommonButton from '../../components/common/CommonButton.vue';

const auth = useAuthStore();

// 아이디, 비밀번호
const username = ref();
const password = ref();

// 인증여부
const isVerified = ref(true);

// 회원가입
function join() {
  globalStore.router.push('/join');
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

  globalStore.spinner.startSpinner();

  auth.login(request,
    (data) => {
      auth.setMember(data);
      globalStore.router.push('/');
      globalStore.spinner.stopSpinner();
    },
    async (error) => {
      if(error.response.data.errorCode === 403) {
        globalStore.alert.openAlert(error.response.data.errorMessage);
        await sendEmail();
      }else {
        globalStore.alert.openAlert(error.response.data.errorMessage);
      }
      globalStore.spinner.stopSpinner();
    }
  )
}

// 로그인 정보 유효성 검사
function validateLogin() {

  if(!username.value?.trim()) {
    globalStore.alert.openAlert('아이디를 입력해주세요');
    return false;
  }

  if(!password.value?.trim()) {
    globalStore.alert.openAlert('비밀번호를 입력해주세요');
    return false;
  }

  return true;
}

// 인증메일 발송
async function sendEmail() {

  const request = {
    username: username.value,
  };

  await axios
    .post("/auth/send", request)
    .then((res) => {
      globalStore.alert.openAlert('인증메일이 발송되었습니다', 'email-icon.png');
      isVerified.value = false;
    })
    .catch(e => {
      globalStore.alert.openAlert(e.response.data.errorMessage);
    })
}

// 소셜 로그인
function naverLogin() {
  window.location.href = '/oauth2/authorization/naver';
}

function googleLogin() {
  window.location.href = '/oauth2/authorization/google';
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
    logo: 'naver-logo.png',
  },
  googleLogin: {
    label: 'Google로 로그인',
    fontColor: 'black',
    backgroundColor: 'white',
    logo: 'google-logo.png',
  },

}


</script>

<template>
  <div class="main">

    <div class="logo-section">
      <img class="main-logo" src="../../assets/logo/side-anything.svg" alt="logo">
    </div>

    <div class="login-container" v-if="isVerified">
      <div class="id-section">
        <input class="id-input-box" type="text" placeholder="아이디" v-model="username" @keyup.enter="login()">
      </div>
      <div class="password-section">
        <input class="password-input-box" type="password" placeholder="비밀번호" v-model="password" @keyup.enter="login()">
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
          @click="globalStore.router.push('/find')"
          :label="buttonConfig.find.label" 
          :fontColor="buttonConfig.find.fontColor" 
          :backgroundColor="buttonConfig.find.backgroundColor" 
        />
        <CommonButton 
          @click="naverLogin()"
          :label="buttonConfig.naverLogin.label" 
          :fontColor="buttonConfig.naverLogin.fontColor" 
          :backgroundColor="buttonConfig.naverLogin.backgroundColor"
          :logo="buttonConfig.naverLogin.logo"
        />
        <CommonButton 
          @click="googleLogin()"
          :label="buttonConfig.googleLogin.label" 
          :fontColor="buttonConfig.googleLogin.fontColor" 
          :backgroundColor="buttonConfig.googleLogin.backgroundColor" 
          :logo="buttonConfig.googleLogin.logo"
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

.main {
  width: 40%;
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
  border-radius: 5px;
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
  border-radius: 5px;
}

.button-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

@media(max-width: 1000px) {
  .main {
    width: 45%;
  }
}

@media(max-width: 900px) {
  .main {
    width: 50%;
  }
}

@media(max-width: 750px) {
  .main {
    width: 60%;
  }
}

@media(max-width: 600px) {
  .main {
    width: 65%;
  }
}

@media(max-width: 500px) {
  .main {
    width: 80%;
  }
}

@media(max-width: 350px) {
  .main {
    width: 100%;
  }
}

</style>
