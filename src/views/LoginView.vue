<template>
  <div class="login-container">
    <h1 style="text-align: center">登入頁面</h1>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">電子信箱</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="請輸入 Email"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">密碼</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="請輸入密碼"
          :disabled="isLoading"
          required
        />
      </div>

      <!-- 修改按鈕：加入 Loading 判斷 -->
      <button type="submit" class="login-btn" :disabled="isLoading">
        <span v-if="isLoading">登入中...</span>
        <span v-else>登入</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"; // 引入 ref
import { useRouter } from "vue-router"; // 引入 useRouter
import { storeToRefs } from "pinia";
import { useLoginStore } from "@/stores/loginData";

const dataStore = useLoginStore();
const router = useRouter(); // 取得路由實例

const { email, password } = storeToRefs(dataStore);

// 1. 定義 Loading 狀態
const isLoading = ref(false);

const handleLogin = async () => {
  if (isLoading.value) return; // 防止重複點擊

  isLoading.value = true; // 開始 Loading
  try {
    await dataStore.login({
      email: email.value,
      password: password.value,
    });

    // 2. 登入成功後，使用 router.push 跳轉至首頁
    const redirectPath = router.currentRoute.value.query.redirect || "/";
    router.push(redirectPath);
  } catch (err) {
    alert("登入失敗：" + err.message);
  } finally {
    isLoading.value = false; // 無論成功或失敗都關閉 Loading
  }
};
</script>

<style scoped>
/* 保持你原本的樣式 */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 加上禁用狀態的樣式 */
.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.login-btn:hover:not(:disabled) {
  background-color: #45a049;
}
</style>