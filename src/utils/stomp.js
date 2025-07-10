import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/stores/authStore";

let stompClient = null;
const auth = useAuthStore();

export const connectStomp = async (roomId, memberId, onMessageReceived) => {

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8090/ws"),
        connectHeaders: {
            Authorization: `Bearer ${auth.member.accessToken}` 
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (message) => console.log('[STOMP DEBUG]', message),

        // 연결 성공 시
        onConnect: () => {
            console.log('WebSocket connected');

            stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
                const payload = JSON.parse(message.body);
                onMessageReceived(payload);
            });
        },

        // 연결 실패 시
        onStompError: (frame) => {

            const errorMessage = frame.headers['message'] || '서버 오류입니다. 관리자에게 문의해주세요.';
            const errorDetail = frame.body || '';

            console.error('STOMP Error: ', errorMessage);
            console.error('Detail: ', errorDetail);

            // 사용자에게 알림

            // 연결 해제

            // 리다이렉트 

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