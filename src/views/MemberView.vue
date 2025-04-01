<script setup>

import { ref } from 'vue';
import { inject } from 'vue';
import { useAuthStore } from '../stores/authStore.js';
import globalStore from '../stores/globalStore.js';
import CommonButton from '../components/common/CommonButton.vue';

// 새로고침 시 Home 화면으로 이동하는데 원인 파악 필요

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const auth = useAuthStore();
const customAxios = inject('customAxios');

// 내 정보 mode = DETAIL
// 비밀번호 변경 mode = PASSWORD
const mode = ref('DETAIL');

function changeMode(newMode) {
  
  originalPassword.value = '';
  newPassword.value = '';
  newPasswordConfirm.value = '';

  mode.value = newMode;
}

// 이메일, 가입일
const name = ref('');
const email = ref('');
const createdAt = ref('');
const isSnsMember = ref(false);

// 기존 비밀번호, 새 비밀번호, 새 비밀번호 확인
const originalPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');

// 회원 정보 조회
function memberDetail() {

  customAxios
    .get(`/members/${props.username}`)
    .then(res => {
      name.value = res.data.name;
      email.value = res.data.email;
      createdAt.value = res.data.createdAt;
      isSnsMember.value = res.data.isSnsMember;
    })
    .catch(e => {
      globalStore.router.push('/');
    })
  
}

memberDetail();

// 취소 -> 로그인 페이지
function cancel() {

  if(mode.value === 'PASSWORD') {
    changeMode('DETAIL');
  }else {
    globalStore.router.push('/');
  }

}

// 비밀번호 변경 
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
  .patch('/members/password', request)
  .then(res => {
    globalStore.alert.openAlert('비밀번호가 변경되었습니다', 'authentication-icon.png');
    changeMode('DETAIL');
  })
  .catch(error => {})

}

// 비밀번호 변경 유효성 검사
function validateChangePassword() {

  if(!originalPassword.value.trim()) {
    globalStore.alert.openAlert('기존 비밀번호를 입력해주세요');
    return false;
  }else if(!newPassword.value.trim()) {
    globalStore.alert.openAlert('새 비밀번호를 입력해주세요');
    return false;
  }else if(!newPasswordConfirm.value.trim()) {
    globalStore.alert.openAlert('새 비밀번호 확인을 입력해주세요');
    return false;
  }else if(newPassword.value !== newPasswordConfirm.value) {
    globalStore.alert.openAlert('비밀번호가 일치하지 않습니다');
    return false;
  }

  return true;
}

const buttonConfig = {

  changePassword: {
    label: '비밀번호 변경',
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
  <div class="main-container">
    <div class="my-info-container" v-if="mode === 'DETAIL'">
      <div class="my-info-header">
        {{ name }}님의 정보
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
      <CommonButton
        class="change-password-button"
        v-if="!isSnsMember"
        @click="changePassword()"
        :label="buttonConfig.changePassword.label"
        :fontColor="buttonConfig.changePassword.fontColor"
        :backgroundColor="buttonConfig.changePassword.backgroundColor"
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

</template>

<style scoped>

.main-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
  padding: 5%;
  background: #e6e5e5;
  border-radius: 10px;
}

.my-info-container,
.change-password-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.my-info-header,
.change-password-header {
  font-size: 18px;
  font-weight: 800;
  text-align: center;
}

.email-section,
.created-at-section,
.original-password-section,
.new-password-section,
.new-password-confirm-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.email-label,
.created-at-label,
.original-password-label,
.new-password-label,
.new-password-confirm-label {
  font-size: 14px;
  font-weight: 700;
}

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
}

.cancel-button,
.change-password-button {
  flex-grow: 0.5;
}



</style>
