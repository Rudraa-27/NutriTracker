import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5231/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT automatically to protected requests.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nutritrack_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;