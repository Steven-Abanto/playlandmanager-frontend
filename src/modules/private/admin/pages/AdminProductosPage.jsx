import { useEffect, useState } from "react";
import {
  createProductRequest,
  deleteProductRequest,
  getAdminProductsRequest,
  updateProductRequest,
} from "../services/adminProductService";
import ProductFormModal from "../components/ProductFormModal";

function AdminProductosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [onlyActive, setOnlyActive] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [typeFilter, setTypeFilter] = useState("TODOS");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminProductsRequest({
        onlyActive,
      });

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [onlyActive]);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (payload) => {
    try {
      setIsSaving(true);

      if (selectedProduct) {
        await updateProductRequest(selectedProduct.idProducto, payload);
      } else {
        await createProductRequest(payload);
      }

      await loadProducts();
      handleCloseModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas desactivar este producto?");
    if (!confirmed) return;

    try {
      await deleteProductRequest(id);
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error al desactivar el producto.");
    }
  };

const filteredProducts = products.filter((p) => {
  const text = search.toLowerCase();

  const matchesSearch =
    (p.descripcion || "").toLowerCase().includes(text) ||
    (p.categoria || "").toLowerCase().includes(text) ||
    (p.marca || "").toLowerCase().includes(text) ||
    (p.sku || "").toLowerCase().includes(text) ||
    (p.upc || "").toLowerCase().includes(text);

  const matchesType =
    typeFilter === "TODOS" ||
    (typeFilter === "PRODUCTO" && !p.esServicio) ||
    (typeFilter === "SERVICIO" && p.esServicio);

  return matchesSearch && matchesType;
});

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Gestión de productos</h1>
            <p className="text-sm font-semibold text-gray-600">
              Administra productos y servicios del catálogo
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-white transition hover:bg-cyan-500"
          >
            + Nuevo producto
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
                type="text"
                placeholder="Buscar por descripción, categoría, marca, SKU o UPC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-xl"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border px-4 py-3 font-semibold outline-none"
                >
                <option value="TODOS">Todos</option>
                <option value="PRODUCTO">Productos</option>
                <option value="SERVICIO">Servicios</option>
                </select>

                <label className="flex items-center gap-2 text-sm font-semibold text-black">
                <input
                    type="checkbox"
                    checked={onlyActive}
                    onChange={() => setOnlyActive(!onlyActive)}
                    className="h-4 w-4"
                />
                Solo activos
                </label>
            </div>
        </div>

        {loading && (
          <div className="mt-6 rounded-xl bg-yellow-100 p-4 font-semibold text-black">
            Cargando productos...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Imagen</th>
                  <th className="p-3 font-black">Descripción</th>
                  <th className="p-3 font-black">Categoría</th>
                  <th className="p-3 font-black">Marca</th>
                  <th className="p-3 font-black">Precio</th>
                  <th className="p-3 font-black">Stock Min</th>
                  <th className="p-3 font-black">Stock Act</th>
                  <th className="p-3 font-black">SKU</th>
                  <th className="p-3 font-black">UPC</th>
                  <th className="p-3 font-black">Tipo</th>
                  <th className="p-3 font-black">Estado</th>
                  <th className="p-3 font-black text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.idProducto} className="border-b align-top">
                    <td className="p-3">{p.idProducto}</td>

                    <td className="p-3">
                        <img
                        src={p.imagenUrl || "https://picsum.photos/120/80"}
                        alt={p.descripcion}
                        className="h-16 w-24 rounded-xl object-cover shadow"
                        />
                    </td>

                    <td className="p-3 font-semibold">{p.descripcion}</td>
                    <td className="p-3">{p.categoria || "-"}</td>
                    <td className="p-3">{p.marca || "-"}</td>
                    <td className="p-3">S/ {Number(p.precio).toFixed(2)}</td>
                    <td className="p-3">{p.stockMin}</td>
                    <td className="p-3">{p.stockAct}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">{p.upc}</td>

                    <td className="p-3">
                        <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
                            p.esServicio
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-cyan-100 text-cyan-800"
                        }`}
                        >
                        {p.esServicio ? "Servicio" : "Producto"}
                        </span>
                    </td>

                    <td className="p-3">
                        <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
                            p.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                        >
                        {p.activo ? "Activo" : "Inactivo"}
                        </span>
                    </td>

                    <td className="p-3">
                        <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleOpenEdit(p)}
                            className="rounded-xl bg-yellow-200 px-3 py-2 font-bold text-black transition hover:bg-yellow-300"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() => handleDelete(p.idProducto)}
                            className="rounded-xl bg-red-200 px-3 py-2 font-bold text-black transition hover:bg-red-300"
                        >
                            Desactivar
                        </button>
                        </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="13" className="p-6 text-center text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        initialData={selectedProduct}
        isSubmitting={isSaving}
      />
    </main>
  );
}

export default AdminProductosPage;