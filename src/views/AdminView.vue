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
    .catch(e => {
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
  <div class="main-container">
    <div con>

    </div>
    <div class="page-title">This is Admin page</div>
    <div class="username-label">{{ username }} 관리자님</div>
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

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  width: 80%;
  height: 98vh;
  padding: 50% 5% 5% 5%;
  border-radius: 10px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.username-label {
  font-size: 18px;
  font-weight: bold;
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
