import { defineStore } from 'pinia';
import axios from 'axios';
import globalRouter from '../router/globalRouter.js';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        member: JSON.parse(localStorage.getItem('member')),
        isLogin: !!JSON.parse(localStorage.getItem('member')),
		reissued: false,
    }),
    actions: {
        setMember(member) {
            this.member = member;
            if(member === null) {
				this.isLogin = false;
            }else {
				this.isLogin = true;
				this.reissued = false;
				localStorage.setItem('member', JSON.stringify(member));
            }
        },
        login(data, onSuccess, onReject) {
            axios
				.post("http://localhost:8090/auth/login", data)
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
			globalRouter.router.push('/login');
        },
        async reissue() {

			const request = {
					refreshToken: this.member.refreshToken
			};

			let result = false;
			
			await axios
				.post("http://localhost:8090/auth/reissue", request)
				.then(res => {
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					this.logout();
					this.reissued = true;
					alert(e.response.data.errorMessage);
					globalRouter.router.push('/login');
				});

			return result;
        },
    }

})