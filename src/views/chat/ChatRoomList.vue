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

const keyword = ref('');

// 버튼 설정
const buttonConfig = {
  search: {
    label: '검색',
    fontColor: 'white',
    backgroundColor: 'black'
  },
}

// 채팅방 목록
const roomList = ref([]);

// 채팅방 목록 조회 API
function getChatRoomList() {
  customAxios
    .get(`/chats?page=${currentPage.value}&keyword=${encodeURIComponent(keyword.value)}`)
    .then(res => {
      roomList.value = res.data.roomList;
      totalPages.value = res.data.totalPages;
    })
    .catch(error => {

    })
}

// 최초 채팅방 목록 조회
onMounted(() => {

  // 저장된 검색어, 현재 페이지 정보
  const savedKeyword = sessionStorage.getItem('keyword');
  const savedCurrentPage = Number(sessionStorage.getItem('currentPage'));

  sessionStorage.removeItem('keyword');
  sessionStorage.removeItem('currentPage');

  keyword.value = savedKeyword ? savedKeyword : '';
  currentPage.value = savedCurrentPage ? savedCurrentPage : 1;

  getChatRoomList();
})

// 채팅방으로 페이지 이동
function goToChatRoom(chatRoomId) {

  // 검색어, 현재 페이지 정보 저장
  sessionStorage.setItem('keyword', keyword.value);
  sessionStorage.setItem('currentPage', currentPage.value);

  globalStore.router.push({
    name: 'ChatRoom',
    params: {
      chatRoomId: chatRoomId
    }
  });
}

// 검색 이벤트
function onClickSearch() {
  keyword.value = keyword.value.trim();
  currentPage.value = 1;
  getChatRoomList();
}

// 페이지 변경
function changePage(page) {
  currentPage.value = page;
  getChatRoomList();
}

</script>

<template>
  <div class="main">

    <div class="chat-room-search-container">
      <input type="text" 
        class="chat-room-search-box" placeholder="제목"
        v-model="keyword" @keyup.enter="onClickSearch()"
      />
      <CommonButton
        class="chat-room-search-button"
        :label="buttonConfig.search.label"
        :fontColor="buttonConfig.search.fontColor"
        :background-color="buttonConfig.search.backgroundColor"
         @click="onClickSearch()"
      />
    </div>

    <div class="chat-list-container" v-if="roomList.length > 0">
      <div class="list-item-container" 
        v-for="(room) in roomList" :key="room.chatRoomId"
        @click="goToChatRoom(room.roomId)"
      >
        <div class="item-title-status">
          {{ room.postTitle }}
          <CommonStatusLabel
            :status="room.postStatus"
          />
        </div>
      </div>

    </div>

    <div class="no-content" v-else>
      <span class="no-content-message">참여중인 채팅이 없습니다 😢</span>
    </div>

    <Pagination
      v-if="roomList.length > 0"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changePage="(page) => changePage(page)"
    />

  </div>
</template>

<style scoped>

.chat-room-search-container {
  display: flex;
  gap: 20px;
}

.chat-room-search-box {
  height: 40px;
  border-radius: 5px;
  flex: 1;
}

.chat-room-search-button {
  flex: 1;
  max-width: 100px;
}

.chat-list-container {
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
