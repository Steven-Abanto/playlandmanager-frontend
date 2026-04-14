import api from "../../../../api/axios";

const BASE_URL = "/api/core/cajas";

export async function openCaja(payload) {
  const res = await api.post(`${BASE_URL}/open`, payload);
  return res.data;
}

export async function closeCaja(payload) {
  const res = await api.post(`${BASE_URL}/close`, payload);
  return res.data;
}

export async function getCajaAbiertaByUsuario(usuario) {
  const res = await api.get(`${BASE_URL}/open-by-user/${usuario}`);
  return res.data;
}

export async function getCajaOnline() {
  const res = await api.get(`${BASE_URL}/online`);
  return res.data;
}