import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/stores/authStore";
import globalStore from "@/stores/globalStore";

const auth = useAuthStore();
let stompClient = null;
let retry = true;

export const connectStomp = async (roomId, onMessageReceived) => {

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8090/ws"), // WebSocket 객체 생성
        connectHeaders: {
            Authorization: `Bearer ${auth.member.accessToken}` // CONNECT 프레임에 토큰 포함
        },
        reconnectDelay: 0, // 자동 재연결 비활성화 
        // heartbeatIncoming: 4000, // 서버에서 하트비트를 받는 주기 (좀 더 찾아봐야함)
        // heartbeatOutgoing: 4000, // 서버로 하트비트를 보내는 주기 (좀 더 찾아봐야함)
        // debug: (message) => console.log('[STOMP DEBUG]', message), // 디버깅용

        // 연결 성공 시 자동으로 실행되는 콜백
        onConnect: () => {

            // 클라이언트별 에러 큐 구독
            // stompClient.subscribe(`/user/${auth.member.id}/queue/errors`, (frame) => {
            //     const response = JSON.parse(frame.body);
            //     globalStore.alert.openAlert(response.errorMessage);
            //     globalStore.router.push('/chatRoomList');
            // });

            // 입장한 채팅방 에러 처리용 채널 구독
            stompClient.subscribe(`/sub/chat/${roomId}/errors`, (frame) => {
                const response = JSON.parse(frame.body);
                console.log(response);
                if(response.memberId === auth.member.id) {
                    globalStore.alert.openAlert(response.errorMessage);
                    globalStore.router.push('/chatRoomList');
                }
            });

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
            if(errorCode === 'UNAUTHORIZED' && retry) {
                retry = false; // 최초 1회만 재시도
                if(await auth.reissue()) {
                    retry = true; // 재발급 성공 시 retry 원복
                    stompClient.deactivate(); // 기존 연결 해제
                    await connectStomp(roomId, onMessageReceived); // 연결 재시도
                    globalStore.alert.openAlert('잠시 후 다시 시도해주세요');
                }

            }else {
                // 인증 오류가 아니라면 채팅방 목록으로 페이지 이동
                globalStore.alert.openAlert('서버 오류입니다 다시 시도해주세요.');
                globalStore.router.push('/chatRoomList');
                retry = true;
            }

        },
    });

    // STOMP 연결 시도
    stompClient.activate();
};

// 메세지 전송
export const sendMessage = async (roomId, message) => {

    // 연결 상태 확인
    if(!stompClient || !stompClient.connected) {
        globalStore.alert.openAlert('서버와 접속이 끊어졌습니다');
        globalStore.router.push('/chatRoomList');
        return;
    }

    const payload = {
        messageType: 'TALK', 
        roomId: roomId, 
        memberId: auth.member.id, 
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
    }
};
