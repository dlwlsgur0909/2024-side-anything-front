import axios from 'axios';
import { useAuthStore } from '../stores/authStore.js';
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
            
            if(config.method !== 'get') {
                globalStore.spinner.startSpinner();
            }
            
            const accessToken = localStorage.getItem('ACCESS');
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

                // responseType이 blob인 경우 에러 메세저 JSON으로 변환
                if(error.response.data instanceof Blob) {
                    const text = await error.response.data.text();
                    const errorMessage = JSON.parse(text).errorMessage;
                    globalStore.alert.openAlert(errorMessage);
                }else {
                    globalStore.alert.openAlert(error.response.data.errorMessage);
                }

                globalStore.spinner.stopSpinner();
                return Promise.reject();
            }
        }
    );

    return instance;
};

export default customAxios;