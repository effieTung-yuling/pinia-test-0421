import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProductsView from "../views/ProductsView.vue";
import AttractionView from "../views/AttractionView.vue";
import CartView from "../views/CartView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/attractions",
      name: "attractions",
      component: AttractionView,
    },
    {
      path: "/products",
      name: "products",
      // 建議：將原本 Nav 上的 Login 改為商品列表
      component: ProductsView,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    // 如果使用者輸入不存在的網址，可以導向 404 或首頁
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
