import { useEffect, useState } from "react";
import { useAuth } from "../../../../auth/AuthContext";
import {
  getCajaAbiertaByUsuario,
} from "../services/cajaService";

export function useCaja() {
  const { user, isAuthenticated } = useAuth();

  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);

  const rol = user?.rolPrincipal || user?.rol;

  useEffect(() => {
    async function loadCaja() {
      try {
        if (!isAuthenticated || rol !== "EMPLEADO") {
          setLoading(false);
          return;
        }

        const data = await getCajaAbiertaByUsuario(user.username);
        setCaja(data);
      } catch (err) {
        // no tiene caja abierta → OK
        setCaja(null);
      } finally {
        setLoading(false);
      }
    }

    loadCaja();
  }, [user, isAuthenticated, rol]);

  return {
    caja,
    setCaja,
    loading,
    hasCajaAbierta: !!caja,
    rol,
  };
}