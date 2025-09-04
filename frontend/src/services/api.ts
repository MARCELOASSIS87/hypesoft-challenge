// src/services/api.ts
import axios, { type AxiosRequestHeaders } from 'axios';
import { keycloak } from '@/lib/keycloak';

// Em dev usamos o proxy do Vite (/api -> backend). Pode sobrescrever via .env
const baseURL = (import.meta.env.VITE_API_URL as string | undefined) || '/api';

const api = axios.create({ baseURL });

// Anexa o token do Keycloak sem brigar com os tipos do Axios
api.interceptors.request.use((config) => {
  if (keycloak?.authenticated && keycloak.token) {
    const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${keycloak.token}`;
    config.headers = headers;
  }
  return config;
});

export default api;
