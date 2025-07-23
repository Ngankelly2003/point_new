import { StorageKey } from "@/constants/storage-key";
import { debug } from "@/helpers/logger";
import { storageGet, storageRemove, storageSet } from "@/helpers/storage";
import { isExpired, refreshToken } from "@/helpers/token";
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const onResponse = (response: AxiosResponse): AxiosResponse => {
    const {method, url} = response.config;
    const {status} = response;
    // // Set Loading End Here
    // // Handle Response Data Here
    // // Error Handling When Return Success with Error Code Here
    // debug(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);
    return response;
};

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
        const {message} = error;
        const {method, url} = error.config as AxiosRequestConfig;
        const {status} = error.response as AxiosResponse ?? {};

        // debug(
        //     `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
        // );

        if (status === 401) {
            // "Login required"
            // Delete Token & Go To Login Page if you required.
            window.location.href = '/sign-out';
        }
    } else {
        // debug(`🚨 [API] | Error ${error.message}`);
    }

    return Promise.reject(error);
};

const onRequest = async (config: InternalAxiosRequestConfig) => {
    const {method, url, headers} = config;
    debug(`🚀 [HOST] ${API_URL} | [API] ${method?.toUpperCase()} ${url} | Request`);

    const token = storageGet(StorageKey.TOKEN);
    const refresh_token = storageGet(StorageKey.REFRESH_TOKEN);
    const expires = storageGet(StorageKey.EXPIRES);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }


    if (token && refresh_token && isExpired(expires)) {
        const response = await refreshToken(token, refresh_token)
        if (!response || !response?.success || !response?.result) {
            storageRemove(StorageKey.TOKEN)
            window.location.href = '/sign-out';
        } else {
            storageSet(StorageKey.TOKEN, response.result.access_token);
            storageSet(StorageKey.REFRESH_TOKEN, response.result.refresh_token);
            storageSet(StorageKey.EXPIRES, response.result.expires?.toString() ?? '');
            storageSet(StorageKey.USER, JSON.stringify(response.result.user));
        }
    }

    return config;
};

const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(onRequest, onErrorResponse);
    instance.interceptors.response.use(onResponse, onErrorResponse);
    return instance;
};

const axiosClient = setupInterceptors(axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
}));

export default axiosClient;