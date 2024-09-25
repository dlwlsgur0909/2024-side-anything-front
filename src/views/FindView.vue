<script setup>

import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertStore } from '../js/alert.js';
import CommonButton from '../components/common/CommonButton.vue';

const router = useRouter();
const alert = useAlertStore();

const mode = ref('ID');

const username = ref('');
const email = ref('');

function changeMode(newMode) {
  mode.value = newMode;
  username.value = '';
  email.value = '';
}

function find() {

  if(mode.value === 'ID') {
    findUsername();
  }else if(mode.value === 'PASSWORD') {
    findPassword();
  }
  
}

function findUsername() {

  if(!email.value?.trim()) {
    alert.openAlert('이메일을 입력해주세요');
    return;
  }

  const request = {
    email: email.value
  };

  axios
    .post("http://localhost:8090/auth/find/username", request)
    .then(res => {
      alert.openAlert(`입력하신 이메일에 해당하는 아이디는 ${res.data}입니다.`, 'info-icon.png');
    })
    .catch(e => {
      alert.openAlert(e.response.data.errorMessage);
    })
}

function findPassword() {
  if(!email.value?.trim()) {
    alert.openAlert('이메일을 입력해주세요');
    return;
  }

  if(!username.value?.trim()) {
    alert.openAlert('아이디를 입력해주세요');
    return;
  }

  const request = {
    email: email.value,
    username: username.value,
  };

  axios
    .post('http://localhost:8090/auth/find/password', request)
    .then(res =>{
      alert.openAlert(`${email.value}로 초기화된 비밀번호를 전송했습니다`, 'email-icon.png');
      router.push('/login');
    })
    .catch(e =>{
      alert.openAlert(e.response.data.errorMessage);
    })
}

// 버튼 설정
const buttonConfig = {
  find: {
    label: '찾기',
    fontColor: '#fff',
    backgroundColor: '#000',
  },
  findId: {
    label: 'ID 찾기',
    fontColor: '#fff',
    backgroundColor: "#524FE1",
  },
  findPassword: {
    label: '비밀번호 찾기',
    fontColor: '#fff',
    backgroundColor: "#524FE1"
  },
  cancel: {
    label: '취소',
    fontColor: '#fff',
    backgroundColor: '#E34444',
  }
}

</script>

<template>
  <div class="main-container">
    
    <div class="logo-section">
      <img class="main-logo" src="../assets/side-anything.svg" alt="logo">
    </div>

    <div class="find-container">
      <div class="email-section">
        <input type="text" class="email-input-box" placeholder="이메일" v-model="email">
      </div>
      <div class="id-section" v-if="mode === 'PASSWORD'">
        <input type="text" class="id-input-box" placeholder="아이디" v-model="username">
      </div>
      <CommonButton
        @click="find()"
        :label="buttonConfig.find.label"
        :fontColor="buttonConfig.find.fontColor"
        :backgroundColor="buttonConfig.find.backgroundColor"
      />
    </div>

    <div class="button-section">
      <CommonButton
        v-if="mode === 'PASSWORD'"
        class="find-id-button"
        @click="changeMode('ID')"
        :label="buttonConfig.findId.label"
        :fontColor="buttonConfig.findId.fontColor"
        :backgroundColor="buttonConfig.findId.backgroundColor"
      />
      <CommonButton
        v-if="mode === 'ID'"
        class="find-password-button"
        @click="changeMode('PASSWORD')"
        :label="buttonConfig.findPassword.label"
        :fontColor="buttonConfig.findPassword.fontColor"
        :backgroundColor="buttonConfig.findPassword.backgroundColor"
      />
      <CommonButton
        class="cancel-button"
        @click="router.push('/login')"
        :label="buttonConfig.cancel.label"
        :fontColor="buttonConfig.cancel.fontColor"
        :backgroundColor="buttonConfig.cancel.backgroundColor"
      />
    </div>
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


.find-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.email-section,
.id-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.email-input-box,
.id-input-box {
  height: 40px;
  border: 0;
  border-radius: 10px;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.find-id-button,
.find-password-button,
.cancel-button {
  flex-basis: 45%;
}


</style>
