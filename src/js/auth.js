import { defineStore } from 'pinia';
import axios from 'axios';
import globalStore from '../stores/globalStore.js';

export const useAuthStore = defineStore({
	
    id: 'auth',
    state: () => ({
		member: null,
		// isLogin: false,
        // member: JSON.parse(localStorage.getItem('member')), // 로그인 한 사용자 정보 (accessToken, name, username)
        isLogin: !!localStorage.getItem('ACCESS'), // 로그인 여부
		reissued: false, // 토큰 재발급 여부
    }),
    actions: {
        setMember(member) {
            this.member = member;
			console.log('setMember');
			console.log(member);
            if(member === null) {
				this.isLogin = false;
            }else {
				this.isLogin = true;
				this.reissued = false;
				localStorage.setItem('ACCESS', member.accessToken)
				// localStorage.setItem('member', JSON.stringify(member)); // membber를 저장하지 않고 토큰으로 분기 하도록 수정??? App에서도 reissue 로직 수정해야함
				// 새로고침하면 router에서 먼저 isLogin 값을 확인하는데 false라 로그인 페이지로 이동함함
            }
			console.log(this.isLogin);
        },
		// 로그인 
        login(data, onSuccess, onReject) {
            axios
				.post("/auth/login", data)
				.then(res => {
					onSuccess(res.data);
				})
				.catch(e => {
					onReject(e);
				})
        },
		// 로그아웃
        logout() {

			axios
				.post('/auth/logout')
				.then(res => {
				})
				.catch(e => {
				})

			this.setMember(null);
			localStorage.removeItem('ACCESS');
			globalStore.router.push('/login');
        },
		// 토큰 재발급 / 새로고침
        async reissue() {
			console.log("reissued")
			let result = false;
			
			await axios
				.post("/auth/reissue")
				.then(res => {
					console.log(res.data);
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					this.logout();
					this.reissued = true;
					globalStore.alert.openAlert(e.response.data.errorMessage);
					globalStore.router.push('/login');
				});

			return result;
        },
		// 소셜 로그인
		async socialLogin() {

			let result = false;

			await axios
				.get('/auth/login-success')
				.then(res => {
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					this.logout();
					this.reissued = false;
				})

			return result;
		}
    }

})