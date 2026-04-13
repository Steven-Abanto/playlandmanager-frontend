import api from "../../../../api/axios";

export const getClienteByIdRequest = async (idCliente) => {
  const response = await api.get(`/api/core/clientes/${idCliente}`);
  return response.data;
};