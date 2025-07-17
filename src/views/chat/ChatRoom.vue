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

const input = ref('');
const postTitle = ref('');
const messageList = ref([]);

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
  if (!input.value.trim()) return;

  sendMessage(roomId, input.value);
  input.value = '';
};

</script>

<template>
    <div class="main">
			<h1>{{ postTitle }}</h1>

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
			</div>

			<input
					v-model="input"
					@keyup.enter="send"
					type="text"
					placeholder="메시지를 입력하세요"
					class="chat-input"
			/>
    </div>
</template>

<style scoped>

.chat-content-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 500px;
  padding: 10px;
  background: #514fe1;
  border-radius: 10px;
  overflow-y: auto;
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