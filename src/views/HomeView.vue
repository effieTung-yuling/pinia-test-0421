<template>
  <div>
    <AttractionView />
    <br />
    <ProductsView />
  </div>
</template>

<script setup>
// 2. 元件通常是「預設匯出」(export default)，不需要加花括號 {}
import { onMounted } from "vue";;
import AttractionView from "./AttractionView.vue";
import ProductsView from "./ProductsView.vue";


</script>
