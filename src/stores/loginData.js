import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useLoginStore = defineStore("auth", () => {
  const email = ref("");
  const password = ref("");
  const userData = ref(null); // 改為 null，方便判斷是否已登入
  const isLoading = ref(false);
  const isLoggedIn = computed(() => !!userData.value);
  // 增加參數接收前端傳進來的帳密
  async function login(payload) {
    isLoading.value = true;
    try {
      const response = await fetch(
        "https://southerntravel.onrender.com/api/Members/login",
        {
          method: "POST", // 登入通常使用 POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // 將 email, password 送出
        },
      );

      if (!response.ok) throw new Error("登入失敗，請檢查帳號密碼");

      const data = await response.json();
      userData.value = data; // 儲存回傳的使用者資料
      return data; // 回傳給組件處理後續跳轉
    } catch (error) {
      console.error("登入發生錯誤:", error);
      throw error; // 拋出錯誤讓 UI 也能顯示錯誤訊息
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    userData.value = null;
    email.value = "";
    password.value = "";
  }

  return { email, password, userData, isLoading, isLoggedIn, login, logout };
});
