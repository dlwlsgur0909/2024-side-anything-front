<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore.js';
import { useAlertStore } from './stores/alertStore.js';
import { useConfirmStore } from './stores/confirmStore.js';
import { useSpinnerStore } from './stores/spinnerStore.js';
import globalStore from './stores/globalStore.js';

import CommonAlert from './components/common/CommonAlert.vue';
import CommonConfirm from './components/common/CommonConfirm.vue';
import CommonSpinner from './components/common/CommonSpinner.vue';

import TopMenu from './components/menu/TopMenu.vue';

const auth = useAuthStore();
const router = useRouter();
const alert = useAlertStore();
const confirm = useConfirmStore();
const spinner = useSpinnerStore();

globalStore.router = router;
globalStore.alert = alert;
globalStore.confirm = confirm;
globalStore.spinner = spinner;

if(!!localStorage.getItem("ACCESS")) {
  auth.reissue();
}else {
  auth.setMember(null);
}

</script>

<template>
  <TopMenu 
    v-if="auth.isLogin"
  />
  <div class="wrapper">
    <div class="main-container">
      <RouterView />
    </div>
  </div>

  <CommonAlert
    v-if="alert.isOpen"
    :message="alert.message"
    :icon="alert.icon"
    @closeAlert="alert.closeAlert()"
  />

  <CommonConfirm
    v-if="confirm.isOpen"
    :message="confirm.message"
    @onClickConfirm="confirm.onClickConfirm()"
    @closeConfirm="confirm.closeConfirm()"
  />

  <CommonSpinner
    v-if="spinner.isLoading"
  />

</template>

<style scoped>

.wrapper {
  position: relative;
  top: 80px;
  display: flex;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  max-width: 1100px;
}

.main-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

</style>
