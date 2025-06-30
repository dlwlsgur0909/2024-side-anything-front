<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';

const menuList = ['HOME', 'MYINFO', 'COMPANION', 'BOARD'];
const selectedMenu = ref('HOME');

const displaySideMenu = ref(false);
const isSideMenuOpen = ref(false);

const auth = useAuthStore();

onMounted(() => {
  const findMenu = menuList.find(menu => menu === sessionStorage.getItem('menu'));
  if(!findMenu) {
    sessionStorage.setItem('menu', 'HOME');
    selectedMenu.value = 'HOME';
    globalStore.router.push('/');
  }else {
    selectedMenu.value = findMenu;
  }

  displaySideMenu.value = window.innerWidth > 600 ? false : true;

})

/* 상단 메뉴 클릭 이벤트 */ 
function onClickHome() {
	selectedMenu.value = 'HOME';
  sessionStorage.setItem('menu', 'HOME');
	globalStore.router.push('/');
}

function onClickMyInfo() {
	selectedMenu.value = 'MYINFO';
  sessionStorage.setItem('menu', 'MYINFO');
  globalStore.router.push({
    name: 'Member',
    params: {
      username: auth.member.username
    },
  });
}

function onClickCompanion() {
  selectedMenu.value = 'COMPANION';
  sessionStorage.setItem('menu', 'COMPANION');
  globalStore.router.push('/companionPostList');

}

// 테스트 용도 추후 수정 필요
function onClickChat() {
  selectedMenu.value = 'CHAT';
  sessionStorage.setItem('menu', 'CHAT');
  globalStore.router.push({
    name: 'ChatRoom',
    params: {
      chatRoomId: 1
    }
  })
}

function toggleSideMenu() {
  isSideMenuOpen.value = !isSideMenuOpen.value;
}

window.addEventListener('resize', () => {
  displaySideMenu.value = window.innerWidth > 600 ? false : true;
})


</script>

<template>

  <div class="menu-container">
    <div class="top-menu-container" v-if="!displaySideMenu">
  
      <div class="top-menu-logo-section" >
          <img class="top-menu-logo" src="../../assets/logo/top-menu-logo.svg" alt="logo">
      </div>
  
      <div class="top-menu-item-section">
        <div
          class="top-menu-item" 
          :class="selectedMenu === 'HOME' ? 'top-menu-item-selected' : ''"
          @click="onClickHome()"
        >
          HOME	
        </div>
          
        <div 
          class="top-menu-item"
          :class="selectedMenu === 'MYINFO' ? 'top-menu-item-selected' : ''"
          @click="onClickMyInfo()"
        >
          내 정보
        </div>
  
        <div 
          class="top-menu-item"
          :class="selectedMenu === 'COMPANION' ? 'top-menu-item-selected' : ''"
          @click="onClickCompanion()"
        >
          동행
        </div>
  
        <div class="top-menu-item"
          :class="selectedMenu === 'CHAT' ? 'top-menu-item-selected' : ''"
          @click="onClickChat()"
        >
          채팅
        </div>
      </div>
  
    </div>

    <template v-else>
      <transition name="slide-fade">
        <div class="side-menu-icon-container-closed" v-if="!isSideMenuOpen">
          <img 
            class="side-menu-icon-closed" @click="toggleSideMenu()"
            src="../../assets/icon/side-menu-icon-closed.svg" alt="side-menu-icon"
          >
        </div>
      </transition>

      <transition name="slide-fade">
        <div class="side-menu-icon-container-opened" v-if="isSideMenuOpen">
          <img 
            class="side-menu-icon-opened" @click="toggleSideMenu()"
            src="../../assets/icon/side-menu-icon-opened.svg" alt="side-menu-icon"
          >
        </div>
      </transition> 

      <transition name="slide-left">
        <div class="side-menu-container" v-if="isSideMenuOpen">
          <div class="side-menu-item-section" >
            <div
              class="side-menu-item" 
              :class="selectedMenu === 'HOME' ? 'side-menu-item-selected' : ''"
              @click="onClickHome()"
            >
              HOME	
            </div>
              
            <div 
              class="side-menu-item"
              :class="selectedMenu === 'MYINFO' ? 'side-menu-item-selected' : ''"
              @click="onClickMyInfo()"
            >
              내 정보
            </div>
      
            <div 
              class="side-menu-item"
              :class="selectedMenu === 'COMPANION' ? 'side-menu-item-selected' : ''"
              @click="onClickCompanion()"
            >
              동행
            </div>
      
            <div class="side-menu-item">자유게시판</div>
          </div>
        </div>
      </transition>
    </template>

    


  </div>


</template>

<style scoped>

.top-menu-container {
  position: fixed;
  display: flex;
  gap: 30px;
  width: 100%;
  height: 80px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #524FE1;
  z-index: 88888;
  user-select: none;
}

.top-menu-logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  padding: 10px;
  margin-left: 20px;
  border: 3px solid #fff;
  border-radius: 100px;
}

.top-menu-logo {
  height: 50%;
}

.top-menu-item-section {
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}

.top-menu-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.top-menu-item:hover,
.top-menu-item-selected {
  color: rgb(170, 255, 227);
}

.side-menu-icon-container-opened {
  position: fixed;
  width: 200px;
  height: 50px;
  background: #524FE1;
  z-index: 88888;
}

.side-menu-icon-opened {
  width: 50px;
  height: 100%;
  padding-left: 10px;
  cursor: pointer;
  user-select: none;
}

.side-menu-icon-container-closed {
  position: fixed;
  width: 100vw;
  height: 50px;
  background: #fff;
  z-index: 88888;
}

.side-menu-icon-closed {
  width: 50px;
  height: 100%;
  padding-left: 10px;
  cursor: pointer;
  user-select: none;
}

.side-menu-container {
  position: fixed;
  top: 50px;
  width: 200px;
  height: calc(100% - 50px);
  padding-top: 50px;
  background: #524FE1;
  transform: translateX(0);
  z-index: 88888;
  user-select: none;
}

.side-menu-item-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-menu-item {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid #fff;
}

.side-menu-item:hover,
.side-menu-item-selected {
  color: rgb(170, 255, 227);
  border-bottom: 1px solid rgb(170, 255, 227);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
}

</style>
