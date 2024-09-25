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
  }
})

function getImageUrl() {

  if(!!props.icon) {
    return new URL(`/src/assets/icons/${props.icon}`, import.meta.url).href;
  }

  return new URL(`/src/assets/icons/warning-icon.png`, import.meta.url).href;
}

const emit = defineEmits(['confirm']);

function confirm() {
  emit('confirm');
}


</script>

<template>

  <div class="screen-block">
  </div>

  <div class="common-alert-container">
    <div class="content-section">
      <div class="icon-section">
        <img class="alert-icon" :src="getImageUrl()" alt="">
      </div>
      <div class="message-section">
        {{ props.message }}
      </div>
    </div>
    <div class="button-section">
      <button class="confirm-button" @click="confirm()">확인</button>
    </div>
  </div>
</template>

<style scoped>

.common-alert-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  position: absolute;
  top: 30vh;
  left: calc(50% - 170px);
  width: 340px;
  height: 240px;
  padding: 20px;
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

.screen-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.2;
}


</style>
