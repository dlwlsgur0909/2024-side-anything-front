<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../js/auth.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  }
})

const duration = ref(3);
const timer = ref('');
const isTimeOut = ref(false);

const authentication = ref('');
const isVerified = ref(false);

// 인증시간 타이머
function startTimer() {

  let time = duration.value * 60;

  const intervalTimer = setInterval(() => {

    time--;

    const minute = Math.floor(time / 60);
    const second = ('0' + time % 60).slice(-2);
    
    timer.value = `${minute}분 ${second}초`;


    if(isVerified.value === true) {
      timer.value = '';
      isTimeOut.value = false;
      authentication.value = '';
      clearInterval(intervalTimer);
    }

    if(time === 0) {
      alert('인증시간이 만료되었습니다. 다시 시도해주세요');
      isTimeOut.value = true;
      clearInterval(intervalTimer);
    }

  }, 1000);
}

startTimer();

// 인증메일 재발송
function resendEmail() {

const request = {
  usernameOrEmail: props.username,
}

axios
  .post("http://localhost:8080/auth/send", request)
  .then(res => {
    alert('메일이 재발송 되었습니다');
    isTimeOut.value = false;
    startTimer();
  })
  .catch(e => {
    alert(e.response.data.errorMessage);
  })

}

// 인증
function verify() {

const request = {
  username: props.username,
  authentication: authentication.value
}

axios
  .post("http://localhost:8080/auth/verify", request)
  .then(res => {
    alert('인증되었습니다');
    isVerified.value = true;

    if(!!props.password?.trim()) {

      const request = {
        username: props.username,
        password: props.password,
      };

      auth.login(request,
        (data) => {
          auth.setMember(data);
          router.push('/');
        },
        (error) => {
          alert(error.response.data.errorMessage);
          router.go(0);
        }
      );
    }else {
      router.push('/login');
    }

  })
  .catch((e) => {
    alert(e.response.data.errorMessage);
  })
}


</script>

<template>
  <div class="verify-container">
    <div class="authentication-section">
      <input class="authentication-input-box" type="text" placeholder="인증번호" v-model="authentication">
      {{ timer }}
    </div>
    <div class="button-section">
      <button @click="verify()" v-if="isTimeOut === false">인증</button>
      <button @click="resendEmail()" v-if="isTimeOut === true">재전송</button>
    </div>
  </div>

</template>

<style scoped>

.main-container {
  width: 80%;
  padding: 5%;
  border: 1px solid #333;
}

.verify-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.authentication-section {
  display: flex;
  justify-content: space-between;
}

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
