import api from "../../../../api/axios";

const BASE_URL = "/api/core/boletas";

export async function getBoletaById(idBoleta) {
  const response = await api.get(`${BASE_URL}/${idBoleta}`);
  return response.data;
}

export async function getBoletasByCliente(idCliente) {
  const response = await api.get(`${BASE_URL}/client/${idCliente}`);
  return response.data;
}

export async function getBoletasByEmpleado(idEmpleado) {
  const response = await api.get(`${BASE_URL}/employee/${idEmpleado}`);
  return response.data;
}