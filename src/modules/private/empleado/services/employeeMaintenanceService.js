import api from "../../../../api/axios";

// ================= JUEGOS =================
export const getGamesRequest = async (params = {}) => {
  const response = await api.get("/api/core/juegos", { params });
  return response.data;
};

// ================= EMPLEADOS =================
export const getEmployeesRequest = async (params = {}) => {
  const response = await api.get("/api/core/empleados", { params });
  return response.data;
};

// ================= MANTENIMIENTOS =================
export const getMaintenancesRequest = async () => {
  const response = await api.get("/api/core/mantenimientos");
  return response.data;
};

export const getMaintenancesByEmployeeRequest = async (idEmpleado) => {
  const response = await api.get(`/api/core/mantenimientos/employee/${idEmpleado}`);
  return response.data;
};

export const getMaintenancesByGameRequest = async (idJuego) => {
  const response = await api.get(`/api/core/mantenimientos/game/${idJuego}`);
  return response.data;
};

export const getMaintenancesByDateRangeRequest = async (start, end) => {
  const response = await api.get("/api/core/mantenimientos/fecha-inicio", {
    params: { start, end },
  });
  return response.data;
};

export const createMaintenanceRequest = async (data) => {
  const response = await api.post("/api/core/mantenimientos", data);
  return response.data;
};

export const updateMaintenanceRequest = async (id, data) => {
  const response = await api.put(`/api/core/mantenimientos/${id}`, data);
  return response.data;
};

export const deleteMaintenanceRequest = async (id) => {
  await api.delete(`/api/core/mantenimientos/${id}`);
};