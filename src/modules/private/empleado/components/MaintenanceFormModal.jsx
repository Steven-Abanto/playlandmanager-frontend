import { useEffect, useState } from "react";

const INITIAL_FORM = {
  idEmpleado: "",
  idJuego: "",
  fechaInicio: "",
  fechaFin: "",
  resultado: "",
  observaciones: "",
};

function MaintenanceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  employees = [],
  games = [],
  isSubmitting = false,
}) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        idEmpleado: initialData.idEmpleado || "",
        idJuego: initialData.juego?.idJuego || "",
        fechaInicio: initialData.fechaInicio || "",
        fechaFin: initialData.fechaFin || "",
        resultado: initialData.resultado || "",
        observaciones: initialData.observaciones || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});
  }, [isOpen, initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case "idEmpleado":
        if (!value) return "Debes seleccionar un empleado.";
        return "";

      case "idJuego":
        if (!value) return "Debes seleccionar un juego.";
        return "";

      case "fechaInicio":
        if (!value) return "La fecha de inicio es obligatoria.";
        return "";

      case "fechaFin":
        if (!value) return "La fecha de fin es obligatoria.";
        if (form.fechaInicio && value < form.fechaInicio) {
          return "No puede ser menor que la fecha de inicio.";
        }
        return "";

      case "resultado":
        if (!String(value).trim()) return "El resultado es obligatorio.";
        if (String(value).trim().length < 3) return "Debe tener al menos 3 caracteres.";
        return "";

      case "observaciones":
        if (value && String(value).trim().length > 0 && String(value).trim().length < 3) {
          return "Si ingresas observaciones, deben tener al menos 3 caracteres.";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    ["idEmpleado", "idJuego", "fechaInicio", "fechaFin", "resultado", "observaciones"].forEach(
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
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      idEmpleado: Number(form.idEmpleado),
      idJuego: Number(form.idJuego),
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      resultado: form.resultado.trim(),
      observaciones: form.observaciones.trim(),
    });
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
              {isEdit ? "Editar mantenimiento" : "Nuevo mantenimiento"}
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              Registra trabajos de mantenimiento sobre juegos mecánicos
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
              <label className="mb-2 block text-sm font-black text-black">Empleado</label>
              <select
                name="idEmpleado"
                value={form.idEmpleado}
                onChange={handleChange}
                className={inputClass("idEmpleado")}
              >
                <option value="">Selecciona un empleado</option>
                {employees.map((employee) => (
                  <option key={employee.idEmpleado} value={employee.idEmpleado}>
                    {employee.nombre} {employee.apePaterno} {employee.apeMaterno}
                  </option>
                ))}
              </select>
              {renderError("idEmpleado")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Juego</label>
              <select
                name="idJuego"
                value={form.idJuego}
                onChange={handleChange}
                className={inputClass("idJuego")}
              >
                <option value="">Selecciona un juego</option>
                {games.map((game) => (
                  <option key={game.idJuego} value={game.idJuego}>
                    {game.codigo} - {game.nombre}
                  </option>
                ))}
              </select>
              {renderError("idJuego")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Fecha inicio</label>
              <input
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
                className={inputClass("fechaInicio")}
                required
              />
              {renderError("fechaInicio")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Fecha fin</label>
              <input
                type="date"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
                className={inputClass("fechaFin")}
                required
              />
              {renderError("fechaFin")}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">Resultado</label>
              <input
                type="text"
                name="resultado"
                value={form.resultado}
                onChange={handleChange}
                className={inputClass("resultado")}
                maxLength={120}
                required
              />
              {renderError("resultado")}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">Observaciones</label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                className={`${inputClass("observaciones")} min-h-[120px] resize-none`}
                maxLength={300}
              />
              {renderError("observaciones")}
            </div>
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

export default MaintenanceFormModal;