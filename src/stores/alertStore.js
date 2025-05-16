import { defineStore } from 'pinia';

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
		isOpen: false,
		message: '',
		icon: null,
    }),
    actions: {
		openAlert(message, icon) {
			this.isOpen = true;
			this.message = message ? message : '경고창입니다';
			this.icon = icon ? icon : null;
		},
        closeAlert() {
            this.isOpen = false;
			this.message = '';
			this.icon = null;
		}
    }

})