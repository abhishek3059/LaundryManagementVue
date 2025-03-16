import { createApp } from "vue"; // Use named import for Vue 3
import App from "./App.vue";
import router from "./router";
import store from "./store"; // Import your Vuex store
import Toast, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// Create the Vue app
const app = createApp(App);

// Use the router and store
app.use(router);
app.use(store);
app.use(toast, {
  autoClose: 3000,
  position: "bottom-right",
  theme: "light",
  hideProgressBar: true,
});

// Mount the app
app.mount("#app");
