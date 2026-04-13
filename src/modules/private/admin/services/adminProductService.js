import api from "../../../../api/axios";

// ================= LISTAR =================
export const getAdminProductsRequest = async (params = {}) => {
  const response = await api.get("/api/catalogo/productos", {
    params,
  });
  return response.data;
};

// ================= CREAR =================
export const createProductRequest = async (data) => {
  const response = await api.post("/api/catalogo/productos", data);
  return response.data;
};

// ================= ACTUALIZAR =================
export const updateProductRequest = async (id, data) => {
  const response = await api.put(`/api/catalogo/productos/${id}`, data);
  return response.data;
};

// ================= ELIMINADO LÓGICO =================
export const deleteProductRequest = async (id) => {
  await api.patch(`/api/catalogo/productos/delete/${id}`);
};