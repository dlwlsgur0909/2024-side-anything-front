import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/stores/authStore";

let stompClient = null;
const auth = useAuthStore();

export const connectStomp = async (roomId, memberId, onMessageReceived) => {

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8090/ws-chat"),
        connectHeaders: {
            Authorization: `Bearer ${auth.member.accessToken}` 
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (message) => console.log('[STOMP DEBUG]', message),
        onConnect: () => {
            console.log('WebSocket connected');

            stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
                const payload = JSON.parse(message.body);
                onMessageReceived(payload);
            });
        },
        onStompError: (frame) => {
            console.error('STOMP Error: ', frame.headers['message']);
            console.error('Detail: ', frame.body);
        },
    });

    stompClient.activate();
};

export const sendMessage = (roomId, memberId, message) => {

    if(!stompClient || !stompClient.connected) {
        console.warn('STOMP NOT CONNECTED');
        return;
    }

    const payload = {
        messageType: 'TALK', 
        roomId: roomId, 
        memberId: memberId, 
        message: message
    };

    stompClient.publish({
        destination: `/pub/chat/${roomId}`,
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${auth.member.accessToken}`
        }
    });
};

export const disconnectStomp = () => {
    if(stompClient) {
        stompClient.deactivate();
        stompClient = null;
        console.log('WebSocket 연결 해제');
    }
}