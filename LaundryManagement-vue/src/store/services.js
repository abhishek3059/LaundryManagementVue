import api from "@/utils/api";

const state = {
  services: [],
  currentService: null,
};

const mutations = {
  SET_SERVICES(state, services) {
    state.services = services;
  },
  SET_CURRENT_SERVICE(state, service) {
    state.currentService = service;
  },
};

const actions = {
  async fetchServices({ commit }) {
    try {
      const response = await api.get("/service/get");
      commit("SET_SERVICES", response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  setCurrentService({ commit }, service) {
    commit("SET_CURRENT_SERVICE", service);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
