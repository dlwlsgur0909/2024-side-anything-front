<script setup>

import { ref } from 'vue';
import globalStore from '../../stores/globalStore.js';
import CommonButton from '../../components/common/CommonButton.vue';
import { useAuthStore } from '@/stores/authStore.js';

const auth = useAuthStore();

// 생년월일, 성별, 닉네임
const dob = ref('');
const gender = ref('');
const nickname = ref('');

const today = new Date().toISOString().split('T')[0];

// 소셜 회원가입
async function socialJoin() {

  if(!validateSocialJoin()) {
    return;
  }

  globalStore.spinner.startSpinner();
  
  const request = {
    id: auth.member.id,
    dob: dob.value,
    gender: gender.value,
    nickname: nickname.value,
  }
  
  await auth.socialJoin(request);

  globalStore.spinner.stopSpinner();
}

// 소셜 회원가입 유효성 검사
function validateSocialJoin() {

  if(!dob.value?.trim()) {
    globalStore.alert.openAlert('생년월일을 선택해주세요');
    return false;
  }

  if(!gender.value?.trim()) {
    globalStore.alert.openAlert('성별을 선택해주세요');
    return false
  }
  
  if(!nickname.value?.trim()) {
    globalStore.alert.openAlert('닉네임을 입력해주세요');
    return false;
  }

  return true;
}

// 취소 -> 로그인 페이지
function cancel() {
  auth.logout();
  globalStore.router.push('/login');
}

// 버튼 설정
const buttonConfig = {

  join: {
    label: '가입완료',
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

    <div class="join-container">
      <label class="subject" for="dob">생년월일</label>
      <div class="dob-gender-section">
        <div class="dob-section">
          <input class="dob-input-box" id="dob" type="date" v-model="dob" :max="today">
        </div>
        <div class="gender-section">
          <label class="subject">
            남성
            <input type="radio" id="public"
              :value="'MALE'" v-model="gender"
            >
          </label>
          <label class="subject">
            여성
            <input type="radio" id="private" 
              :value="'FEMALE'" v-model="gender"
            >
          </label>
        </div>
      </div>
      <div class="nickname-section">
        <input class="nickname-input-box" type="text" placeholder="닉네임" v-model="nickname" @keyup.enter="join()">
      </div>
      <div class="button-section">
        <CommonButton
          class="join-button"
          @click="socialJoin()" 
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
.email-section,
.nickname-section {
  display: flex;
  flex-direction: column;
}

.dob-gender-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.dob-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.gender-section {
  display: flex;
  gap: 10px;
}

.authentication-section {
  display: flex;
  justify-content: space-between;
}

.id-input-box,
.password-input-box,
.password-confirm-input-box,
.name-input-box,
.dob-input-box,
.nickname-input-box,
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


.subject {
  font-size: 14px;
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
