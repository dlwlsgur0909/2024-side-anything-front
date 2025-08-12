<script setup>

import { useAuthStore } from '../stores/authStore.js';
import { inject, ref } from 'vue';
import globalStore from '../stores/globalStore.js';
import CommonButton from '../components/common/CommonButton.vue';

const auth = useAuthStore();
const customAxios = inject('customAxios');

const username = ref('');
const memberList = ref([]);

// 관리자 화면
function adminDetail() {

  customAxios
    .get('/admin')
    .then(res => {
      username.value = res.data.username;
    })
    .catch(error => {
      globalStore.router.push('/');
    })

}

adminDetail();

// 회원 목록 조회
function findMemberList() {

  if(memberList.value.length > 0) {
    memberList.value = [];
    return;
  }

  customAxios
  .get('/admin/members')
  .then(res => {
    memberList.value = res.data.memberList;
  })

}

// 버튼 설정
const buttonConfig = {

  memberList: {
    label: '회원목록',
    fontColor: '#fff',
    backgroundColor: "#524FE1",
  },
  cancel: {
    label: '뒤로가기',
    fontColor: '#fff',
    backgroundColor: '#E34444',
  }

}

</script>

<template>
  <div class="main">
    <div class="home-greeting-container">
      <h1>안녕하세요 {{ auth.member?.name }}님 😊</h1>
    </div>
    <div>
      여기에는 통계 같은 자료
    </div>
    <div class="button-section">
      <CommonButton
        class="member-list-button"
        @click="findMemberList()"
        :label="buttonConfig.memberList.label"
        :fontColor="buttonConfig.memberList.fontColor"
        :backgroundColor="buttonConfig.memberList.backgroundColor"
      />
      <CommonButton
        class="cancel-button"
        @click="globalStore.router.back()"
        :label="buttonConfig.cancel.label"
        :fontColor="buttonConfig.cancel.fontColor"
        :backgroundColor="buttonConfig.cancel.backgroundColor"
      />
    </div>

    <div class="member-list-section">
      <div v-for="(member, index) in memberList" :key="member.id">
        {{ index+1 }}번 회원 {{ `${member.email} ${member.createdAt}`}}
      </div>
    </div>
  </div>
</template>

<style scoped>

.home-greeting-container {
  display: flex;
  justify-content: center;
}

.button-section {
  display: flex;
  gap: 10px;
}

.member-list-button,
.cancel-button {
  flex-grow: 0.5;
}

.member-list-section {
  display: flex;
  flex-direction: column;
}

</style>
