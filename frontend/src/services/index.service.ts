import axios, { AxiosRequestConfig } from 'axios';

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