import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        member: JSON.parse(localStorage.getItem('member')),
        isLogin: false
    }),
    actions: {
        setMember(member) {
            this.member = member;
            localStorage.setItem('member', JSON.stringify(member));
            if(member === null) {
                this.isLogin = false;
            }else {
                this.isLogin = true;
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
            localStorage.removeItem('member');
            this.setMember(null);
        }
    }

})