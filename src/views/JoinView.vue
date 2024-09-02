<script setup>

import { ref } from 'vue';
import axios from 'axios';


// 아이디, 비밀번호
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const email = ref('');
const isUnique = ref(false);

const passedUsername = ref('');

function duplicateCheck() {

  if(!username.value?.trim()) {
    alert("아이디를 입력하세요");
    return;
  }

  const request = {
    username: username.value
  };

  axios
    .post('http://localhost:8080/auth/duplicate', request)
    .then(res => {
      if(res.data === true) {
        alert('사용 가능한 아이디 입니다');
        isUnique.value = true;
        passedUsername.value = username.value;
      }else {
        alert("이미 사용중인 아이디 입니다");
        isUnique.value = false;
        passedUsername.value = '';
      }
    })
}


// 회원가입

function join() {

  if(!validateJoin()) {
    return;
  }


  const request = {
    username: username.value,
    password: password.value,
    email: email.value
  }

  axios
    .post("http://localhost:8080/auth/join", request)
    .then(res => {
      console.log(res);
    })
}

// 회원가입 유효성 검사
function validateJoin() {

  if(!username.value?.trim()) {
    alert('아이디를 입력하세요');
    isUnique.value = false;
    passedUsername.value = '';
    return false;
  }else if(!password.value?.trim()) {
    alert('비밀번호를 입력하세요');
    return false;
  }else if(!passwordConfirm.value?.trim()) {
    alert('비밀번호 확인을 입력하세요');
    return false;
  }else if(!email.value?.trim()) {
    alert('이메일을 입력하세요');
    return false;
  }else if(!isUnique.value || username.value !== passedUsername.value) {
    alert('중복확인을 해주세요');
    isUnique.value = false;
    passedUsername.value = '';
    return false;
  }else if(password.value !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다');
    return false;
  }

  return true;

}



</script>

<template>
  <div class="main-container">
    <div class="join-container">
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
        <button @click="duplicateCheck()">중복확인</button>
        <button @click="join()">회원가입</button>
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

.join-container {
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

.id-input-box,
.password-input-box,
.password-confirm-input-box,
.email-input-box {
  height: 30px;
  width: 80%;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}

</style>
