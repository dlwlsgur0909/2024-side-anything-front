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
      console.log(res.data);
      console.log(auth.member.id);
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
			<h1>chatRoom</h1>

			<div class="chat-content-container">
					<template v-for="(message) in messageList" :key="message.messageId" >

            <div v-if="message.messageType === 'TALK'">
              <div class="chat-message" v-if="message.memberId !== auth.member.id">
                <span class="nickname">{{ message.nickname }}:</span> {{ message.message }}
              </div>
              <div class="my-message" v-else>
                {{ message.message }}
              </div>
            </div>

            <div class="message-center" v-else>
              {{ message.message }}
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
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
}

.chat-message {
  display: flex;
  justify-content: flex-start;
}

.nickname {
  font-weight: 700;
  padding-right: 5px;
}

.my-message {
  display: flex;
  justify-content: flex-end;
}

.message-center {
  display: flex;
  justify-content: center;
}

.chat-input {
  width: 100%;
  padding: 8px;
}
</style>