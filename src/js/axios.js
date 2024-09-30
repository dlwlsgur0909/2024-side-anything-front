import axios from 'axios';
import { useAuthStore } from './auth.js';
import globalStore from '../stores/globalStore.js';

const customAxios = () => {
    const instance = axios.create();
    const auth = useAuthStore();

    instance.interceptors.request.use(
        (config) => {
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
            return response;
        },
        async (error) => {
            if(error?.status === 401) {
                if(await auth.reissue()) {
                    return await instance(error.config);
                }else {
                    return Promise.reject();
                }

            }else {
                globalStore.alert.openAlert(error.response.data.errorMessage);
                return Promise.reject();
            }
        }
    );

    return instance;
};

export default customAxios;