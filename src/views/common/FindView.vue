<script setup>

import axios from 'axios';
import { ref } from 'vue';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';

// 아이디 찾기 mode = ID
// 비밀번호 찾기 mode = PASSWORD
const mode = ref('ID');

const username = ref('');
const email = ref('');

// mode 변경
function changeMode(newMode) {
  mode.value = newMode;
  username.value = '';
  email.value = '';
}

// 아이디/비밀번호 찾기
function find() {

  if(mode.value === 'ID') {
    findUsername();
  }else if(mode.value === 'PASSWORD') {
    findPassword();
  }
  
}

// 아이디 찾기
function findUsername() {

  if(!email.value?.trim()) {
    globalStore.alert.openAlert('이메일을 입력해주세요');
    return;
  }

  const request = {
    email: email.value
  };

  axios
    .post("/auth/find/username", request)
    .then(res => {
      globalStore.alert.openAlert(`입력하신 이메일에 해당하는 아이디는 ${res.data}입니다`, 'info-icon.png');
    })
    .catch(e => {
      globalStore.alert.openAlert(e.response.data.errorMessage);
    })
}

// 비밀번호 찾기
async function findPassword() {
  if(!email.value?.trim()) {
    globalStore.alert.openAlert('이메일을 입력해주세요');
    return;
  }

  if(!username.value?.trim()) {
    globalStore.alert.openAlert('아이디를 입력해주세요');
    return;
  }

  globalStore.spinner.startSpinner();

  const request = {
    email: email.value,
    username: username.value,
  };

  await axios
    .post('/auth/find/password', request)
    .then(res =>{
      globalStore.alert.openAlert(`${email.value}로 임시 비밀번호를 전송했습니다`, 'email-icon.png');
      globalStore.router.push('/login');
    })
    .catch(e =>{
      globalStore.alert.openAlert(e.response.data.errorMessage);
    })

  globalStore.spinner.stopSpinner();
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
  <div class="main">
    
    <div class="logo-section">
      <img class="main-logo" src="../../assets/logo/side-anything.svg" alt="logo">
    </div>

    <div class="find-container">
      <div class="email-section">
        <input type="text" class="email-input-box" placeholder="이메일" v-model="email" @keyup.enter="find()">
      </div>
      <div class="id-section" v-if="mode === 'PASSWORD'">
        <input type="text" class="id-input-box" placeholder="아이디" v-model="username" @keyup.enter="find()">
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
        @click="globalStore.router.push('/login')"
        :label="buttonConfig.cancel.label"
        :fontColor="buttonConfig.cancel.fontColor"
        :backgroundColor="buttonConfig.cancel.backgroundColor"
      />
    </div>
  </div>
</template>

<style scoped>

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
