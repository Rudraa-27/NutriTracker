import api from "./api";

export const checkApiHealth = async () => {
  const response = await api.get("/health", {
    timeout: 5000
  });

  return response.data;
};
