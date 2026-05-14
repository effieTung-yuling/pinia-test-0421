import req from "./index"; // 引用你設定好位址的實例

// 獲取購物車資料（需要 token 驗證）
export const fetchCart = () => req.get("/api/Cart");

// 添加項目到購物車（需要 token 驗證）
export const addCartItem = (payload) => req.post("/api/Cart/items", payload);

// 更新購物車項目（需要 token 驗證）
export const updateCartItem = (itemId, payload) =>
  req.put(`/api/Cart/items/${itemId}`, payload);

// 刪除購物車項目（需要 token 驗證）
export const deleteCartItem = (itemId) =>
  req.delete(`/api/Cart/items/${itemId}`);
