import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomePage.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ServicesPage from "@/views/ServicesPage.vue";
import OrderCreationPage from "@/views/OrderCreationPage.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import store from "@/store";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/services", name: "Services", component: ServicesPage },
  {
    path: "/create-order",
    name: "Create Order",
    component: OrderCreationPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin-orders",
    name: "Admin Orders",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
// Minimal router guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const hasToken = !!localStorage.getItem("jwtToken");

  if (requiresAuth && !hasToken) {
    next("/login");
  } else {
    next();
  }
});

export default router;
