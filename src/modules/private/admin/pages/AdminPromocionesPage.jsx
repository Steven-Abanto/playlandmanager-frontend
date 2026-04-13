import { useEffect, useMemo, useState } from "react";
import {
  getPromociones,
  getPromocionById,
  createPromocion,
  updatePromocion,
  deletePromocion,
} from "../../../public/promociones/services/promocionService";
import { getProducts } from "../../../public/productos/services/productService";
import PromocionFormModal from "../components/PromocionFormModal";

function formatDate(date) {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

function formatPercent(decimalValue) {
  if (decimalValue === null || decimalValue === undefined) return "-";
  return `${(Number(decimalValue) * 100).toFixed(2)}%`;
}

function formatMoney(value) {
  if (value === null || value === undefined) return "-";
  return `S/ ${Number(value).toFixed(2)}`;
}

function AdminPromocionesPage() {
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [promocionesData, productosData] = await Promise.all([
        getPromociones(onlyActive),
        getProducts(),
      ]);

      setPromociones(Array.isArray(promocionesData) ? promocionesData : []);
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las promociones.");
      setPromociones([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [onlyActive]);

  const filteredPromociones = useMemo(() => {
    return promociones.filter((promocion) => {
      const codigo = (promocion.codigo || "").toLowerCase();
      const nombre = (promocion.nombre || "").toLowerCase();
      const descripcion = (promocion.descripcion || "").toLowerCase();

      const matchesSearch =
        codigo.includes(search.toLowerCase()) ||
        nombre.includes(search.toLowerCase()) ||
        descripcion.includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [promociones, search]);

  const handleCreate = () => {
    setSelectedPromocion(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (promocion) => {
    try {
      const detail = await getPromocionById(promocion.idPromocion);

      setSelectedPromocion({
        ...detail,
        productosIds: detail.productosIds || [],
      });

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar la promoción.");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);

      if (selectedPromocion) {
        await updatePromocion(selectedPromocion.idPromocion, payload);
      } else {
        await createPromocion(payload);
      }

      setIsModalOpen(false);
      setSelectedPromocion(null);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idPromocion) => {
    const confirmed = window.confirm("¿Deseas desactivar esta promoción?");
    if (!confirmed) return;

    try {
      await deletePromocion(idPromocion);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("No se pudo desactivar la promoción.");
    }
  };

  return (
    <div className="min-h-screen bg-red-100">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-black text-black">Promociones</h1>
            <p className="mt-2 text-lg font-semibold text-gray-700">
              Administra campañas y descuentos para productos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="rounded-2xl bg-cyan-500 px-5 py-3 font-black text-white transition hover:bg-cyan-600"
          >
            + Nueva promoción
          </button>
        </div>

        <div className="mb-6 grid gap-4 rounded-3xl bg-white p-4 shadow-lg md:grid-cols-[1fr_auto]">
          <input
            type="text"
            placeholder="Buscar por código, nombre o descripción"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-red-200"
          />

          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Solo activas
          </label>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-bold text-black">Cargando promociones...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-200 p-10 text-center">
            <p className="text-lg font-bold text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && filteredPromociones.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-bold text-black">
              No se encontraron promociones.
            </p>
          </div>
        )}

        {!loading && !error && filteredPromociones.length > 0 && (
          <div className="overflow-x-auto rounded-3xl bg-white shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Porcentaje
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Monto máx.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Inicio
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Fin
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black text-black">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPromociones.map((promocion) => (
                  <tr key={promocion.idPromocion} className="border-t">
                    <td className="px-4 py-4 font-bold text-black">
                      {promocion.codigo}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-black text-black">{promocion.nombre}</p>
                      <p className="text-sm font-semibold text-gray-600">
                        {promocion.descripcion || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-semibold text-black">
                      {formatPercent(promocion.porcentaje)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-black">
                      {formatMoney(promocion.montoMax)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-black">
                      {formatDate(promocion.fechaInicio)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-black">
                      {formatDate(promocion.fechaFin)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          promocion.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {promocion.activo ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(promocion)}
                          className="rounded-xl bg-slate-200 px-4 py-2 font-bold text-slate-800 hover:bg-slate-300"
                        >
                          Editar
                        </button>

                        {promocion.activo && (
                          <button
                            type="button"
                            onClick={() => handleDelete(promocion.idPromocion)}
                            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                          >
                            Desactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <PromocionFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPromocion(null);
        }}
        onSubmit={handleSubmit}
        promocion={selectedPromocion}
        productos={productos.filter((producto) => producto.activo)}
        loading={isSubmitting}
      />
    </div>
  );
}

export default AdminPromocionesPage;