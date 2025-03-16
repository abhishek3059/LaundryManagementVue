import api from "@/utils/api";

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem("jwtToken") || null,
    isLoggedIn: !!localStorage.getItem("jwtToken"),
  },
  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      state.isLoggedIn = true;
      localStorage.setItem("jwtToken", token);
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("jwtToken");
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const { data: token } = await api.post("/auth/login", credentials);
        commit("SET_TOKEN", token);
        return true;
      } catch (error) {
        commit("CLEAR_AUTH");
        throw error;
      }
    },
    logout({ commit }) {
      commit("CLEAR_AUTH");
    },
  },
};
