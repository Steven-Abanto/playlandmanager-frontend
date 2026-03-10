import api from "../../../../shared/services/api";

export async function getProducts(params = {}) {
  const response = await api.get("/productos", { params });
  return response.data;
}