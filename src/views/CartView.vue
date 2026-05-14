<template>
  <div class="cart-container">
    <h1 style="text-align: center">購物車清單</h1>

    <div
      v-if="cartStore.cartItems.length === 0 && !cartStore.isLoading"
      class="empty-cart"
    >
      <p>購物車是空的</p>
      <router-link to="/products" class="back-link">返回購物</router-link>
    </div>

    <div v-else-if="cartStore.isLoading" class="loading-wrap">
      <div class="spinner"></div>
      <p>正在加載購物車...</p>
    </div>

    <div v-else class="cart-content">
      <table class="cart-table">
        <thead>
          <tr>
            <th>產品</th>
            <th>單價</th>
            <th>數量</th>
            <th>小計</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cartStore.cartItems"
            :key="item.id"
            class="cart-item"
          >
            <td class="product-name">{{ item.productName || "未命名產品" }}</td>
            <td class="price">${{ item.price || 0 }}</td>
            <td class="quantity">
              <input
                type="number"
                :value="item.quantity"
                min="1"
                @change="updateItemQuantity(item, $event)"
                class="qty-input"
              />
            </td>
            <td class="subtotal">
              ${{ (item.price || 0) * (item.quantity || 1) }}
            </td>
            <td class="action">
              <button
                class="delete-btn"
                @click="deleteItem(item)"
                :disabled="cartStore.isLoading"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <div class="summary-row">
          <span>小計：</span>
          <span>${{ cartStore.totalPrice }}</span>
        </div>
        <div class="summary-row">
          <span>運費：</span>
          <span>$0</span>
        </div>
        <div class="summary-row total">
          <span>總計：</span>
          <span>${{ cartStore.totalPrice }}</span>
        </div>
      </div>

      <div class="cart-actions">
        <router-link to="/products" class="btn btn-secondary">
          繼續購物
        </router-link>
        <button class="btn btn-primary" @click="checkout">結帳</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cartData";

const cartStore = useCartStore();
const route = useRoute();

const loadCart = async () => {
  try {
    await cartStore.fetchCartData();
  } catch (error) {
    console.error("讀取購物車失敗:", error);
  }
};

onMounted(() => {
  loadCart();
});

onActivated(() => {
  loadCart();
});

watch(
  () => route.fullPath,
  () => {
    loadCart();
  },
);

const updateItemQuantity = async (item, event) => {
  const newQuantity = parseInt(event.target.value, 10);
  if (newQuantity <= 0) return;

  try {
    const itemId = item.id ?? item.raw?.id ?? item.raw?.cartItemId;
    if (!itemId) return;
    await cartStore.updateItem(itemId, { quantity: newQuantity });
  } catch (error) {
    console.error("更新數量失敗:", error);
    alert("更新數量失敗");
  }
};

const deleteItem = async (item) => {
  if (!confirm("確認要刪除此項目？")) return;

  try {
    const itemId = item.id ?? item.raw?.id ?? item.raw?.cartItemId;
    if (!itemId) return;
    await cartStore.removeItem(itemId);
  } catch (error) {
    console.error("刪除項目失敗:", error);
    alert("刪除項目失敗");
  }
};

const checkout = () => {
  alert("結帳功能開發中...");
};
</script>

<style scoped>
.cart-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #2980b9;
}

.loading-wrap {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
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

.cart-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.cart-table th {
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

.cart-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #dee2e6;
}

.cart-item:hover {
  background-color: #f8f9fa;
}

.product-name {
  font-weight: 500;
  color: #212529;
}

.price {
  color: #e74c3c;
  font-weight: 500;
}

.quantity {
  text-align: center;
}

.qty-input {
  width: 60px;
  padding: 6px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-align: center;
}

.qty-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.subtotal {
  text-align: right;
  font-weight: 500;
  color: #212529;
}

.action {
  text-align: center;
}

.delete-btn {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c0392b;
}

.delete-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.cart-summary {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: right;
}

.summary-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  gap: 40px;
}

.summary-row span:first-child {
  font-weight: 500;
  color: #555;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #212529;
  border-top: 2px solid #dee2e6;
  padding-top: 16px;
  margin-top: 16px;
}

.cart-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background-color: #27ae60;
  color: white;
}

.btn-primary:hover {
  background-color: #229954;
}

.btn-secondary {
  background-color: #3498db;
  color: white;
}

.btn-secondary:hover {
  background-color: #2980b9;
}
</style>
