import axios from 'axios';
import { useAuthStore } from './auth.js';
import globalStore from '../stores/globalStore.js';

const customAxios = () => {
    const instance = axios.create();
    const auth = useAuthStore();
    const env = import.meta.env;

    const BASE_URL = 
        env.MODE === 'development' ? env.VITE_LOCAL_SERVER : '';

    instance.interceptors.request.use(
        (config) => {
            const path = config.url;
            config.url = BASE_URL + path;

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
                    
                    // 토큰 재발급 성공 시 Authorization 값 변경
                    error.config.headers['Authorization'] = `Beaer ${auth.member.accessToken}`
                    
                    // 재요청 시 상대 경로로 요청하기 위해 BASE_URL 값 제거
                    const path = error.config.url.replace(BASE_URL, '');
                    error.config.url = path;

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