<script setup>

import { useAuthStore } from '../js/auth.js';
import { useRouter } from 'vue-router';
import { inject, ref } from 'vue';

const router = useRouter();
const auth = useAuthStore();
const customAxios = inject('customAxios');

const username = ref('');
const memberList = ref([]);

function adminDetail() {

  customAxios
  .get('http://localhost:8090/admin')
  .then(res => {
    username.value = res.data.username;
  })
  .catch(e => {
    router.push('/');
  })

}

adminDetail();

function findMemberList() {

  customAxios
  .get('http://localhost:8090/admin/members')
  .then(res => {
    memberList.value = res.data.memberList;
  })

}

</script>

<template>
  <div class="admin">
    <h1>This is Admin page</h1>
    <h2>{{ username }} 관리자님</h2>
    <button @click="findMemberList()">회원목록</button>
    <button @click="auth.logout()">로그아웃</button>
    <div class="member-list-section">
      <div v-for="(member, index) in memberList" :key="member.id">
        {{ index+1 }}번 회원 {{ `${member.username} ${member.email} ${member.createdAt}`}}
      </div>
    </div>
  </div>
</template>

<style scoped>

.member-list-section {
  display: flex;
  flex-direction: column;
}

</style>
