import { useEffect, useState } from "react";

const INITIAL_FORM = {
  descripcion: "",
  categoria: "",
  marca: "",
  precio: "",
  stockMin: "",
  stockAct: "",
  upc: "",
  sku: "",
  imagenUrl: "",
  esServicio: false,
  activo: true,
};

function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        descripcion: initialData.descripcion ?? "",
        categoria: initialData.categoria ?? "",
        marca: initialData.marca ?? "",
        precio: initialData.precio ?? "",
        stockMin: initialData.stockMin ?? "",
        stockAct: initialData.stockAct ?? "",
        upc: initialData.upc ?? "",
        sku: initialData.sku ?? "",
        imagenUrl: initialData.imagenUrl ?? "",
        esServicio: initialData.esServicio ?? false,
        activo: initialData.activo ?? true,
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});
    setServerError("");
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setServerError("");
  };

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.descripcion.trim()) {
      nextErrors.descripcion = "Ingresa la descripción.";
    }

    if (!form.categoria.trim()) {
      nextErrors.categoria = "Ingresa la categoría.";
    }

    if (!form.marca.trim()) {
      nextErrors.marca = "Ingresa la marca.";
    }

    if (form.precio === "") {
      nextErrors.precio = "Ingresa el precio.";
    } else if (Number(form.precio) < 0) {
      nextErrors.precio = "El precio no puede ser negativo.";
    }

    if (form.stockMin === "") {
      nextErrors.stockMin = "Ingresa el stock mínimo.";
    } else if (Number(form.stockMin) < 0) {
      nextErrors.stockMin = "El stock mínimo no puede ser negativo.";
    }

    if (form.stockAct === "") {
      nextErrors.stockAct = "Ingresa el stock actual.";
    } else if (Number(form.stockAct) < 0) {
      nextErrors.stockAct = "El stock actual no puede ser negativo.";
    }

    if (!form.upc.trim()) {
      nextErrors.upc = "Ingresa el UPC.";
    }

    if (!form.sku.trim()) {
      nextErrors.sku = "Ingresa el SKU.";
    }

    if (!form.imagenUrl.trim()) {
      nextErrors.imagenUrl = "La imagen es obligatoria.";
    } else if (!isValidUrl(form.imagenUrl.trim())) {
      nextErrors.imagenUrl = "Ingresa una URL válida.";
    }

    return nextErrors;
  };

  const buildPayload = () => {
    const payload = {
      descripcion: form.descripcion.trim(),
      categoria: form.categoria.trim(),
      marca: form.marca.trim(),
      precio: Number(form.precio),
      stockMin: Number(form.stockMin),
      stockAct: Number(form.stockAct),
      upc: form.upc.trim(),
      sku: form.sku.trim(),
      imagenUrl: form.imagenUrl.trim(),
      esServicio: form.esServicio,
      activo: form.activo,
    };

    console.log("Product payload:", payload);

    return payload;
  };

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) return "No se pudo guardar el producto.";

    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.detail) return data.detail;

    return "No se pudo guardar el producto.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setServerError("");
      await onSubmit(buildPayload());
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
              {initialData ? "Editar" : "Nuevo"}
            </p>
            <h2 className="text-3xl font-black text-black">
              {initialData ? "Editar producto" : "Crear producto"}
            </h2>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              Completa la información del producto o servicio.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 font-bold text-slate-800 hover:bg-slate-300"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-black text-black">Descripción</label>
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
                placeholder="Ej. Combo familiar, entrada general, pizza personal..."
              />
              {errors.descripcion && (
                <p className="text-sm font-bold text-red-600">{errors.descripcion}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">Categoría</label>
              <input
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
                placeholder="Ej. Juegos, Paseos, Comedores..."
              />
              {errors.categoria && (
                <p className="text-sm font-bold text-red-600">{errors.categoria}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">Marca</label>
              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
                placeholder="Ej. Play Land"
              />
              {errors.marca && (
                <p className="text-sm font-bold text-red-600">{errors.marca}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">Precio</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
              />
              {errors.precio && (
                <p className="text-sm font-bold text-red-600">{errors.precio}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">Stock mínimo</label>
              <input
                name="stockMin"
                type="number"
                min="0"
                value={form.stockMin}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
              />
              {errors.stockMin && (
                <p className="text-sm font-bold text-red-600">{errors.stockMin}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">Stock actual</label>
              <input
                name="stockAct"
                type="number"
                min="0"
                value={form.stockAct}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
              />
              {errors.stockAct && (
                <p className="text-sm font-bold text-red-600">{errors.stockAct}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">UPC</label>
              <input
                name="upc"
                value={form.upc}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
              />
              {errors.upc && (
                <p className="text-sm font-bold text-red-600">{errors.upc}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-black">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
              />
              {errors.sku && (
                <p className="text-sm font-bold text-red-600">{errors.sku}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-black text-black">Imagen URL</label>
              <input
                name="imagenUrl"
                value={form.imagenUrl}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-cyan-200"
                placeholder="https://..."
              />
              {errors.imagenUrl && (
                <p className="text-sm font-bold text-red-600">{errors.imagenUrl}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-2xl bg-slate-50 px-4 py-4">
            <label className="flex items-center gap-3 text-sm font-semibold text-black">
              <input
                name="esServicio"
                type="checkbox"
                checked={form.esServicio}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Es servicio
            </label>

            <label className="flex items-center gap-3 text-sm font-semibold text-black">
              <input
                name="activo"
                type="checkbox"
                checked={form.activo}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Activo
            </label>
          </div>

          {serverError && (
            <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700">
              {serverError}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-200 px-5 py-3 font-black text-slate-800 transition hover:bg-slate-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Guardando..."
                : initialData
                ? "Guardar cambios"
                : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;