import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginAPI } from "@/api/auth";

export const useLoginStore = defineStore("auth", () => {
  const userData = ref(null);
  const token = ref(null);
  const isLoading = ref(false);
  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => userData.value?.memberType === "Admin");

  // 初始化 - 從 localStorage 恢復用戶資訊
  function initializeAuth() {
    const savedToken = localStorage.getItem("token");
    const savedUserData = localStorage.getItem("userData");
    if (savedToken) {
      token.value = savedToken;
    }
    if (savedUserData) {
      userData.value = JSON.parse(savedUserData);
    }
  }

  async function login(payload) {
    isLoading.value = true;
    try {
      const response = await loginAPI(payload);
      const data = response.data;

      // 保存 token 和用戶資料
      token.value = data.token;
      userData.value = {
        id: data.id,
        name: data.name,
        email: data.email,
        memberType: data.memberType,
      };

      // 存到 localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(userData.value));

      return data;
    } catch (error) {
      console.error("登入發生錯誤:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    userData.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  }

  return {
    userData,
    token,
    isLoading,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    initializeAuth,
  };
});
