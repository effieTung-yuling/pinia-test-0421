import req from "./index"; // 引用你設定好位址的實例
export const fetchProducts = (payload) => {
  // 直接回傳 axios 的 promise，它會幫你處理 JSON 轉換和 status check
  return req.get("/api/Products", payload);
};
export const fetchProductById = (id) => req.get(`/api/Products/${id}`);
