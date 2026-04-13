import api from "../../../../api/axios";

const BASE_URL = "/api/catalogo/promociones";

export async function getPromociones(onlyActive = false) {
  const response = await api.get(BASE_URL, {
    params: { onlyActive },
  });
  return response.data;
}

export async function getPromocionById(id) {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
}

export async function getPromocionesActiveToday() {
  const response = await api.get(`${BASE_URL}/active-today`);
  return response.data;
}

export async function createPromocion(payload) {
  const response = await api.post(BASE_URL, payload);
  return response.data;
}

export async function updatePromocion(id, payload) {
  const response = await api.put(`${BASE_URL}/${id}`, payload);
  return response.data;
}

export async function deletePromocion(id) {
  await api.patch(`${BASE_URL}/delete/${id}`);
}