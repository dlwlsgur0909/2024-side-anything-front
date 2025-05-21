import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';
import globalStore from '../stores/globalStore.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import ('../views/common/LoginView.vue')
    },
    {
      path: '/join',
      name: 'Join',
      component: () => import ('../views/common/JoinView.vue')
    },
    {
      path: '/find',
      name: 'Find',
      component: () => import('../views/common/FindView.vue')
    },
    {
      path: '/member/:username',
      name: 'Member',
      component: () => import('../views/MemberView.vue'),
      props: true
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/login-success',
      name: 'LoginSuccess', 
    },
    {
      path: '/login-fail',
      name: 'LoginFail',
    },
    {
      path: '/portfolioList/:username',
      name: 'PortfolioList',
      component: () => import('../views/portfolio/PorfolioList.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)',
      name: 'NotFound',
      component: () => import('../views/common/NotFound.vue'),
    }
  ]
})

const allowedNames = ['Login', 'Join', 'Find'];

router.beforeEach(async (to, from) => {

  const auth = useAuthStore();
  const toName = to.name;

  // 소셜 로그인 실패 처리
  if(toName === 'LoginFail') {
    if(to.query?.error === '403') {
      globalStore.alert.openAlert('이미 가입된 이메일입니다.');
    }else {
      globalStore.alert.openAlert('소셜 로그인에 실패했습니다.');
    }

    return {name: 'Login'}
  }

  // 소셜 로그인 성공 처리
  if(toName === 'LoginSuccess') {
    if(await auth.socialLogin()) {
      return {name: 'Home'};
    }else {
      return {name: 'Login'};
    }
  }

  if(!allowedNames.includes(toName) && !auth.isLogin) {

    if(toName !== 'Home') {
      globalStore.alert.openAlert('로그인 후 이용해주세요'); 
    }

    return {name: 'Login'};
  }

})

export default router
