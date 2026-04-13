import api from "../../../../api/axios";

export const getEmpleadoByIdRequest = async (idEmpleado) => {
  const response = await api.get(`/api/core/empleados/${idEmpleado}`);
  return response.data;
};