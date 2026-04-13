import api from "../../../../api/axios";

export async function getServices(params = {}) {
  const response = await api.get("/api/catalogo/productos/type", {
    params: {
      esServicio: true,
      onlyActive: true,
      ...params,
    },
  });

  return response.data;
}