import req from "./index"; // 引用你設定好位址的實例
export const loginAPI = (payload) => {
  // 直接回傳 axios 的 promise，它會幫你處理 JSON 轉換和 status check
  return req.post("/api/Members/login", payload);
};
export const fetchLoginById = (id) => req.get(`/api/Members/login/${id}`);
