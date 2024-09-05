import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        member: JSON.parse(localStorage.getItem('member')),
        isLogin: !!JSON.parse(localStorage.getItem('member'))
    }),
    actions: {
        setMember(member) {
            this.member = member;
            if(member === null) {
							this.isLogin = false;
            }else {
							this.isLogin = true;
							localStorage.setItem('member', JSON.stringify(member));
            }
        },
        login(data, onSuccess, onReject) {
            axios
							.post("http://localhost:8080/auth/login", data)
							.then(res => {
								onSuccess(res.data);
							})
							.catch(e => {
								onReject(e);
							})
        },
        logout() {
					this.setMember(null);
					localStorage.removeItem('member');
        },
        async reissue() {

					const request = {
							refreshToken: this.member.refreshToken
					};

					let result = false;
					
					await axios
						.post("http://localhost:8080/auth/reissue", request)
						.then(res => {
							this.setMember(res.data);
							result = true;
						})
						.catch(e => {
							this.logout();
							alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
						});

					return result;
        },
    }

})