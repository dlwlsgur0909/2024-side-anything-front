<script setup>

import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    alert('이메일을 입력해주세요');
    return;
  }

  const request = {
    email: email.value
  };

  axios
    .post("http://localhost:8080/auth/find/username", request)
    .then(res => {
      alert(`입력하신 이메일에 해당하는 아이디는 ${res.data}입니다.`);
    })
    .catch(e => {
      alert(e.response.data.errorMessage);
    })
}

function findPassword() {
  if(!email.value?.trim()) {
    alert('이메일을 입력해주세요');
    return;
  }

  if(!username.value?.trim()) {
    alert('아이디를 입력해주세요');
    return;
  }

  const request = {
    email: email.value,
    username: username.value,
  };

  axios
    .post('http://localhost:8080/auth/find/password', request)
    .then(res =>{
      alert(`${email.value}로 초기화된 비밀번호를 전송했습니다`);
    })
    .catch(e =>{
      alert(e.response.data.errorMessage);
    })

}

</script>

<template>
  <div class="main-container">
    <div class="find-container">
      <div class="email-section">
        <input type="text" class="email-input-box" placeholder="이메일" v-model="email">
      </div>
      <div class="id-section" v-if="mode === 'PASSWORD'">
        <input type="text" class="id-input-box" placeholder="아이디" v-model="username">
      </div>
      <button @click="find()">찾기</button>
    </div>

    <div class="button-section">
      <button @click="changeMode('ID')">ID 찾기</button>
      <button @click="changeMode('PASSWORD')">비밀번호 찾기</button>
      <button @click="router.push('/login')">취소</button>
    </div>
  </div>
</template>

<style scoped>

.main-container {
  width: 80%;
  padding: 5%;
  border: 1px solid #333;

}

.find-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.email-section,
.id-section {
  display: flex;
  justify-content: center;
}

.email-input-box,
.id-input-box {
  width: 100%;
  height: 30px;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}


</style>
