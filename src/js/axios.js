import axios from 'axios';
import { useAuthStore } from './auth.js';
import globalRouter from '../router/globalRouter.js';

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

            if(error.response.data?.errorMessage === 'UNAUTHORIZED') {
                if(await auth.reissue()) {
                    return await instance(error.config);
                }else {
                    
                    globalRouter.router.push('/login');
                }
            }else {
                return Promise.reject(error);
            }
        }
    );

    return instance;
};

export default customAxios;