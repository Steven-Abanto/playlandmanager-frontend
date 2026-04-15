import api from "../../../../api/axios";

// ================= LISTAR =================
export const getAdminGamesRequest = async (params = {}) => {
  const response = await api.get("/api/core/juegos", {
    params,
  });
  return response.data;
};

// ================= FILTRAR POR ESTADO =================
export const getGamesByEstadoRequest = async (estado, onlyActive = false) => {
  const response = await api.get(`/api/core/juegos/estado/${estado}`, {
    params: { onlyActive },
  });
  return response.data;
};

// ================= CREAR =================
export const createGameRequest = async (data) => {
  const response = await api.post("/api/core/juegos", data);
  return response.data;
};

// ================= ACTUALIZAR =================
export const updateGameRequest = async (id, data) => {
  const response = await api.put(`/api/core/juegos/${id}`, data);
  return response.data;
};

// ================= ELIMINADO LÓGICO =================
export const deleteGameRequest = async (id) => {
  await api.patch(`/api/core/juegos/${id}/logic-delete`);
};