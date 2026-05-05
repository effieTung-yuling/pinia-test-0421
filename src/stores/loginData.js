import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { loginAPI } from "@/api/auth";

export const useLoginStore = defineStore("auth", () => {
  const userData = ref(null);
  const isLoading = ref(false);
  const isLoggedIn = computed(() => !!userData.value);

  async function login(payload) {
    isLoading.value = true;
    try {
      // 直接調用 API 函式，Axios 失敗會自動進入 catch
      const response = await loginAPI(payload);

      // 注意：Axios 回傳的資料通常在 response.data
      userData.value = response.data;

      // 可以在這裡存 Token 到 localStorage
      // localStorage.setItem('token', response.data.token);

      return response.data;
    } catch (error) {
      console.error("登入發生錯誤:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    userData.value = null;
    // localStorage.removeItem('token');
  }

  return { userData, isLoading, isLoggedIn, login, logout };
});
