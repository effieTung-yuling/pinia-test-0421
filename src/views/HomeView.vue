<template>
  <div>
    <AttractionView />
    <br />
    <ProductsView />
  </div>
</template>

<script setup>
// 2. 元件通常是「預設匯出」(export default)，不需要加花括號 {}
import { onMounted } from "vue";
import { useCounterStore } from "@/stores/counter";
import { useDataStore } from "@/stores/data";
import AttractionView from "./AttractionView.vue";
import ProductsView from "./ProductsView.vue";

const counterStore = useCounterStore();
const dataStore = useDataStore();

// 注意：如果 dataStore.items 一開始是空的，這裡印出來會是初始值
console.log(dataStore.items);
console.log(counterStore.count);

onMounted(() => {
  dataStore.fetchProducts();
});
</script>
