import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/AuthContext";
import { getOrCreateActiveCart } from "../../cart/services/cartService";
import { calculateCartSummary, formatMoney } from "../../cart/utils/cartUtils";
import { createBoletaFromCarrito } from "../services/checkoutService";

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const rol = user?.rolPrincipal || user?.rol;
  const tipoCompra = rol === "EMPLEADO" ? "LOCAL" : "ONLINE";

  const [cart, setCart] = useState(null);
  const [idCaja, setIdCaja] = useState("");
  const [tipoDocuVenta, setTipoDocuVenta] = useState("BOL");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [montoPago, setMontoPago] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const detalles = cart?.detalles || [];
  const summary = useMemo(() => calculateCartSummary(detalles), [detalles]);

  useEffect(() => {
    async function loadCart() {
      try {
        if (!isAuthenticated || !user?.idUsuario) {
          setLoading(false);
          return;
        }

        if (rol !== "CLIENTE" && rol !== "EMPLEADO") {
          setError("Tu rol no puede continuar la compra.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        const data = await getOrCreateActiveCart({
          idUsuario: user.idUsuario,
          tipoCompra,
        });

        setCart(data);
        setMontoPago(
          Number(
            (data?.detalles || []).reduce(
              (acc, item) => acc + Number(item.subtotal || 0),
              0
            )
          ).toFixed(2)
        );
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el carrito para checkout.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [isAuthenticated, user?.idUsuario, rol, tipoCompra]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart?.idCarrito) {
      alert("No hay carrito disponible.");
      return;
    }

    if (rol === "CLIENTE") {
      alert("Con el backend actual, la compra online aún requiere idEmpleado e idCaja.");
      return;
    }

    if (!idCaja) {
      alert("Ingresa el idCaja.");
      return;
    }

    if (!user?.idEmpleado) {
      alert("No se encontró idEmpleado en tu sesión.");
      return;
    }

    if (!montoPago || Number(montoPago) <= 0) {
      alert("Ingresa un monto de pago válido.");
      return;
    }

    try {
      setSubmitting(true);

      const boleta = await createBoletaFromCarrito({
        idCarrito: cart.idCarrito,
        idCaja: Number(idCaja),
        idEmpleado: user.idEmpleado,
        tipoDocuVenta,
        idCliente: user?.idCliente ?? null,
        pagos: [
          {
            metodoPago,
            monto: Number(montoPago),
          },
        ],
      });

      alert(`Compra registrada correctamente. Boleta: ${boleta.numeDocuVenta}`);
      navigate(`/boletas/${boleta.idBoleta}`);
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo completar la compra.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <h1 className="text-4xl font-black text-black">Checkout</h1>
            <p className="mt-4 text-lg font-semibold text-gray-600">
              Inicia sesión para continuar la compra.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black">Continuar compra</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            Confirma los datos de la venta y registra el pago.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-lg font-bold text-black">Cargando checkout...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl bg-red-100 p-10 text-center">
            <p className="text-lg font-bold text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && detalles.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-lg font-bold text-black">
              No hay productos en el carrito.
            </p>
          </div>
        )}

        {!loading && !error && detalles.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {detalles.map((item) => (
                <article
                  key={item.idProducto}
                  className="rounded-3xl bg-white p-5 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-black">
                        {item.descripcionProducto}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-gray-600">
                        Precio unitario: {formatMoney(item.precio)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-600">
                        Cantidad: {item.cantidad}
                      </p>
                      <p className="mt-1 text-lg font-black text-cyan-700">
                        {formatMoney(item.subtotal)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-black">Datos de pago</h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-black text-black">
                    Tipo de compra
                  </label>
                  <div className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-black">
                    {tipoCompra}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-black">
                    Tipo de documento
                  </label>
                  <select
                    value={tipoDocuVenta}
                    onChange={(e) => setTipoDocuVenta(e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-emerald-200"
                  >
                    <option value="BOL">BOL</option>
                    <option value="FAC">FAC</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-black">
                    Método de pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-emerald-200"
                  >
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="YAPE">YAPE</option>
                    <option value="PLIN">PLIN</option>
                    <option value="TARJETA">TARJETA</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-black">
                    Monto del pago
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-emerald-200"
                  />
                </div>

                {rol === "EMPLEADO" ? (
                  <div>
                    <label className="mb-2 block text-sm font-black text-black">
                      ID Caja
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={idCaja}
                      onChange={(e) => setIdCaja(e.target.value)}
                      className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-emerald-200"
                      placeholder="Ej. 1"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-800">
                    El backend actual aún requiere <code>idEmpleado</code> e{" "}
                    <code>idCaja</code> para facturar desde carrito, por lo que el
                    flujo final del cliente online todavía necesita ajuste backend.
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Subtotal bruto</span>
                    <span className="font-black text-black">
                      {formatMoney(summary.subtotalBruto)}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Descuento</span>
                    <span className="font-black text-red-600">
                      - {formatMoney(summary.descuentoTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-black">Total</span>
                    <span className="text-2xl font-black text-emerald-700">
                      {formatMoney(summary.total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || rol === "CLIENTE"}
                  className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Procesando..." : "Emitir boleta"}
                </button>
              </form>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export default CheckoutPage;