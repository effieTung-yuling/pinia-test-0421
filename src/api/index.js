// src/api/index.js
import axios from "axios";

const req = axios.create({
  // 這裡就是放 API 位址的地方
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// 請求攔截器 - 自動添加 token 到請求頭
req.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 回應攔截器 - 處理 401 未授權
req.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除本地存儲並重定向到登入
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      // 可選：重定向到登入頁面
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default req;
