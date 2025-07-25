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
const participantList = ref([]);

const hostId = ref(0);

const displayMenu = ref(false);

// 메세지 수신 후 콜백
const onMessageReceived = (message) => {
  if(message.messageType === 'TALK') {
    messageList.value.push(message);
  }else {
    getChatMessageList();
  }
}

// 이전 채팅 내역 조회
function getChatMessageList() {
  customAxios
    .get(`/chats/${roomId}`)
    .then(res => {
      postTitle.value = res.data.postTitle;
      messageList.value = res.data.messageList;
      participantList.value = res.data.participantList;
      hostId.value = res.data.participantList
        .find(participant => participant.isHost)
        .memberId;
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

// 메세지 전송
function send() {
  if (!messageInput.value.trim()){
    return;
  } 

  sendMessage(roomId, messageInput.value);
  messageInput.value = '';
};

function clickParticipant(participant) {

  if(hostId.value !== auth.member.id) {
    globalStore.alert.openAlert('참가자 관련 기능은 방장만 가능합니다');
    return;
  }
  
  if(participant.memberId === hostId.value) {
    globalStore.alert.openAlert('방장은 강퇴할 수 없습니다');
    return;
  }

  globalStore.confirm.openConfirm(`${participant.nickname}님을 강퇴하시겠습니까? (참가자의 동행 신청이 철회됩니다)`, () => {
    customAxios
      .delete(`/chats/${roomId}/participants/${participant.id}`)
      .then(res => {
        getChatMessageList();
      })
      .catch(error => {

      })
  });
}

</script>

<template>
    <div class="main">
      <div class="chat-container">
        <!-- 채팅방 상단 -->
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

        <!-- 채팅방 내용 -->
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

            <!-- 채팅방 메뉴 -->
            <transition name="slide-right">
              <div class="chat-menu-container" v-if="displayMenu">
                <div class="chat-participant-list-container">
                  <div class="chat-participant" 
                    v-for="(participant) in participantList" 
                    :key="participant.id"
                    @click="clickParticipant(participant)"
                  >
                    <svg 
                      class="host-icon" version="1.1" id="Layer_1" v-if="participant.isHost"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                      viewBox="0 0 472.615 472.615" xml:space="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier"> 
                        <g> <g> 
                          <path 
                            d="M436.475,103.262c-19.961,0-36.141,16.18-36.141,36.141c0,9.776,3.92,18.613,
                            10.226,25.12l-74.195,71.928l-76.969-122.068 c12.207-7.695,20.378-21.202,
                            20.378-36.7c0-24.005-19.46-43.467-43.466-43.467c-24.005,0-43.465,19.462-43.465,
                            43.467 c0,15.468,8.139,28.961,20.31,36.666l-76.938,122.101L62.05,164.528c6.311-6.505,
                            10.232-15.346,10.232-25.125 c0-19.961-16.181-36.141-36.141-36.141S0,119.442,0,139.403c0,
                            19.959,16.181,36.139,36.141,36.139 c2.196,0,4.322-0.272,6.411-0.647l34.27,
                            166.474h318.972l34.27-166.474c2.088,0.378,4.215,0.647,6.412,0.647 c19.96,0,36.14-16.18,
                            36.14-36.139C472.615,119.442,456.435,103.262,436.475,103.262z"
                          />

                        </g> </g> 
                        <g> <g> 
                          <polygon points="391.714,361.061 80.875,361.061 62.108,438.398 410.481,438.398 " />
                        </g> </g> 
                      </g>
                    </svg>
                    <span class="participant-info">
                      {{ participant.nickname }}
                      {{ participant.memberId === auth.member.id ? '(나)' : participant.gender === 'MALE' ? '/ 남' : '/ 여' }}
                    </span>
                  </div>
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

.chat-participant-list-container {
  height: 450px;
  overflow-y: auto;
  border-bottom: 1px solid black;
}

.chat-participant {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 5px;
  cursor: pointer;
}

.chat-participant:hover {
  background: lightgray;
}

.host-icon {
  width: 20px;
  height: 20px;
  fill: gold;
}

.participant-info {
  font-size: 14px;
  font-weight: 500;
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