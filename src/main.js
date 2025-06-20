import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import { useAlertStore } from './stores/alertStore'

import App from './App.vue'
import router from './router'
import customAxios from './js/customAxios.js';

const app = createApp(App)

app.use(createPinia())
app.provide('customAxios', customAxios());

const auth = useAuthStore();
const alert = useAlertStore();

if(!!localStorage.getItem("ACCESS")) {
  if(!await auth.reissue()) {
    router.push('/login');
    alert.openAlert('로그인이 만료되었습니다');
  }
}else {
  auth.setMember(null);
}

app.use(router)
app.mount('#app')
