import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "@/api/cart";

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeCartItem(item, index = 0) {
  if (!item || typeof item !== "object") {
    return {
      id: `unknown-${index}`,
      productName: "未命名產品",
      price: 0,
      quantity: 1,
    };
  }

  return {
    id: item.id ?? item.cartItemId ?? item.productId ?? `item-${index}`,
    productName: item.productName ?? item.title ?? item.name ?? "未命名產品",
    price: toNumber(item.price, 0),
    quantity: toNumber(item.quantity ?? item.qty, 1),
    raw: item,
  };
}

function normalizeCartResponse(payload) {
  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizeCartItem(item, index));
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidates = [
    payload.items,
    payload.cartItems,
    payload.data,
    payload.result,
    payload.rows,
  ];

  const list = candidates.find((candidate) => Array.isArray(candidate));
  if (Array.isArray(list)) {
    return list.map((item, index) => normalizeCartItem(item, index));
  }

  // 兼容後端直接回傳單一購物車項目的情況
  if (payload.id || payload.cartItemId || payload.productId) {
    return [normalizeCartItem(payload, 0)];
  }

  return [];
}

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const isLoading = ref(false);

  // 計算購物車總價
  const totalPrice = computed(() => {
    if (!Array.isArray(cartItems.value)) return 0;
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity || 0);
    }, 0);
  });

  // 計算購物車項目總數
  const totalQuantity = computed(() => {
    if (!Array.isArray(cartItems.value)) return 0;
    return cartItems.value.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);
  });

  // 獲取購物車資料（需要 token 驗證）
  async function fetchCartData() {
    isLoading.value = true;
    try {
      const response = await fetchCart();
      cartItems.value = normalizeCartResponse(response.data);
    } catch (error) {
      console.error("獲取購物車失敗:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // 添加項目到購物車（需要 token 驗證）
  async function addItemToCart(payload) {
    isLoading.value = true;
    try {
      const response = await addCartItem(payload);
      // 重新獲取購物車資料以更新本地狀態
      await fetchCartData();
      return response.data;
    } catch (error) {
      console.error("添加購物車項目失敗:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // 更新購物車項目（需要 token 驗證）
  async function updateItem(itemId, payload) {
    isLoading.value = true;
    try {
      const response = await updateCartItem(itemId, payload);
      // 重新獲取購物車資料以更新本地狀態
      await fetchCartData();
      return response.data;
    } catch (error) {
      console.error("更新購物車項目失敗:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // 刪除購物車項目（需要 token 驗證）
  async function removeItem(itemId) {
    isLoading.value = true;
    try {
      await deleteCartItem(itemId);
      // 重新獲取購物車資料以更新本地狀態
      await fetchCartData();
    } catch (error) {
      console.error("刪除購物車項目失敗:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // 清空購物車
  function clearCart() {
    cartItems.value = [];
  }

  return {
    cartItems,
    isLoading,
    totalPrice,
    totalQuantity,
    fetchCartData,
    addItemToCart,
    updateItem,
    removeItem,
    clearCart,
  };
});
