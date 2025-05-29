<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';
import globalStore from '../../stores/globalStore.js';

const menuList = ref(['HOME', 'MYINFO', 'PORTFOLIO', 'BOARD'])
const selectedMenu = ref('HOME');

const auth = useAuthStore();

/* 상단 메뉴 클릭 이벤트 */ 

function onClickHome() {
	selectedMenu.value = 'HOME';
	globalStore.router.push('/');
}

function onClickMyInfo() {

	selectedMenu.value = 'MYINFO';

  globalStore.router.push({
    name: 'Member',
    params: {
      username: auth.member.username
    },
  });
}

function onPortfolioList() {
  selectedMenu.value = 'PORTFOLIOLIST';
  globalStore.router.push('/portfolioList');

}



</script>

<template>

  <div class="top-menu-container">

    <div class="top-menu-logo-section">
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
        :class="selectedMenu === 'PORTFOLIOLIST' ? 'top-menu-item-selected' : ''"
        @click="onPortfolioList()"
      >
        포트폴리오
      </div>

      <div class="top-menu-item">자유게시판</div>

    </div>

  </div>

</template>

<style scoped>

.top-menu-container {
  position: fixed;
  display: flex;
  gap: 30px;
  width: 100vw;
  height: 80px;
  padding-top: 10px;
  padding-bottom: 10px;
  background: #524FE1;
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


</style>
