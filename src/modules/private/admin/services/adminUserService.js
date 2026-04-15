import api from "../../../../api/axios";

// ================= LISTAR TODOS =================
export const getAdminUsersRequest = async () => {
  const response = await api.get("/api/auth/usuarios");
  return response.data;
};

// ================= FILTRAR POR ROL =================
export const getUsersByRoleRequest = async (rol, onlyActive = false) => {
  const response = await api.get(`/api/auth/usuarios/rol/${rol}`, {
    params: { onlyActive },
  });
  return response.data;
};

// ================= OBTENER POR ID =================
export const getUserByIdRequest = async (id) => {
  const response = await api.get(`/api/auth/usuarios/${id}`);
  return response.data;
};

// ================= ACTUALIZAR =================
export const updateUserRequest = async (id, data) => {
  const response = await api.put(`/api/auth/usuarios/${id}`, data);
  return response.data;
};

// ================= ELIMINADO LÓGICO =================
export const deleteUserRequest = async (id) => {
  await api.patch(`/api/auth/usuarios/${id}/logic-delete`);
};