import api from "../../../../api/axios";

// ================= JUEGOS =================
export const getGamesRequest = async (params = {}) => {
  const response = await api.get("/api/core/juegos", { params });
  return response.data;
};

export const updateGameRequest = async (id, data) => {
  const response = await api.put(`/api/core/juegos/${id}`, data);
  return response.data;
};

// ================= USO DE JUEGOS =================
export const getGameUsagesRequest = async () => {
  const response = await api.get("/api/core/juegos-uso");
  return response.data;
};

export const getGameUsagesByGameRequest = async (idJuego) => {
  const response = await api.get(`/api/core/juegos-uso/juego/${idJuego}`);
  return response.data;
};

export const getGameUsagesByDateRequest = async (fechaUso) => {
  const response = await api.get(`/api/core/juegos-uso/fecha/${fechaUso}`);
  return response.data;
};

export const createGameUsageRequest = async (data) => {
  const response = await api.post("/api/core/juegos-uso", data);
  return response.data;
};

export const updateGameUsageRequest = async (id, data) => {
  const response = await api.put(`/api/core/juegos-uso/${id}`, data);
  return response.data;
};

export const deleteGameUsageRequest = async (id) => {
  await api.delete(`/api/core/juegos-uso/${id}`);
};