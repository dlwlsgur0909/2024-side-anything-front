import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../js/auth.js';
import globalStore from '../stores/globalStore.js';
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
    },
    {
      path: '/login-success',
      name: 'loginSuccess', 
    },
    {
      path: '/login-fail',
      name: 'loginFail',
    },
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import('../views/NotFound.vue'),
    }
  ]
})

const allowedNames = ['login', 'join', 'find'];

router.beforeEach(async (to, from) => {

  const auth = useAuthStore();
  const toName = to.name;

  // 소셜 로그인 실패 처리
  if(toName === 'loginFail') {
    if(to.query?.error === '403') {
      globalStore.alert.openAlert('이미 가입된 이메일입니다.');
    }else {
      globalStore.alert.openAlert('소셜 로그인에 실패했습니다.');
    }

    return {name: 'login'}
  }

  // 소셜 로그인 성공 처리
  if(toName === 'loginSuccess') {
    if(await auth.socialLogin()) {
      return {name: 'home'};
    }else {
      return {name: 'login'};
    }
  }

  if(!allowedNames.includes(toName) && !auth.isLogin) {

    if(toName !== 'home') {
      globalStore.alert.openAlert('로그인 후 이용해주세요'); 
    }

    return {name: 'login'};
  }

})

export default router
