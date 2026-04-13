import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, meRequest, refreshRequest } from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = async (credentials) => {
    const data = await loginRequest(credentials);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setUser({
      username: data.username,
      roles: data.roles,
      rolPrincipal: data.rolPrincipal,
      idUsuario: data.idUsuario,
      idEmpleado: data.idEmpleado,
      idCliente: data.idCliente,
      activo: data.activo,
    });

    return data;
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  // ================= CHECK SESSION =================
  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await meRequest();

      setUser({
        username: data.username,
        roles: data.roles,
        rolPrincipal: data.rolPrincipal,
        idUsuario: data.idUsuario,
        idEmpleado: data.idEmpleado,
        idCliente: data.idCliente,
        activo: data.activo,
      });
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ================= REFRESH TOKEN =================
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");

      if (!refresh) {
        logout();
        return null;
      }

      const data = await refreshRequest(refresh);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      return data;
    } catch (error) {
      logout();
      return null;
    }
  };

  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      refreshToken();
    }, 1000 * 60 * 4);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        hasRole: (role) => user?.roles?.includes(role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);