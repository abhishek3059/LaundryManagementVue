import { createStore } from "vuex";
import order from "./order";
import services from "./services";
import auth from "./auth";

export default createStore({
  modules: {
    order,
    services,
    auth,
  },
});
