<template>
  <div>
    <h1 style="text-align: center">產品列表</h1>
    <div class="card-container">
      <div v-if="dataStore.isLoading" class="loading-wrap">
        <div class="loading-box">
          <div class="spinner"></div>
          <p>正在載入景點資料...</p>
        </div>
      </div>

      <template v-else>        
         <div
          v-for="item in dataStore.items"
          :key="item.id"
          class="attraction-card"
        >
          <div class="image-wrapper">
            <img :src="formatImageUrl(item.mainImageUrl)" :alt="item.title" />
          </div>

          <div class="content-wrapper">
            <span class="category-badge">{{ item.category }}</span>
            <h2 class="title">{{ item.title }}</h2>
            <p class="description">{{ item.description }}</p>
            <button class="more-btn">查看更多</button>
          </div>
        </div></template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useProductsStore } from "@/stores/productsData";
const dataStore = useProductsStore();

onMounted(() => {
  dataStore.fetchProducts();
  console.log(dataStore.items);
});

const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x300";
  return url;
};
</script>

<style scoped>
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

.more-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: auto; /* 自動推到底部 */
}

.more-btn:hover {
  background-color: #2980b9;
}
.add-cart {
  background-color: #db3434;
  margin-bottom: 4px;
}
.add-cart:hover {
  background-color: #d75858;
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
</style>
