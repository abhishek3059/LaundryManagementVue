import axios from "axios";
import { toast } from "vue3-toastify";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    console.log("Token in interceptor:", token); // Debugging
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
    console.log("Request config:", config); // Debugging
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem("jwtToken");
      // window.location.href = "/login";
      toast.error("Your session has expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
