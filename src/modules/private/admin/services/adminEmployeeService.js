import api from "../../../../api/axios";

// ================= LISTAR =================
export const getAdminEmployeesRequest = async (params = {}) => {
  const response = await api.get("/api/core/empleados", {
    params,
  });
  return response.data;
};

// ================= CREAR EMPLEADO COMPLETO =================
export const createEmployeeRequest = async (data) => {
  const response = await api.post("/api/auth/registro/empleado", data);
  return response.data;
};

// ================= CREAR ADMIN COMPLETO =================
export const createAdminRequest = async (data) => {
  const response = await api.post("/api/auth/registro/admin", data);
  return response.data;
};

// ================= ACTUALIZAR EMPLEADO =================
export const updateEmployeeRequest = async (id, data) => {
  const response = await api.put(`/api/core/empleados/${id}`, data);
  return response.data;
};

// ================= ELIMINADO LÓGICO =================
export const deleteEmployeeRequest = async (id) => {
  await api.patch(`/api/core/empleados/${id}/logic-delete`);
};