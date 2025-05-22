import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import customAxios from './js/customAxios.js';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.provide('customAxios', customAxios());
app.mount('#app')
