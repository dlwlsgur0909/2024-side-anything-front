<script setup>

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { inject } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const router = useRouter();
const customAxios = inject('customAxios');

const mode = ref('DETAIL');

function changeMode(newMode) {
  
  originalPassword.value = '';
  newPassword.value = '';
  newPasswordConfirm.value = '';

  mode.value = newMode;
}

// 아이디, 이메일, 가입일
const username = ref('');
const email = ref('');
const createdAt = ref('');

// 기존 비밀번호, 새 비밀번호, 새 비밀번호 확인
const originalPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');

// 회원 정보 조회
function memberDetail() {

  customAxios
  .get(`http://localhost:8090/members/${props.username}`)
  .then(res => {
    username.value = res.data.username;
    email.value = res.data.email;
    createdAt.value = res.data.createdAt;
  })
  .catch(e => {
    console.log('member detail');
    router.push('/');
  })
  
}

memberDetail();

// 취소 -> 로그인 페이지
function cancel() {

  if(mode.value === 'PASSWORD') {
    changeMode('DETAIL');
  }else {
    router.push('/');
  }

}

function changePassword() {

  if(mode.value === 'DETAIL') {
    changeMode('PASSWORD');
    return;
  }

  if(!validateChangePassword()) {
    return;
  }

  const request = {
    originalPassword: originalPassword.value,
    newPassword: newPassword.value
  };

  customAxios
  .patch('http://localhost:8090/members/password', request)
  .then(res => {
    alert('비밀번호가 변경되었습니다');
    changeMode('DETAIL');
  })

}

function validateChangePassword() {

  if(!originalPassword.value.trim()) {
    alert('기존 비밀번호를 입력해주세요');
    return false;
  }else if(!newPassword.value.trim()) {
    alert('새 비밀번호를 입력해주세요');
    return false;
  }else if(!newPasswordConfirm.value.trim()) {
    alert('새 비밀번호 확인을 입력해주세요');
    return false;
  }else if(newPassword.value !== newPasswordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다');
    return false;
  }

  return true;
}

</script>

<template>
  <div class="main-container">
    <div class="my-info-container" v-if="mode === 'DETAIL'">
      <div class="my-info-header">
        {{ props.username }}님의 정보
      </div>
      <div class="id-section">
        <span class="id-label">아이디</span>
        <input class="id-input-box" type="text" v-model="username" disabled>
      </div>
      <div class="email-section">
        <span class="email-label">이메일</span>
        <input class="email-input-box" type="text" v-model="email" disabled>
      </div>
      <div class="created-at-section">
        <span class="created-at-label">가입일</span>
        <input class="created-at-input-box" type="text" v-model="createdAt" disabled>
      </div>
    </div>
    <div class="change-password-container" v-if="mode === 'PASSWORD'">
      <div class="change-password-header">
        비밀번호 변경
      </div>
      <div class="original-password-section">
        <span class="original-password-label">기존 비밀번호</span>
        <input class="original-password-input-box" type="password" v-model="originalPassword">
      </div>
      <div class="new-password-section">
        <span class="new-password-label">새 비밀번호</span>
        <input class="new-password-input-box" type="password" v-model="newPassword">
      </div>
      <div class="new-password-confirm-section">
        <span class="new-password-confirm-label">새 비밀번호 확인</span>
        <input class="new-password-confirm-input-box" type="password" v-model="newPasswordConfirm">
      </div>
    </div>

    <div class="button-section">
        <button @click="changePassword()">비밀번호 변경</button>
        <button @click="cancel()">취소</button>
    </div>

  </div>

</template>

<style scoped>

.main-container {
  width: 80%;
  padding: 5%;
  border: 1px solid #333;
}

.my-info-container,
.change-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.my-info-header,
.change-password-header {
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
}

.id-section,
.email-section,
.created-at-section,
.original-password-section,
.new-password-section,
.new-password-confirm-section {
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 5px;
}

.id-label,
.email-label,
.created-at-label,
.original-password-label,
.new-password-label,
.new-password-confirm-label {
  font-size: 14px;
  font-weight: 700;
}

.id-input-box,
.email-input-box,
.created-at-input-box,
.original-password-input-box,
.new-password-input-box,
.new-password-confirm-input-box {
  height: 30px;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-bottom: 20px;
  background: #e6e5e5;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

</style>
