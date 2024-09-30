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
        async login(data, onSuccess, onReject) {
			globalStore.spinner.startSpinner();

            await axios
				.post("http://localhost:8090/auth/login", data)
				.then(res => {
					onSuccess(res.data);
				})
				.catch(e => {
					onReject(e);
				})
			
			globalStore.spinner.stopSpinner();
        },
        logout() {
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
				.post("http://localhost:8090/auth/reissue", request)
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
				.get('http://localhost:8090/auth/login-success',
					{withCredentials: true}
				)
				.then(res => {
					this.setMember(res.data);
					result = true;
				})
				.catch(e => {
					this.logout();
					this.reissued = false;
					globalStore.alert.openAlert(e.response.data.errorMessage);
					globalStore.router.push('/login');
				})

			return result;
		}
    }

})