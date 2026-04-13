import api from "../../../../api/axios";

export async function createBoletaFromCarrito(payload) {
  const response = await api.post("/api/core/boletas/from-carrito", payload);
  return response.data;
}

export async function getBoletaById(idBoleta) {
  const response = await api.get(`/api/core/boletas/${idBoleta}`);
  return response.data;
}