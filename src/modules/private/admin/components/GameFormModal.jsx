import { useEffect, useState } from "react";

const INITIAL_FORM = {
  codigo: "",
  nombre: "",
  tipo: "",
  descripcion: "",
  estado: "OPERATIVO",
  ultMant: "",
  proxMant: "",
  activo: true,
};

const CODE_REGEX = /^[A-Za-z0-9_-]{3,20}$/;
const TEXT_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-.,()]+$/;

function GameFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        codigo: initialData.codigo || "",
        nombre: initialData.nombre || "",
        tipo: initialData.tipo || "",
        descripcion: initialData.descripcion || "",
        estado: initialData.estado || "OPERATIVO",
        ultMant: initialData.ultMant || "",
        proxMant: initialData.proxMant || "",
        activo: initialData.activo ?? true,
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});
  }, [isOpen, initialData]);

  const validateField = (name, value) => {
    const trimmed = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "codigo":
        if (!trimmed) return "El código es obligatorio.";
        if (!CODE_REGEX.test(trimmed)) {
          return "Usa 3 a 20 caracteres: letras, números, guion o guion bajo.";
        }
        return "";

      case "nombre":
        if (!trimmed) return "El nombre es obligatorio.";
        if (trimmed.length < 3) return "Debe tener al menos 3 caracteres.";
        if (!TEXT_REGEX.test(trimmed)) return "Contiene caracteres no válidos.";
        return "";

      case "tipo":
        if (!trimmed) return "El tipo es obligatorio.";
        if (trimmed.length < 3) return "Debe tener al menos 3 caracteres.";
        if (!TEXT_REGEX.test(trimmed)) return "Contiene caracteres no válidos.";
        return "";

      case "descripcion":
        if (!trimmed) return "La descripción es obligatoria.";
        if (trimmed.length < 5) return "Debe tener al menos 5 caracteres.";
        return "";

      case "estado":
        if (!trimmed) return "El estado es obligatorio.";
        return "";

      case "ultMant":
        if (!trimmed) return "La fecha de último mantenimiento es obligatoria.";
        return "";

      case "proxMant":
        if (!trimmed) return "La fecha de próximo mantenimiento es obligatoria.";
        if (form.ultMant && trimmed < form.ultMant) {
          return "No puede ser menor que la fecha de último mantenimiento.";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    ["codigo", "nombre", "tipo", "descripcion", "estado", "ultMant", "proxMant"].forEach(
      (field) => {
        const error = validateField(field, form[field]);
        if (error) newErrors[field] = error;
      }
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setFieldValue = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldValue(name, type === "checkbox" ? checked : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...form,
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      tipo: form.tipo.trim(),
      descripcion: form.descripcion.trim(),
    };

    await onSubmit(payload);
  };

  const inputClass = (name) =>
    `w-full rounded-xl border px-4 py-3 font-semibold outline-none ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (name) =>
    errors[name] ? (
      <p className="mt-1 text-xs font-semibold text-red-600">{errors[name]}</p>
    ) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-black">
              {isEdit ? "Editar juego" : "Nuevo juego"}
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              Registra y actualiza juegos mecánicos del parque
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl bg-slate-200 px-4 py-2 font-bold text-black transition hover:bg-slate-300 disabled:opacity-60"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-black">Código</label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                className={inputClass("codigo")}
                maxLength={20}
                required
              />
              {renderError("codigo")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={inputClass("nombre")}
                maxLength={80}
                required
              />
              {renderError("nombre")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Tipo</label>
              <input
                type="text"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className={inputClass("tipo")}
                maxLength={60}
                required
              />
              {renderError("tipo")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className={inputClass("estado")}
              >
                <option value="OPERATIVO">OPERATIVO</option>
                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                <option value="INACTIVO">INACTIVO</option>
                <option value="FUERA_DE_SERVICIO">FUERA_DE_SERVICIO</option>
              </select>
              {renderError("estado")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Último mantenimiento</label>
              <input
                type="date"
                name="ultMant"
                value={form.ultMant}
                onChange={handleChange}
                className={inputClass("ultMant")}
                required
              />
              {renderError("ultMant")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Próximo mantenimiento</label>
              <input
                type="date"
                name="proxMant"
                value={form.proxMant}
                onChange={handleChange}
                className={inputClass("proxMant")}
                required
              />
              {renderError("proxMant")}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className={`${inputClass("descripcion")} min-h-[120px] resize-none`}
                maxLength={300}
                required
              />
              {renderError("descripcion")}
            </div>

            {isEdit && (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label className="text-sm font-bold text-slate-800">Juego activo</label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl bg-slate-200 px-5 py-3 font-black text-black transition hover:bg-slate-300 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-black text-white transition hover:bg-cyan-600 disabled:opacity-60"
            >
              {isSubmitting
                ? "Guardando..."
                : isEdit
                ? "Guardar cambios"
                : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameFormModal;