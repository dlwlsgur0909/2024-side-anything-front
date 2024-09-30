import { defineStore } from 'pinia';

export const useAlertStore = defineStore({
    id: 'alert',
    state: () => ({
		isOpen: false,
		message: '',
		icon: null,
		isConfirm: true,
    }),
    actions: {
		openAlert(message, icon, isConfirm) {
			this.isOpen = true;
			this.message = message;

			if(!icon) {
				this.icon = null;
			}else {
				this.icon = icon;
			}

			if(isConfirm === false) {
				this.isConfirm = false;
			}else {
				this.isConfirm = true;
			}

		},
        confirmAlert() {
            this.isOpen = false;
			this.message = '';
			this.icon = '';
			this.isConfirm = true;
		}
    }

})