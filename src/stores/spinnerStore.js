import { defineStore } from 'pinia';

export const useSpinnerStore = defineStore({
    id: 'spinner',
    state: () => ({
		isLoading: false,
    }),
    actions: {
		startSpinner() {
			this.isLoading = true;
		},
    stopSpinner() {
      this.isLoading = false;
		}
    }
})