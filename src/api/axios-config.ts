import baseAxios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

import { API_URL } from '@/constants';
import { getMockedApiResponse } from '@/mocks';

const api = baseAxios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config: { method = '', url = '', data = '' } = {} } = error?.response || error;

    return Promise.resolve(
      getMockedApiResponse({
        method,
        url,
        data,
      } as Required<InternalAxiosRequestConfig>)
    );
  }
);

export const doGet = <T = any>(url: string, options?: AxiosRequestConfig) =>
  api.get<T>(url, options);
export const doPost = <T = any, P = any>(url: string, data: P, options?: AxiosRequestConfig) =>
  api.post<T>(url, data, options);
export const doPatch = <T = any, P = any>(url: string, data: P, options?: AxiosRequestConfig) =>
  api.patch<T>(url, data, options);
export const doPut = <T = any, P = any>(url: string, data: P, options?: AxiosRequestConfig) =>
  api.put<T>(url, data, options);
export const doDelete = <T = any>(url: string, options?: AxiosRequestConfig) =>
  api.delete<T>(url, options);
