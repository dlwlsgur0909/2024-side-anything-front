import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../js/auth.js';
import LoginView from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/join',
      name: 'join',
      component: () => import ('../views/JoinView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    }
  ]
})

const allowedPathList = ['login', 'join']

router.beforeEach((to, from) => {
  const auth = useAuthStore();
  const toName = to.name;

  if(!allowedPathList.includes(toName) && !auth.isLogin) {
    alert('로그인 후 이용해주세요');
    return {name: 'login'};
  }
})

export default router
