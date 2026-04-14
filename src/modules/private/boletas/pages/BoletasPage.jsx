import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/AuthContext";
import {
  getBoletasByCliente,
  getBoletasByEmpleado,
} from "../services/boletaService";

function formatMoney(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function BoletasPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const rol = user?.rolPrincipal || user?.rol;

  const [boletas, setBoletas] = useState([]);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("TODAS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBoletas() {
      try {
        if (!isAuthenticated) {
          setLoading(false);
          return;
        }

        if (rol !== "CLIENTE" && rol !== "EMPLEADO") {
          setError("Tu rol no tiene acceso al historial de boletas.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        let data = [];

        if (rol === "CLIENTE" && user?.idCliente) {
          data = await getBoletasByCliente(user.idCliente);
        }

        if (rol === "EMPLEADO" && user?.idEmpleado) {
          data = await getBoletasByEmpleado(user.idEmpleado);
        }

        setBoletas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el historial de boletas.");
        setBoletas([]);
      } finally {
        setLoading(false);
      }
    }

    loadBoletas();
  }, [isAuthenticated, rol, user?.idCliente, user?.idEmpleado]);

  const filteredBoletas = useMemo(() => {
    return boletas.filter((boleta) => {
      const numero = (boleta.numeDocuVenta || "").toLowerCase();
      const estado = (boleta.estado || "").toLowerCase();
      const tipo = (boleta.tipoDocuVenta || "").toLowerCase();
      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        numero.includes(term) ||
        estado.includes(term) ||
        tipo.includes(term);

      const matchesTipo =
        tipoFiltro === "TODAS" || boleta.tipoDocuVenta === tipoFiltro;

      return matchesSearch && matchesTipo;
    });
  }, [boletas, search, tipoFiltro]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <h1 className="text-4xl font-black text-black">Mis boletas</h1>
            <p className="mt-4 text-lg font-semibold text-gray-600">
              Inicia sesión para ver tu historial.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black">Historial de boletas</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            Revisa tus compras registradas en el sistema.
          </p>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-lg md:grid-cols-[1fr_220px]">
          <input
            type="text"
            placeholder="Buscar por número, estado o tipo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-slate-200"
          />

          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-slate-200"
          >
            <option value="TODAS">Todas</option>
            <option value="BOL">Boletas</option>
            <option value="FAC">Facturas</option>
          </select>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-lg font-bold text-black">Cargando historial...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl bg-red-100 p-10 text-center">
            <p className="text-lg font-bold text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && filteredBoletas.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-lg font-bold text-black">
              No se encontraron boletas.
            </p>
          </div>
        )}

        {!loading && !error && filteredBoletas.length > 0 && (
          <div className="space-y-4">
            {filteredBoletas.map((boleta) => (
              <article
                key={boleta.idBoleta}
                className="rounded-3xl bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black text-black">
                        {boleta.numeDocuVenta}
                      </h2>

                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
                        {boleta.tipoDocuVenta}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          boleta.estado === "EMITIDA"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {boleta.estado}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-600">
                      Fecha: {formatDate(boleta.fechaHora)}
                    </p>

                    {boleta.cliente && (
                      <p className="mt-1 text-sm font-semibold text-gray-600">
                        Cliente: {boleta.cliente.nombre} {boleta.cliente.apePaterno}
                      </p>
                    )}
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-sm font-bold text-gray-600">Total</p>
                    <p className="text-3xl font-black text-cyan-700">
                      {formatMoney(boleta.total)}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(`/boletas/${boleta.idBoleta}`)}
                      className="mt-3 rounded-2xl bg-slate-900 px-5 py-3 font-black text-white hover:bg-slate-800"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default BoletasPage;