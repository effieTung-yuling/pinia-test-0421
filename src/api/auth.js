import req from "./index"; // 引用你設定好位址的實例

// 登入 API
export const loginAPI = (payload) => {
  return req.post("/api/Members/login", payload);
};

// 根據 ID 獲取用戶資訊
export const fetchLoginById = (id) => req.get(`/api/Members/login/${id}`);

// 獲取所有會員資料（需要 Admin 權限）
export const fetchAllMembers = () => req.get("/api/Members");

// 獲取特定會員資料
export const fetchMemberById = (id) => req.get(`/api/Members/${id}`);

// 更新會員資料（需要 token 驗證）
export const updateMember = (id, payload) =>
  req.put(`/api/Members/${id}`, payload);

// 刪除會員（需要 Admin 權限）
export const deleteMember = (id) => req.delete(`/api/Members/${id}`);
