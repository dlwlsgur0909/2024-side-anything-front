import { defineStore } from 'pinia';
import axios from 'axios';
import globalStore from '../stores/globalStore.js';

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
				.post("/auth/login", data)
				.then(res => {
					onSuccess(res.data);
				})
				.catch(e => {
					onReject(e);
				})
        },
        logout() {

			axios.post('/auth/logout')
			.then(res => {
			})
			.catch(e => {
			})

			this.setMember(null);
			localStorage.removeItem('member');
			globalStore.router.push('/login');
        },
        async reissue() {

			const request = {
				refreshToken: this.member.refreshToken
			};

			let result = false;
			
			await axios
				.post("/auth/reissue", request)
				.then(res => {
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
		async socialLogin() {

			let result = false;

			await axios
				.get('/auth/login-success'
					// {withCredentials: true}
				)
				.then(res => {
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					console.log(e);
					this.logout();
					this.reissued = false;
				})

			return result;
		}
    }

})