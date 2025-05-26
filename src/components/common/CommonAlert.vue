<script setup>

const props = defineProps({
  message: {
    type: String,
    required: true,
    default: '알림',
  },
  icon: {
    type: String,
    required: false,
  },
})

function getImageUrl() {

  if(!!props.icon) {
    return new URL(`/src/assets/icon/${props.icon}`, import.meta.url).href;
  }

  return new URL(`/src/assets/icon/warning-icon.png`, import.meta.url).href;
}

const emit = defineEmits(['closeAlert']);

function closeAlert() {
  emit('closeAlert');
}


</script>

<template>
  <div class="screen-block">
    <div class="common-alert-container">
      <div class="content-section">
        <div class="icon-section">
          <img class="alert-icon" :src="getImageUrl()" alt="">
        </div>
        <div class="message-section">
          {{ props.message }} 1 23123123123123 12313123123123123213123123123123
        </div>
      </div>
      <div class="button-section">
        <button class="confirm-button" @click="closeAlert()">확인</button>
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
}

.common-alert-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  max-width: 300px;
  background: white;
  border-radius: 10px;
  
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.icon-section,
.message-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-section {
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}

.alert-icon {
  width: 100px;
  height: 100px;
}

.button-section {
  display: flex;
  flex-direction: column;
}

.confirm-button {
  height: 30px;
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  background-color: #524FE1;
  color: #fff;
}

.confirm-button:hover {
  cursor: pointer;
  border: 1px solid black;
  box-shadow: 1px 1px 3px black;
}

</style>
