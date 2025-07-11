import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/stores/authStore";
import globalStore from "@/stores/globalStore";

let stompClient = null;
const auth = useAuthStore();

export const connectStomp = async (roomId, memberId, onMessageReceived) => {

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8090/ws"), // WebSocket 객체 생성
        connectHeaders: {
            Authorization: `Bearer ${auth.member.accessToken}` // CONNECT 프레임에 토큰 포함
        },
        reconnectDelay: 0, // 자동 재연결 비활성화 
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // debug: (message) => console.log('[STOMP DEBUG]', message), // 디버깅용

        // 연결 성공 시 자동으로 실행되는 콜백
        onConnect: () => {
            // 입장한 채팅방을 구독
            stompClient.subscribe(`/sub/chat/${roomId}`, (message) => {
                const payload = JSON.parse(message.body);
                onMessageReceived(payload); // 서버에서 메세지를 수신하면 동작할 콜백 함수
            });
        },
        // 연결 실패 시 에러 처리
        onStompError: async (frame) => {

            const errorCode = frame.headers['message'];

            // 토큰 인증 실패인 경우 reissue 시도
            if(errorCode === 'UNAUTHORIZED') {

                if(await auth.reissue()) {
                    stompClient.deactivate(); // 기존 연결 해제
                    await connectStomp(roomId, memberId, onMessageReceived); // 연결 재시도
                }

            }else {
                // 인증 오류가 아니라면 채팅방 목록으로 페이지 이동
                globalStore.alert.openAlert('서버 오류입니다 다시 시도해주세요.');
                globalStore.router.push('/chatRoomList');
            }

        },
    });

    // STOMP 연결 시도
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