<script setup>

import { ref } from 'vue';
import axios from 'axios';
import globalStore from '../../stores/globalStore.js';
import Authentication from '../../components/Authentication.vue';
import CommonButton from '../../components/common/CommonButton.vue';

const mode = ref('JOIN');

// 아이디, 비밀번호, 이름, 이메일
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const name = ref('');
const email = ref('');

const isUsernameUnique = ref(false);
const isEmailUnique = ref(false);

// 회원가입
async function join() {

  if(!await validateJoin()) {
    return;
  }

  globalStore.spinner.startSpinner();

  const request = {
    username: username.value,
    password: password.value,
    name: name.value,
    email: email.value
  }

  await axios
    .post("/auth/join", request)
    .then(res => {
      globalStore.alert.openAlert(`${email.value}로 인증번호를 발송했습니다.`, 'email-icon.png');
      mode.value = 'VERIFY';
    })
    .catch((e) => {
      globalStore.alert.openAlert(e.response.data.errorMessage);
    }) 
  
  globalStore.spinner.stopSpinner();
}

// 회원가입 유효성 검사
async function validateJoin() {

  if(!username.value?.trim()) {
    globalStore.alert.openAlert("아이디를 입력하세요");
    return false;
  }else {
    await duplicateUsernameCheck();
    if(!isUsernameUnique.value) {
      globalStore.alert.openAlert('이미 사용중인 아이디입니다');
      return false;
    }
  }

  if(!password.value?.trim()) {
    globalStore.alert.openAlert('비밀번호를 입력하세요');
    return false;
  }

  if(!passwordConfirm.value?.trim()) {
    globalStore.alert.openAlert('비밀번호 확인을 입력하세요');
    return false;
  }

  if(!name.value?.trim()) {
    globalStore.alert.openAlert('이름을 입력하세요');
    return false;
  }
  
  if(!email.value?.trim()) {
    globalStore.alert.openAlert('이메일을 입력하세요');
    return false;
  }else {
    await duplicateEmailCheck()
    if(!isEmailUnique.value) {
      globalStore.alert.openAlert('이미 사용중인 이메일입니다')
      return false;
    }
  }
  
  if(password.value !== passwordConfirm.value) {
    globalStore.alert.openAlert('비밀번호가 일치하지 않습니다');
    return false;
  }

  return true;

}

// 아이디 중복 검사
async function duplicateUsernameCheck() {

  const request = {
    usernameOrEmail: username.value
  };

  const response = await axios.post('/auth/duplicate/username', request)
  isUsernameUnique.value = response.data;
}

// 이메일 중복 검사
async function duplicateEmailCheck() {

  const request = {
    usernameOrEmail: email.value
  };

  const response = await axios.post('/auth/duplicate/email', request)
  isEmailUnique.value = response.data;
}


// 취소 -> 로그인 페이지
function cancel() {
  globalStore.router.push('/login');
}

// 버튼 설정
const buttonConfig = {

  join: {
    label: '회원가입',
    fontColor: '#fff',
    backgroundColor: "#524FE1",
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

    <div class="join-container" v-if="mode === 'JOIN'">
      <div class="id-section">
        <input class="id-input-box" type="text" placeholder="아이디" v-model="username" @keyup.enter="join()">
      </div>
      <div class="password-section">
        <input class="password-input-box" type="password" placeholder="비밀번호" v-model="password" @keyup.enter="join()">
      </div>
      <div class="password-confirm-section">
        <input class="password-confirm-input-box" type="password" placeholder="비밀번호 확인" v-model="passwordConfirm" @keyup.enter="join()">
      </div>
      <div class="name-section">
        <input class="name-input-box" type="text" placeholder="이름" v-model="name" @keyup.enter="join()">
      </div>
      <div class="email-section">
        <input class="email-input-box" type="text" placeholder="이메일" v-model="email" @keyup.enter="join()">
      </div>
      <div class="button-section">
        <CommonButton
          class="join-button"
          @click="join()" 
          :label="buttonConfig.join.label" 
          :fontColor="buttonConfig.join.fontColor"
          :backgroundColor="buttonConfig.join.backgroundColor"
        />
        <CommonButton
          class="cancel-button"
          @click="cancel()"
          :label="buttonConfig.cancel.label"
          :fontColor="buttonConfig.cancel.fontColor"
          :backgroundColor="buttonConfig.cancel.backgroundColor"
        />
      </div>
    </div>

    <Authentication v-if="mode === 'VERIFY'" :username="username" />
  </div>

</template>

<style scoped>

.main {
  width: 40%;
}

.main-logo {
  width: 100%;
}

.join-container,
.verify-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.id-section,
.password-section,
.password-confirm-section,
.name-section,
.email-section {
  display: flex;
  flex-direction: column;
}

.authentication-section {
  display: flex;
  justify-content: space-between;
}

.id-input-box,
.password-input-box,
.password-confirm-input-box,
.name-input-box,
.email-input-box,
.authentication-input-box {
  height: 40px;
  border: 0;
  border-radius: 10px;
}

.button-section {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.join-button, 
.cancel-button {
  flex: 1;
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
