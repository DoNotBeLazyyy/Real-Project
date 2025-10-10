import { useUserStore } from '@store/useUserStore';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const serializeSortParams = (params: AxiosRequestConfig['params']): string => {
    const searchParams = new URLSearchParams();

    Object.keys(params)
        .forEach((key) => {
            if (typeof params[key] === 'object') {
                searchParams.append(key, JSON.stringify(params[key]));
            } else {
                searchParams.append(key, params[key]);
            }
        });

    return searchParams.toString();
};

export const CustomAxios = {
    axiosInstance: axios.create({
        baseURL: import.meta.env.BASE_URL
    }),
    setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = useUserStore.getState().token;

                config.headers = {
                    ...(config.headers as Record<string, string>)
                } as AxiosRequestHeaders;

                if (token) {
                    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    useUserStore.getState()
                        .clearSession();
                    window.location.href = '/account/login';
                }
                return Promise.reject(error);
            }
        );
    },
    get<T>(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.get<T>(url, config);
    },
    getWithSort<T>(url: string, params: AxiosRequestConfig['params'], config?: AxiosRequestConfig) {
        return this.axiosInstance.get<T>(url, {
            ...config,
            params,
            paramsSerializer: serializeSortParams
        });
    },
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.axiosInstance.post<T>(url, data, config);
    },
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.axiosInstance.put<T>(url, data, config);
    },
    delete<T>(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.delete<T>(url, config);
    },
    postForm<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.axiosInstance.postForm<T>(url, data, config);
    },
    putForm<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.axiosInstance.putForm<T>(url, data, config);
    }
};

CustomAxios.setupInterceptors();