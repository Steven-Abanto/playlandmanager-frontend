import api from "../../../../api/axios";

// ================= JUEGOS =================
export const getDashboardGamesRequest = async (params = {}) => {
  const response = await api.get("/api/core/juegos", { params });
  return response.data;
};

// ================= USO DE JUEGOS =================
export const getDashboardGameUsagesRequest = async () => {
  const response = await api.get("/api/core/juegos-uso");
  return response.data;
};

// ================= MANTENIMIENTOS =================
export const getDashboardMaintenancesRequest = async () => {
  const response = await api.get("/api/core/mantenimientos");
  return response.data;
};