<script setup>

import { ref, inject, onMounted } from 'vue'; 
import globalStore from '../../stores/globalStore.js';
import Pagination from '../../components/common/Pagination.vue';
import CommonButton from '../../components/common/CommonButton.vue';
import CommonStatusLabel from '../../components/common/CommonStatusLabel.vue';

const customAxios = inject('customAxios');

// 페이지네이션 관련 변수
const currentPage = ref(1);
const totalPages = ref(0);

// 버튼 설정
const buttonConfig = {
  // save: {
  //   label: '등록하기',
  //   fontColor: 'white',
  //   backgroundColor: 'black'
  // },
}

// 채팅방 목록
const chatRoomList = ref([]);

// 채팅방 목록 조회 API
function getChatRoomList() {
  customAxios
    .get('/chats')
    .then(res => {
      chatRoomList.value = res.data.chatRoomList;
    })
    .catch(error => {

    })
}


// 최초 내 동행 모집 목록 조회
onMounted(() => {
  getChatRoomList();
})

// 내 동행 모집 상세 페이지 이동
function goToChatRoom(chatRoomId) {
  globalStore.router.push({
    name: 'ChatRoom',
    params: {
      chatRoomId: chatRoomId
    }
  });
}

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getMyCompanionPostList();
}


</script>

<template>
  <div class="main">
    <div class="my-companion-post-list-container" v-if="chatRoomList.length > 0">

      <div class="list-item-container" 
        v-for="(chatRoom) in chatRoomList" :key="chatRoom.chatRoomId"
        @click="goToChatRoom(chatRoom.chatRoomId)"
      >
        <div class="item-title-status">
          {{ chatRoom.companionPostTitle }}
          <CommonStatusLabel
            :status="chatRoom.companionPostStatus"
          />
        </div>
      </div>

    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">등록한 동행이 없습니다 😢</span>
    </div>

    <Pagination
      v-if="chatRoomList.length > 0"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

  </div>
</template>

<style scoped>

.my-companion-application-list-container {
  display: flex;
  flex-direction: column;
}

.list-item-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
}

.list-item-container:hover {
  color: #fff;
  background: #524FE1;
}

.item-title-status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.item-location {
  display: flex;
  justify-content: center;
  word-break: keep-all;
  text-align: center;     
}

.item-duration {
  display: flex;
  justify-content: center;
  font-size: 14px;
}

.no-content {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.no-content-message {
  font-weight: 500;
}

</style>
