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
			this.message = message;

			if(!icon) {
				this.icon = null;
			}else {
				this.icon = icon;
			}

		},
        closeAlert() {
            this.isOpen = false;
			this.message = '';
			this.icon = '';
		}
    }

})