<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './js/auth.js';
import { useAlertStore } from './js/alert.js';
import { useSpinnerStore } from './js/spinner.js';
import globalRouter from './router/globalRouter.js';
import CommonAlert from './components/common/CommonAlert.vue';
import CommonSpinner from './components/common/CommonSpinner.vue';

const auth = useAuthStore();
const router = useRouter();
globalRouter.router = router;

const alert = useAlertStore();
const spinner = useSpinnerStore();

if(!!auth.member) {
  auth.reissue();
}else {
  auth.setMember(null);
}

</script>

<template>
  <div class="wrapper">
    <div class="main-container">
      <RouterView />
    </div>
  </div>

  <CommonAlert
    v-if="alert.isOpen"
    :message="alert.message"
    :icon="alert.icon"
    @confirm="alert.confirmAlert()"
  />

  <CommonSpinner
    v-if="spinner.isLoading"
  />

</template>

<style scoped>

.wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  height: 98vh;
  width: 500px;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 5px;
}

.main-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

</style>
