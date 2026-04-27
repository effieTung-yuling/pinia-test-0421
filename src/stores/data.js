import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataStore = defineStore("data", () => {
  const items = ref([]);
  const isLoading = ref(false); // 新增這行

  async function fetchProducts() {
    isLoading.value = true; // 開始抓取時設為 true
    try {
      const response = await fetch(
        "https://southerntravel.onrender.com/api/Attractions",
      );
      if (!response.ok) throw new Error("網路回應不正常");
      const data = await response.json();
      items.value = data;
    } catch (error) {
      console.error("API 抓取失敗:", error);
    } finally {
      isLoading.value = false; // 無論成功或失敗，結束後設為 false
    }
  }

  return { items, isLoading, fetchProducts };
});
