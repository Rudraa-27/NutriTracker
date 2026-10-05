import api from "./api";

export const getLogs = async () => {
  const response = await api.get("/logs");

  return response.data;
};

export const createLogsFromFood = async ({ foodText, dateString }) => {
  const response = await api.post("/logs/ai", {
    foodText,
    dateString
  });

  return response.data;
};

export const deleteLog = async (logId) => {
  const response = await api.delete(`/logs/${logId}`);

  return response.data;
};