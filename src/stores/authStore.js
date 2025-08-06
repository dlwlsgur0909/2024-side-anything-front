import { defineStore } from 'pinia';
import axios from 'axios';
import globalStore from './globalStore.js';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
		member: null,
        isLogin: false // 로그인 여부
    }),
    actions: {
        setMember(member) {
            this.member = member;
            if(member === null) {
				this.isLogin = false;
				localStorage.removeItem("ACCESS");
            }else {
				this.isLogin = true;
				const item = {
					accessToken: member.accessToken,
					expiration: new Date().getTime() + (60 * 60 * 1000)
				}
				localStorage.setItem('ACCESS', JSON.stringify(item));
            }
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
			globalStore.router.push('/login');
        },
		// 토큰 재발급 / 새로고침
        async reissue() {

			let result = false;
			
			await axios
				.post("/auth/reissue")
				.then(res => {
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					this.setMember(null);
					result = false;
				});

			return result;
        },
		// 소셜 로그인
		async socialLogin() {

			let result = false;

			await axios
				.post('/auth/login-success')
				.then(res => {
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					this.logout();
					globalStore.alert.openAlert(e.response.data.errorMessage);
				})

			return result;
		},
		// 소셜 회원가입
		async socialJoin(data) {
			await axios
				.patch('/auth/social-join', data)
				.then(res => {
					this.setMember(res.data);
					globalStore.router.push('/');
				})
				.catch(e => {
					globalStore.alert.openAlert(e.response.data.errorMessage);
				})
		},
		// LocalStorage 토큰 만료 검증
		checkExpiration() {
		    
			let result = false;

			if(!!localStorage.getItem('ACCESS')) {
				const now = new Date().getTime();
  				const expiration = JSON.parse(localStorage.getItem('ACCESS')).expiration;

				result = expiration > now;
			}
			
			return result;
		}

    }

})