<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '../../stores/authStore.js';
import { connectStomp, sendMessage, disconnectStomp } from '../../utils/stomp.js';
import globalStore from '@/stores/globalStore.js';

const props = defineProps({
    chatRoomId: {
        type: String,
        required: true
    }
});

const customAxios = inject('customAxios');

const roomId = props.chatRoomId;
const auth = useAuthStore();

const messageInput = ref('');
const postTitle = ref('');
const messageList = ref([]);

const displayMenu = ref(false);

// 메세지 수신 후 콜백
const onMessageReceived = (message) => {
	messageList.value.push(message);
}

// 이전 채팅 내역 조회
function getChatMessageList() {
  customAxios
    .get(`/chats/${props.chatRoomId}`)
    .then(res => {
      postTitle.value = res.data.postTitle;
      messageList.value = res.data.messageList;
    })
    .catch(error => {
      globalStore.router.push('/chatRoomList');
    })
}

// 마운트 시 WebSocket 연결
onMounted(() => {
  getChatMessageList();
	connectStomp(roomId, onMessageReceived);
});

// 마운트 해제 시 WebSocket 연결 해제
onBeforeUnmount(() => {
	disconnectStomp();
})

const send = () => {
  if (!messageInput.value.trim()){
    return;
  } 

  sendMessage(roomId, messageInput.value);
  messageInput.value = '';
};

</script>

<template>
    <div class="main">
      <div class="chat-container">
        <div class="chat-title-menu-button-container">
          <span class="post-title">{{ postTitle }}</span>
          <svg 
            @click="displayMenu = !displayMenu"
            class="chat-menu-button"
            width="30" height="30" viewBox="0 0 30 30" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
          >
            <rect x="4" y="7" width="22" height="3" rx="1" />
            <rect x="4" y="14" width="22" height="3" rx="1" />
            <rect x="4" y="21" width="22" height="3" rx="1" />
          </svg>
        </div>

        <div class="chat-content-container">
            <template v-for="(message) in messageList" :key="message.messageId" >
              <div v-if="message.messageType === 'TALK'">
                <div class="chat-message-section" v-if="message.memberId !== auth.member.id">
                  <span class="chat-message">
                    <span class="nickname">{{ message.nickname }}:</span> {{ message.message }}
                  </span>
                </div>
                <div class="my-message-section" v-else>
                  <span class="my-message">{{ message.message }}</span>
                </div>
              </div>
  
              <div class="message-center-section" v-else>
                <span class="message-center">{{ message.message }}</span>
              </div>
            </template>

            <transition name="slide-right">
              <div class="chat-menu-container" v-if="displayMenu">
                <div class="chat-participant-list">
      
                </div>
                <div class="chat-menu-button-container">
      
                </div>
              </div>
            </transition>
        </div>


      </div>

			<input
					v-model="messageInput"
					@keyup.enter="send()"
					type="text"
					placeholder="메시지를 입력하세요"
					class="chat-input"
			/>
    </div>
</template>

<style scoped>

.chat-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #514fe1;
  border-radius: 10px;
  user-select: none;
}

.chat-title-menu-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 5px 10px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
}

.chat-menu-button {
  color: #514fe1;
  cursor: pointer;
}

.chat-menu-container {
  position: absolute;
  background: #fff;
  top: 0;
  right: 0;
  width: 200px;
  height: 500px;
  padding: 0px;
  border-top: 1px solid #514fe1;
  border-bottom-right-radius: 10px;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

.chat-content-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 500px;
  padding: 10px;
  background: #514fe1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-message-section {
  display: flex;
  justify-content: flex-start;
}

.chat-message {
  max-width: 40%;
  padding: 5px 10px;
  font-size: 14px;
  background: #fff;
  border-radius: 5px;
  word-break: break-all;
  overflow-wrap: break-word
}

.nickname {
  font-weight: 700;
  padding-right: 5px;
}

.my-message-section {
  display: flex;
  justify-content: flex-end;
}

.my-message {
  max-width: 40%;
  padding: 5px 10px;
  font-size: 14px;
  background: #fff;
  border-radius: 5px;
  word-break: break-all;
  overflow-wrap: break-word
}

.message-center-section {
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}

.message-center {
  background: #403ead;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
}

.chat-input {
  width: 100%;
  padding: 8px;
}
</style>