<script setup>

const props = defineProps({
  message: {
    type: String,
    required: true,
    default: '확인',
  },

})

const emit = defineEmits(['closeConfirm', 'onClickConfirm']);

function closeConfirm() {
  emit('closeConfirm');
}

function onClickConfirm() {
  emit('onClickConfirm');
}

</script>

<template>
  <div class="screen-block">
    <div class="common-confirm-container">
      <div class="message-section">
        {{ props.message }}
      </div>
      <div class="button-section">
        <button class="confirm-button" @click="onClickConfirm()">확인</button>
        <button class="cancel-button" @click="closeConfirm()">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.screen-block {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0000003f;
  user-select: none;
  z-index: 99999;
}

.common-confirm-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  width: 300px;
  max-width: 300px;
  background: white;
  border-radius: 10px;
  
}

.message-section {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  word-break: keep-all;
  font-weight: 700;
  padding: 20px 0;
}

.button-section {
  display: flex;
  gap: 10px;
}

.confirm-button {
  flex: 1;
  height: 30px;
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  background-color: #524FE1;
  color: #fff;
}

.cancel-button {
  flex: 1;
  height: 30px;
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  background-color: red;
  color: #fff;
}

.confirm-button:hover,
.cancel-button:hover {
  cursor: pointer;
  border: 1px solid black;
  box-shadow: 1px 1px 3px black;
}

</style>
