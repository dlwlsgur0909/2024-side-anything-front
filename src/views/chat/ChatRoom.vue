<script setup>
import { ref } from 'vue';

const props = defineProps({
    chatRoomId: {
        type: String,
        required: true
    }
});




</script>

<template>
    <div class="chat-container">
			<h1>chatRoom</h1>

			<div class="chat-log">
					<div v-for="(msg, idx) in messages" :key="idx" class="chat-message">
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