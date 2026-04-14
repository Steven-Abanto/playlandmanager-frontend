import { useState } from "react";
import { useAuth } from "../../../../auth/AuthContext";
import { useCaja } from "../hooks/useCaja";
import { openCaja, closeCaja } from "../services/cajaService";

function CajaPage() {
  const { user } = useAuth();
  const { caja, setCaja, loading, hasCajaAbierta } = useCaja();

  const [montoApertura, setMontoApertura] = useState("");
  const [montoCierre, setMontoCierre] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleOpen = async () => {
    try {
      if (!user?.username) {
        alert("No se encontró el usuario autenticado.");
        return;
      }

      setProcessing(true);

      const data = await openCaja({
        codCaja: "CAJA_01",
        usuApertura: user.username,
        montoApertura: Number(montoApertura),
      });

      setCaja(data);
      alert("Caja abierta correctamente");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al abrir caja");
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = async () => {
    try {
      if (!user?.username) {
        alert("No se encontró el usuario autenticado.");
        return;
      }

      setProcessing(true);

      await closeCaja({
        codCaja: caja.codCaja,
        usuCierre: user.username,
        montoCierre: Number(montoCierre),
      });

      setCaja(null);
      alert("Caja cerrada correctamente");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al cerrar caja");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-center font-bold">Cargando caja...</p>;
  }

  return (
    <div className="min-h-screen bg-indigo-50 p-10">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-3xl font-black">Gestión de Caja</h1>

        {hasCajaAbierta ? (
          <>
            <p className="mb-4 font-semibold text-green-700">
              Caja abierta: {caja.codCaja}
            </p>

            <input
              type="number"
              placeholder="Monto cierre"
              value={montoCierre}
              onChange={(e) => setMontoCierre(e.target.value)}
              className="mb-4 w-full rounded-xl border p-3"
            />

            <button
              onClick={handleClose}
              disabled={processing}
              className="w-full rounded-xl bg-red-500 p-3 font-bold text-white"
            >
              Cerrar Caja
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 font-semibold text-red-600">
              No tienes caja abierta
            </p>

            <input
              type="number"
              placeholder="Monto apertura"
              value={montoApertura}
              onChange={(e) => setMontoApertura(e.target.value)}
              className="mb-4 w-full rounded-xl border p-3"
            />

            <button
              onClick={handleOpen}
              disabled={processing}
              className="w-full rounded-xl bg-green-500 p-3 font-bold text-white"
            >
              Abrir Caja
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CajaPage;