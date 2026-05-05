// src/api/index.js
import axios from "axios";

const req = axios.create({
  // 這裡就是放 API 位址的地方
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

export default req;
