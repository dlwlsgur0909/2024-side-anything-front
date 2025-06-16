import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'

import App from './App.vue'
import router from './router'
import customAxios from './js/customAxios.js';

const app = createApp(App)

app.use(createPinia())
app.provide('customAxios', customAxios());

const auth = useAuthStore();

if(!!localStorage.getItem("ACCESS")) {
  await auth.reissue();
}else {
  auth.setMember(null);
}

app.use(router)
app.mount('#app')
