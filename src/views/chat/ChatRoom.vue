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
      messageList.value = res.data.messageList;
    })
    .catch(error => {
      globalStore.router.push('/chatRoomList');
    })
}

// 마운트 시 WebSocket 연결
onMounted(() => {
  getChatMessageList();
	connectStomp(roomId, auth.member.id, onMessageReceived);
});

onBeforeUnmount(() => {
	disconnectStomp();
})

const send = () => {
  if (!input.value.trim()) return;

  sendMessage(roomId, auth.member.id, input.value);
  input.value = '';
};

</script>

<template>
    <div class="chat-container">
			<h1>chatRoom</h1>

			<div class="chat-log">
					<div v-for="(msg, idx) in messageList" :key="idx" class="chat-message">
					<strong>{{ msg.memberId }}:</strong> {{ msg.message }}
					</div>
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
.chat-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.chat-log {
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
}

.chat-message {
  margin-bottom: 8px;
}

.chat-input {
  width: 100%;
  padding: 8px;
}
</style>