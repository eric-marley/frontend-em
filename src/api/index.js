import axios from "axios";
import router from "../router";

const api = axios.create({
  baseURL:
    process.env.VUE_APP_BASE_URL !== undefined
      ? process.env.VUE_APP_BASE_URL
      : "http://localhost:3000",
});

api.CancelToken = axios.CancelToken;
api.isCancel = axios.isCancel;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
