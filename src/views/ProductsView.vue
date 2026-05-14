<template>
  <div>
    <h1 style="text-align: center">產品列表</h1>

    <!-- 成功提示訊息 -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div class="card-container">
      <div v-if="dataStore.isLoading" class="loading-wrap">
        <div class="loading-box">
          <div class="spinner"></div>
          <p>正在載入產品資料...</p>
        </div>
      </div>

      <template v-else>
        <div
          v-for="item in dataStore.items"
          :key="item.id"
          class="attraction-card"
        >
          <!-- 圖片 -->
          <div class="image-wrapper">
            <span class="tag">{{ item.category }}</span>
            <img :src="formatImageUrl(item.mainImageUrl)" :alt="item.title" />
          </div>

          <!-- 內容 -->
          <div class="content-wrapper">
            <h2 class="title">{{ item.title }}</h2>

            <p class="description">
              {{ item.description }}
            </p>

            <!-- 價格 -->
            <div class="price-info">
              <span class="price">${{ item.price || 0 }}</span>
            </div>

            <!-- 按鈕 -->
            <div class="button-group">
              <button
                class="more-btn add-cart"
                @click="addToCart(item)"
                :disabled="cartStore.isLoading"
              >
                {{ cartStore.isLoading ? "加入中..." : "加入購物車" }}
              </button>
              <button class="more-btn">查看詳情</button>
            </div>
          </div>
        </div></template
      >
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useProductsStore } from "@/stores/productsData";
import { useCartStore } from "@/stores/cartData";
const dataStore = useProductsStore();
const cartStore = useCartStore();
const currentDate = ref(new Date().toISOString().split("T")[0]);
const successMessage = ref("");

onMounted(() => {
  dataStore.fetchProducts();
});

const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x300";
  return url;
};

const addToCart = async (product) => {
  try {
    // 兼容不同後端欄位命名
    const productId =
      product.id ??
      product.productId ??
      product.productID ??
      product.ID ??
      product.Id;

    // 構建購物車 payload
    const payload = {
      productId: productId,
      quantity: 1,
    };

    if (!productId) {
      console.error("無法取得 productId，產品資料:", product);
      alert("無法取得產品 ID，請檢查產品數據");
      return;
    }

    await cartStore.addItemToCart(payload);

    // 顯示成功消息
    successMessage.value = `${product.title} 已加入購物車！`;
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("加入購物車失敗 - 完整錯誤:", error);
    console.error("錯誤響應:", error.response);
    alert("加入購物車失敗，請確保已登入。詳細信息請查看瀏覽器控制台");
  }
};
</script>

<style scoped>
/* 成功提示訊息 */
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 核心容器：確保它是 Flex 佈局 */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px;
  /* background-color: #f8f9fa; */
  border-radius: 20px;
  min-height: 400px; /* 給一個最小高度，避免跳動 */
  justify-content: center; /* 讓卡片在中間 */
}

/* 修正：Loading 包裹器 */
.loading-wrap {
  width: 100%;
  /* 使用 min-height 確保在大螢幕下也有足夠的存在感 */
  /* calc(100vh - 200px) 可以根據你的導覽列高度調整，讓它垂直居中於視窗 */
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 避免在 flex 容器中被擠壓 */
  flex-basis: 100%;
}

/* 強化 Loading Box 視覺 */
.loading-box {
  text-align: center;
  color: #666;
  padding: 40px;
}

/* 卡片主體：固定寬度或最大寬度 */
.attraction-card {
  flex: 0 1 380px; /* 不放大，可縮小，基準寬度 380px */
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column; /* 讓內容垂直排列 */
}

.image-wrapper img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

.content-wrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 讓內容填滿剩餘空間 */
}

.category-badge {
  align-self: flex-start; /* 讓標籤維持原大小不拉長 */
  background-color: #f1f3f5;
  color: #495057;
  padding: 4px 16px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 12px;
}

.title {
  font-size: 1.6rem;
  margin: 0 0 16px 0;
  color: #212529;
  font-weight: 600;
}

.description {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* 推擠按鈕到底部 */
}

/* 價格信息 */
.price-info {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e74c3c;
}

/* 按鈕組 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto; /* 推到底部 */
}

.more-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.more-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.more-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.add-cart {
  background-color: #27ae60;
}

.add-cart:hover:not(:disabled) {
  background-color: #229954;
}

/* 旋轉動畫 */
.spinner {
  width: 50px; /* 稍微加大一點，在大螢幕更明顯 */
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.image-wrapper {
  position: relative;
}

.date-info {
  font-size: 0.9rem;
  margin-bottom: 12px;
  color: #555;
}

.text-danger {
  color: #e74c3c;
}

.more-btn.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
