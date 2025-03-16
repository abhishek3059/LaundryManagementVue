import api from "@/utils/api";

const state = {
  currentOrder: null,
  orders: [],
  statuses: ["PENDING", "PROCESSING", "COMPLETED", "DELIVERED"],
};

const mutations = {
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  ADD_ORDER(state, order) {
    state.orders.push(order);
  },
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.find((o) => o.id === orderId);
    if (order) order.status = status;
  },
};

const actions = {
  async createOrder({ commit }, orderData) {
    try {
      const response = await api.post("/api/orders", orderData);
      commit("ADD_ORDER", response.data);
      commit("SET_CURRENT_ORDER", response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  async updateOrderStatus({ commit }, { orderId, status }) {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      commit("UPDATE_ORDER_STATUS", { orderId, status });
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
