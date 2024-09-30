import axios from 'axios';
import { useAuthStore } from './auth.js';
import globalStore from '../stores/globalStore.js';

const customAxios = () => {
    const instance = axios.create();
    const auth = useAuthStore();

    instance.interceptors.request.use(
        (config) => {
            globalStore.spinner.startSpinner();
            const accessToken = auth.member.accessToken;
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            globalStore.spinner.stopSpinner();
            return response;
        },
        async (error) => {
            if(error?.status === 401) {
                if(await auth.reissue()) {
                    return await instance(error.config);
                }else {
                    globalStore.spinner.stopSpinner();
                    return Promise.reject();
                }
            }else {
                globalStore.spinner.stopSpinner();
                globalStore.alert.openAlert(error.response.data.errorMessage);
                return Promise.reject();
            }
        }
    );

    return instance;
};

export default customAxios;