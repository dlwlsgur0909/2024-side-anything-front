import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../js/auth.js';
import LoginView from '../views/LoginView.vue';
import { onMounted } from 'vue';

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
    },
    {
      path: '/find',
      name: 'find',
      component: () => import('../views/FindView.vue')
    },
    {
      path: '/member/:username',
      name: 'member',
      component: () => import('../views/MemberView.vue'),
      props: true
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    }
    ,
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import('../views/NotFound.vue'),
    }
  ]
})

const allowedNames = ['login', 'join', 'find'];

router.beforeEach((to, from) => {
  const auth = useAuthStore();
  const toName = to.name;

  if(!allowedNames.includes(toName) && !auth.isLogin) {
    alert('로그인 후 이용해주세요');
    return {name: 'login'};
  }

})

export default router
