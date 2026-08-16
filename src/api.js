import axios from "axios";
import ServerURL from "./data/config";

const apiClient = axios.create({
  baseURL: ServerURL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const companiesApi = {
  list: async () => {
    const response = await apiClient.get("/stocks/companies/");
    return response.data;
  },
  update: async (id, payload) => {
    const response = await apiClient.put(`/stocks/companies/${id}/`, payload);
    return response.data;
  },
  remove: async (id) => {
    await apiClient.delete(`/stocks/companies/${id}/`);
  },
};

export default apiClient;
