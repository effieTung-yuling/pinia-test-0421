import { useLoginStore } from "@/stores/loginData";

/**
 * 檢查用戶是否已登入
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const authStore = useLoginStore();
  return authStore.isLoggedIn;
};

/**
 * 檢查用戶是否為 Admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const authStore = useLoginStore();
  return authStore.isAdmin;
};

/**
 * 檢查用戶是否有權限訪問某個資源
 * @param {string} requiredRole - 所需的角色 (e.g., 'Admin')
 * @returns {boolean}
 */
export const hasRole = (requiredRole) => {
  const authStore = useLoginStore();
  return authStore.userData?.memberType === requiredRole;
};

/**
 * 在執行 API 前檢查權限（用於管理員操作）
 * @param {Function} apiFunction - API 函數
 * @param {Array} args - API 函數的參數
 * @returns {Promise}
 */
export const executeWithAdminCheck = async (apiFunction, args = []) => {
  if (!isAdmin()) {
    throw new Error("權限不足：需要 Admin 角色");
  }
  return apiFunction(...args);
};

/**
 * 在執行 API 前檢查認證
 * @param {Function} apiFunction - API 函數
 * @param {Array} args - API 函數的參數
 * @returns {Promise}
 */
export const executeWithAuthCheck = async (apiFunction, args = []) => {
  if (!isAuthenticated()) {
    throw new Error("請先登入");
  }
  return apiFunction(...args);
};
