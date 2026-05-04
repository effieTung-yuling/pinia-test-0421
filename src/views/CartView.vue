<template>
  <div>
    <h1 style="text-align: center">購物車清單</h1>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const cartItems = ref([]);
const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.qty, 0)
);
</script>