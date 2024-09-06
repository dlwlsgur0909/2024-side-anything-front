<script setup>

import { ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import Authentication from '../components/Authentication.vue';

const router = useRouter();
const route = useRoute();

const mode = ref('JOIN');

// 아이디, 비밀번호
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const email = ref('');

const isUsernameUnique = ref(false);
const isEmailUnique = ref(false);

// 회원가입
async function join() {

  if(!await validateJoin()) {
    return;
  }

  const request = {
    username: username.value,
    password: password.value,
    email: email.value
  }

  axios
    .post("http://localhost:8090/auth/join", request)
    .then(res => {
      alert(`${email.value}로 인증번호를 발송했습니다.`)
      mode.value = 'VERIFY';
    })
    .catch((e) => {
      alert(e.response.data.errorMessage);
    }) 

}

// 회원가입 유효성 검사
async function validateJoin() {

  if(!username.value?.trim()) {
    alert("아이디를 입력하세요");
    return false;
  }else {
    await duplicateUsernameCheck();
    if(!isUsernameUnique.value) {
      alert('이미 사용중인 아이디입니다');
      return false;
    }
  }

  if(!password.value?.trim()) {
    alert('비밀번호를 입력하세요');
    return false;
  }

  if(!passwordConfirm.value?.trim()) {
    alert('비밀번호 확인을 입력하세요');
    return false;
  }
  
  if(!email.value?.trim()) {
    alert('이메일을 입력하세요');
    return false;
  }else {
    await duplicateEmailCheck()
    if(!isEmailUnique.value) {
      alert('이미 사용중인 이메일입니다')
      return false;
    }
  }
  
  if(password.value !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다');
    return false;
  }

  return true;

}

// 아이디 중복 검사
async function duplicateUsernameCheck() {

  const request = {
    usernameOrEmail: username.value
  };

  const response = await axios.post('http://localhost:8090/auth/duplicate/username', request)
  isUsernameUnique.value = response.data;
}

// 이메일 중복 검사
async function duplicateEmailCheck() {

  const request = {
    usernameOrEmail: email.value
  };

  const response = await axios.post('http://localhost:8090/auth/duplicate/email', request)
  isEmailUnique.value = response.data;
}


// 취소 -> 로그인 페이지
function cancel() {
  router.push('/login');
}

</script>

<template>
  <div class="main-container">
    <div class="join-container" v-if="mode === 'JOIN'">
      <div class="id-section">
        <input class="id-input-box" type="text" placeholder="아이디" v-model="username">
      </div>
      <div class="password-section">
        <input class="password-input-box" type="password" placeholder="비밀번호" v-model="password">
      </div>
      <div class="password-confirm-section">
        <input class="password-confirm-input-box" type="password" placeholder="비밀번호 확인" v-model="passwordConfirm">
      </div>
      <div class="email-section">
        <input class="email-input-box" type="text" placeholder="이메일" v-model="email">
      </div>
      <div class="button-section">
        <button @click="join()">회원가입</button>
        <button @click="cancel()">취소</button>
      </div>
    </div>

    <Authentication v-if="mode === 'VERIFY'" :username="username" />
  </div>

</template>

<style scoped>

.main-container {
  width: 80%;
  padding: 5%;
  border: 1px solid #333;

}

.join-container,
.verify-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.id-section,
.password-section,
.password-confirm-section,
.email-section {
  display: flex;
  justify-content: center;
}

.authentication-section {
  display: flex;
  justify-content: space-between;
}

.id-input-box,
.password-input-box,
.password-confirm-input-box,
.email-input-box,
.authentication-input-box {
  height: 30px;
  width: 80%;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}

</style>
