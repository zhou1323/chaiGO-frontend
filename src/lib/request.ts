'use client';
import { paths } from '@/paths';
import axios from 'axios';
import { getToken, removeToken } from './token';
import { convertToCamel } from './utils';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 5000,
});

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    response.data = convertToCamel(response.data);
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      removeToken();

      window.location.href = paths.auth.signIn;
    }
    return Promise.reject(error);
  }
);

export default request;
