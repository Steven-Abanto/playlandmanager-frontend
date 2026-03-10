import api from "../../../../shared/services/api";

export async function getPromotions(params = {}) {
  const response = await api.get("/promociones", { params });
  return response.data;
}