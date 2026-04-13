import api from "../api/axios";

export const loginRequest = async (data) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const refreshRequest = async (refreshToken) => {
  const response = await api.post("/api/auth/refresh", {
    refreshToken,
  });
  return response.data;
};

export const meRequest = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

export const registerClienteRequest = async (data) => {
  const response = await api.post("/api/auth/registro/cliente", data);
  return response.data;
};