import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoletaById } from "../../checkout/services/checkoutService";
import { formatMoney } from "../../cart/utils/cartUtils";

function BoletaDetailPage() {
  const { idBoleta } = useParams();
  const navigate = useNavigate();

  const [boleta, setBoleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBoleta() {
      try {
        setLoading(true);
        setError("");

        const data = await getBoletaById(idBoleta);
        setBoleta(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la boleta.");
      } finally {
        setLoading(false);
      }
    }

    if (idBoleta) loadBoleta();
  }, [idBoleta]);

  if (loading) {
    return (
      <div className="p-10 text-center font-bold">
        Cargando boleta...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        {error}
      </div>
    );
  }

  if (!boleta) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        
        <h1 className="text-4xl font-black text-black mb-4">
          Boleta #{boleta.numeDocuVenta}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Fecha: {new Date(boleta.fechaHora).toLocaleString()}
        </p>

        {/* Cliente */}
        {boleta.cliente && (
          <div className="mb-6">
            <h2 className="font-bold text-lg">Cliente</h2>
            <p>
              {boleta.cliente.nombre} {boleta.cliente.apePaterno}
            </p>
            <p>{boleta.cliente.correo}</p>
          </div>
        )}

        {/* Detalles */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-2">Productos</h2>

          {boleta.detalles.map((item) => (
            <div
              key={item.idBoletaDetalle}
              className="flex justify-between border-b py-2"
            >
              <div>
                <p className="font-semibold">
                  {item.descripcionProducto}
                </p>
                <p className="text-sm text-gray-500">
                  {item.cantidad} x {formatMoney(item.precio)}
                </p>
              </div>

              <div className="font-bold text-cyan-700">
                {formatMoney(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        {/* Pagos */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-2">Pagos</h2>

          {boleta.pagos.map((pago) => (
            <div key={pago.idMetPago} className="flex justify-between">
              <span>{pago.metodoPago}</span>
              <span>{formatMoney(pago.monto)}</span>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(boleta.subtotal)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Descuento</span>
            <span>- {formatMoney(boleta.dsctoTotal)}</span>
          </div>

          <div className="flex justify-between text-xl font-black">
            <span>Total</span>
            <span>{formatMoney(boleta.total)}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-cyan-500 text-white font-bold p-3 rounded-xl"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default BoletaDetailPage;