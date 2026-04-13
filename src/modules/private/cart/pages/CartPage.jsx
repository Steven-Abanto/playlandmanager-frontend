import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../auth/AuthContext";
import {
  applyCartPromotion,
  getOrCreateActiveCart,
  removeCartItem,
  removeCartPromotion,
  updateCartItem,
} from "../services/cartService";
import { calculateCartSummary, formatMoney } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const rol = user?.rolPrincipal || user?.rol;
  const tipoCompraInicial = rol === "EMPLEADO" ? "LOCAL" : "ONLINE";
  const [tipoCompra, setTipoCompra] = useState(tipoCompraInicial);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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

        const rol = user?.rolPrincipal || user?.rol;
        if (rol !== "CLIENTE" && rol !== "EMPLEADO") {
          setError("Tu rol no puede usar el carrito.");
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
        setPromoCode(data?.codigoPromocion || "");
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el carrito.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [isAuthenticated, user, tipoCompra]);

  const handleUpdateQuantity = async (idProducto, cantidad) => {
    try {
      if (!cart?.idCarrito) return;

      if (cantidad <= 0) {
        await handleRemoveItem(idProducto);
        return;
      }

      setProcessing(true);

      const updated = await updateCartItem({
        idCarrito: cart.idCarrito,
        idProducto,
        cantidad,
      });

      setCart(updated);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar la cantidad.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveItem = async (idProducto) => {
    try {
      if (!cart?.idCarrito) return;

      setProcessing(true);

      const updated = await removeCartItem(cart.idCarrito, idProducto);
      setCart(updated);
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el producto.");
    } finally {
      setProcessing(false);
    }
  };

  const handleApplyPromotion = async () => {
    try {
      if (!cart?.idCarrito) return;
      if (!promoCode.trim()) {
        alert("Ingresa un código de promoción.");
        return;
      }

      setProcessing(true);

      const updated = await applyCartPromotion(cart.idCarrito, promoCode.trim());
      setCart(updated);
      setPromoCode(updated?.codigoPromocion || promoCode.trim());
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo aplicar la promoción.";
      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemovePromotion = async () => {
    try {
      if (!cart?.idCarrito) return;

      setProcessing(true);

      const updated = await removeCartPromotion(cart.idCarrito);
      setCart(updated);
      setPromoCode("");
    } catch (err) {
      console.error(err);
      alert("No se pudo quitar la promoción.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cyan-50">
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <h1 className="text-4xl font-black text-black">Carrito</h1>
            <p className="mt-4 text-lg font-semibold text-gray-600">
              Inicia sesión para ver tu carrito.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black">Mi carrito</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            Revisa tus productos antes de continuar con la compra.
          </p>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-lg md:grid-cols-2">
          <div className="w-full rounded-2xl bg-slate-100 px-4 py-3 font-bold text-black">
            {tipoCompra}
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-black">
              Código de promoción
            </label>

            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Ej. PROMO10"
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
              />
              <button
                type="button"
                onClick={handleApplyPromotion}
                disabled={processing}
                className="rounded-2xl bg-cyan-500 px-5 py-3 font-black text-white hover:bg-cyan-600 disabled:opacity-60"
              >
                Aplicar
              </button>
            </div>

            {cart?.codigoPromocion && (
              <button
                type="button"
                onClick={handleRemovePromotion}
                className="mt-2 text-sm font-black text-red-600 hover:underline"
              >
                Quitar promoción
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-lg font-bold text-black">Cargando carrito...</p>
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
              Tu carrito está vacío.
            </p>
          </div>
        )}

        {!loading && !error && detalles.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-4">
              {detalles.map((item) => {
                const precio = Number(item.precio || 0);
                const cantidad = Number(item.cantidad || 0);
                const descuento = Number(item.descuento || 0);
                const subtotal = Number(item.subtotal || 0);
                const importeBase = precio * cantidad;

                return (
                  <article
                    key={item.idProducto}
                    className="rounded-3xl bg-white p-5 shadow-lg"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-black">
                          {item.descripcionProducto}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-gray-600">
                          Precio unitario: {formatMoney(precio)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.idProducto)}
                        className="rounded-2xl bg-red-500 px-4 py-2 font-black text-white hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm font-black text-gray-700">Cantidad</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.idProducto, cantidad - 1)
                            }
                            className="rounded-xl bg-slate-200 px-3 py-2 font-black"
                          >
                            -
                          </button>

                          <span className="min-w-[40px] text-center text-lg font-black">
                            {cantidad}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.idProducto, cantidad + 1)
                            }
                            className="rounded-xl bg-slate-200 px-3 py-2 font-black"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-black text-gray-700">Importe</p>
                        <p className="mt-2 text-lg font-black text-black">
                          {formatMoney(importeBase)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-black text-gray-700">Descuento</p>
                        <p className="mt-2 text-lg font-black text-red-600">
                          - {formatMoney(descuento)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-black text-gray-700">Subtotal</p>
                        <p className="mt-2 text-lg font-black text-cyan-700">
                          {formatMoney(subtotal)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-2xl font-black text-black">Resumen</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Subtotal bruto</span>
                  <span className="font-black text-black">
                    {formatMoney(summary.subtotalBruto)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Descuento</span>
                  <span className="font-black text-red-600">
                    - {formatMoney(summary.descuentoTotal)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-black">Total estimado</span>
                    <span className="text-2xl font-black text-cyan-700">
                      {formatMoney(summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-white hover:bg-cyan-600"
              >
                Continuar compra
              </button>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export default CartPage;