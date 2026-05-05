import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchProducts as fetchProductsAPI } from "@/api/products";

export const useProductsStore = defineStore("products", () => {
  const items = ref([]);
  const isLoading = ref(false); // 新增這行

  async function fetchProducts() {
    isLoading.value = true; // 開始抓取時設為 true
    try {
      const response = await fetchProductsAPI();
      items.value = response.data;
    } catch (error) {
      console.error("API 抓取失敗:", error);
    } finally {
      isLoading.value = false; // 無論成功或失敗，結束後設為 false
    }
  }

  return { items, isLoading, fetchProducts };
});
