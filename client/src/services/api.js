import axios from "axios";

const TOKEN_KEY = "nutritrack_token";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json"
  },

  timeout: 15000
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Server responded with 401
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);

      window.dispatchEvent(
        new Event("nutritrack:logout")
      );
    }

    // Server could not be reached
    if (
      error.request &&
      !error.response
    ) {
      console.error(
        "NutriTrack API is unreachable."
      );
    }

    return Promise.reject(error);
  }
);

export default api;