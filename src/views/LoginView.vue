<script setup>


</script>

<template>
  <div class="main-container">
    <div class="login-container">
      <div class="id-section">
        <input class="id-input-box" type="text" placeholder="아이디">
      </div>
      <div class="password-section">
        <input class="password-input-box" type="password" placeholder="비밀번호">
      </div>
      <div class="button-section">
        <button>로그인</button>
        <button>회원가입</button>
        <button>ID/PW 찾기</button>
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

.login-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #e6e5e5;
  border-radius: 10px;
}

.id-section,
.password-section {
  display: flex;
  justify-content: center;
}

.id-input-box,
.password-input-box {
  height: 30px;
}

.button-section {
  display: flex;
  justify-content: center;
  gap: 10px;
}

</style>
