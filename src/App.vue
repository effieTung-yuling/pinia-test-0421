<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

// 模擬登入狀態與購物車數量（實務上建議從 Pinia Store 取得）
const isAuthenticated = ref(false);
const cartCount = ref(0);

const logout = () => {
  isAuthenticated.value = false;
  // 導向首頁或執行登出邏輯
};
</script>

<template>
  <div class="app-container">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/attractions">景點列表</RouterLink>

        <RouterLink to="/products">商品列表</RouterLink>

        <RouterLink to="/cart" class="cart-link">
          購物車 <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </RouterLink>

        <RouterLink v-if="!isAuthenticated" to="/login">登入</RouterLink>
        <a v-else href="#" @click.prevent="logout">登出</a>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
    <div class="footer" style="text-align: center; margin-top: 16px">
      <p>
        本網站僅供個人作品使用，不提供商業用途<br />
        資料來源<br /><a href="https://www.taiwan.net.tw/" target="_blank"
          >臺灣觀光資訊網</a
        >
        <br /><a href="https://www.swcoast-nsa.gov.tw/zh-tw" target="_blank"
          >雲嘉南濱海國家風景區管理處網站</a
        >
        <br /><a href="https://khh.travel/" target="_blank">高雄旅遊網</a>、<a
          href="https://travel.chiayi.gov.tw/"
          target="_blank"
          >嘉義市觀光旅遊網</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  border-bottom: 1px solid #ddd;
}

.logo {
  display: block;
  width: 40px;
  height: 40px;
}

nav {
  display: flex;
  gap: 1.5rem; /* 讓連結之間有固定間距 */
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
}

nav a.router-link-active {
  color: #42b883; /* 啟動中的連結顏色 */
}

/* 購物車數字小紅點 */
.badge {
  background-color: #ff4d4f;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.75rem;
  vertical-align: top;
  margin-left: -4px;
}

:global(body) {
  padding-top: 70px;
  margin: 0;
}
</style>
