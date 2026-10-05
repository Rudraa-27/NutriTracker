import api from "./api";

export const getGoals = async () => {
  const response = await api.get("/goals");

  return response.data;
};

export const updateGoals = async (goals) => {
  const response = await api.put("/goals", goals);

  return response.data;
};