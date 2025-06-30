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
    // {
    //   path: '/member/:username',
    //   name: 'Member',
    //   component: () => import('../views/MemberView.vue'),
    //   props: true
    // },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/social-join',
      name: 'SocialJoin',
      component: () => import('../views/common/SocialJoinView.vue')
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
      path: '/companionPostList',
      name: 'CompanionPostList',
      component: () => import('../views/companion/CompanionPostList.vue'),
    },
    {
      path: '/companionPostSave',
      name: 'CompanionPostSave',
      component: () => import('../views/companion/CompanionPostSave.vue')
    },
    {
      path: '/companionPostDetail/:companionPostId',
      name: 'CompanionPostDetail',
      component: () => import('../views/companion/CompanionPostDetail.vue'),
      props: true
    },
    {
      path: '/myCompanionApplicationList',
      name: 'MyCompanionApplicationList',
      component: () => import('../views/companion/MyCompanionApplicationList.vue')
    },
    {
      path: '/myCompanionPostList',
      name: 'MyCompanionPostList',
      component: () => import('../views/companion/MyCompanionPostList.vue')
    },
    {
      path: '/myCompanionPostDetail/:companionPostId',
      name: 'MyCompanionPostDetail',
      component: () => import('../views/companion/MyCompanionPostDetail.vue'),
      props: true
    },
    {
      path: '/chatRoom/:chatRoomId',
      name: 'ChatRoom',
      component: () => import('../views/chat/ChatRoom.vue'),
      props: true
    },
    // {
    //   path: '/portfolioUpdate/:portfolioId',
    //   name: 'PortfolioUpdate',
    //   component: () => import('../views/portfolio/PortfolioUpdate.vue'),
    //   props: true
    // },
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
      return auth.member.isProfileCompleted ? {name: 'Home'} : {name: 'SocialJoin'};
    }else {
      return {name: 'Login'};
    }
  }

  if(auth.isLogin) { // 로그인 상태

    if(auth.member.isProfileCompleted) {
      if(allowedNames.includes(toName) || toName === 'SocialJoin') {
          return {name: 'Home'};
      }
    }else {
      if(toName !== 'SocialJoin') {
        globalStore.alert.openAlert('소셜 회원은 추가정보가 필요합니다');
        return {name: 'SocialJoin'};
      }
    }


  }else { // 로그아웃 상태
    if(!allowedNames.includes(toName)) {
      if(toName !== 'Home') {
        globalStore.alert.openAlert('로그인 후 이용해주세요'); 
      }

      return {name: 'Login'};
    }
  }


  // if(!allowedNames.includes(toName) && !auth.isLogin) {

  //   console.log(toName);
  //   console.log(toName === 'Home');

  //   if(toName !== 'Home') {
  //     globalStore.alert.openAlert('로그인 후 이용해주세요'); 
  //   }

  //   return {name: 'Login'};
  // }

})

export default router
