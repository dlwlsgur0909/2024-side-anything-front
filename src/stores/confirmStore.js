import { defineStore } from 'pinia';

export const useConfirmStore = defineStore({
    id: 'confirm',
    state: () => ({
		isOpen: false,
		message: '',
		callBack: null,
    }),
    actions: {
		openConfirm(message, callBack) {
			this.isOpen = true;
			this.message = message ? message : '확인창입니다';
			this.callBack = callBack;
		},
        closeConfirm() {
            this.isOpen = false;
			this.message = '';
			this.callBack = null;
		},
		onClickConfirm() {
			if(this.callBack) {
				this.callBack();
			}
			this.closeConfirm();
		}
    }

})