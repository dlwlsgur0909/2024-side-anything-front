<script setup>

</script>

<template>
  <div class="screen-block">
  </div>

  <div class="common-spinner">
  </div>

  <div class="common-spinner-text">
    <span>Loading...</span>
  </div>

</template>

<style scoped>

.common-spinner {
  position: absolute;
  top: calc(50vh - 50px);
  left: calc(50vw - 50px);
  width: 100px;
  height: 100px;
  border-top: 5px solid #524FE1;
  border-left: 5px solid #524FE1;
  border-right: 5px solid #524FE1;
  border-bottom: 5px solid #ffffff00;
  border-radius: 100px;

  animation: spinner-rotate 1s linear infinite;

}

.common-spinner-text {
  position: absolute;
  top: calc(50vh - 45px);
  left: calc(50vw - 45px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
}

@keyframes spinner-rotate {

  0%{
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }

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
