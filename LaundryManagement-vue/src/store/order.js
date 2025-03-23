import api from "@/utils/api";
import { toast } from "vue3-toastify";

const state = {
  currentOrder: null,
  orders: {}, // Normalized state: { [orderId]: order }
  statuses: ["PENDING", "PROCESSING", "COMPLETED", "DELIVERED"],
};

const mutations = {
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  SET_ORDERS(state, orders) {
    state.orders = orders.reduce((acc, order) => {
      acc[order.id] = order;
      return acc;
    }, {});
  },
  UPDATE_ORDER(state, order) {
    state.orders[order.id] = order;
  },
};

const actions = {
  async createOrder({ commit }, orderData) {
    try {
      const response = await api.post("/orders", orderData);
      commit("SET_CURRENT_ORDER", response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create order");
      throw error.response.data;
    }
  },
  async fetchOrdersFromBackend({ commit }) {
    try {
      const response = await api.get("/orders/get-orders");
      commit("SET_ORDERS", response.data);
      return response;
    } catch (error) {
      toast.error("Failed to fetch orders");
      throw error;
    }
  },
  async updateOrderStatus({ commit }, orderId, status) {
    try {
      const response = await api.put(
        `/orders/${orderId}/status?status=${status}`
      );
      console.log("inside update order" + response.data);
      commit("UPDATE_ORDER", response.data);
      return response.data;
    } catch (error) {
      toast.error("Failed to update order status");
      throw error;
    }
  },
};

const getters = {
  ordersList: (state) => Object.values(state.orders),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
