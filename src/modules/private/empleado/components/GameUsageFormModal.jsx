import { useEffect, useState } from "react";

const INITIAL_FORM = {
  idJuego: "",
  cantidadUso: "",
  fechaUso: "",
  descripcion: "",
  ultMant: "",
  proxMant: "",
};

function GameUsageFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  games = [],
  isSubmitting = false,
}) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const selectedGame = games.find(
        (g) => Number(g.idJuego) === Number(initialData?.juego?.idJuego)
      );

      setForm({
        idJuego: initialData?.juego?.idJuego || "",
        cantidadUso: initialData?.cantidadUso || "",
        fechaUso: initialData?.fechaUso || "",
        descripcion: initialData?.descripcion || "",
        ultMant: selectedGame?.ultMant || "",
        proxMant: selectedGame?.proxMant || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});
  }, [isOpen, initialData, games]);

  const validateField = (name, value) => {
    switch (name) {
      case "idJuego":
        if (!value) return "Debes seleccionar un juego.";
        return "";

      case "cantidadUso":
        if (!String(value).trim()) return "La cantidad de uso es obligatoria.";
        if (!/^\d+$/.test(String(value).trim())) {
          return "Debe ser un número entero.";
        }
        if (Number(value) < 1) return "Debe ser mayor a 0.";
        return "";

      case "fechaUso":
        if (!value) return "La fecha de uso es obligatoria.";
        return "";

      case "descripcion":
        if (!String(value).trim()) return "La descripción es obligatoria.";
        if (String(value).trim().length < 5) {
          return "Debe tener al menos 5 caracteres.";
        }
        return "";

      case "ultMant":
        if (!value) return "La fecha de último mantenimiento es obligatoria.";
        return "";

      case "proxMant":
        if (!value) return "La fecha de próximo mantenimiento es obligatoria.";
        if (form.ultMant && value < form.ultMant) {
          return "No puede ser menor que último mantenimiento.";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    ["idJuego", "cantidadUso", "fechaUso", "descripcion", "ultMant", "proxMant"].forEach(
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

    if (name === "cantidadUso") {
      if (/^\d*$/.test(value)) {
        setFieldValue(name, value);
      }
      return;
    }

    if (name === "idJuego") {
      const selectedGame = games.find((g) => Number(g.idJuego) === Number(value));

      setForm((prev) => ({
        ...prev,
        idJuego: value,
        ultMant: selectedGame?.ultMant || "",
        proxMant: selectedGame?.proxMant || "",
      }));

      setErrors((prev) => {
        const next = { ...prev };
        delete next.idJuego;
        delete next.ultMant;
        delete next.proxMant;
        return next;
      });
      return;
    }

    setFieldValue(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      idJuego: Number(form.idJuego),
      cantidadUso: form.cantidadUso.trim(),
      fechaUso: form.fechaUso,
      descripcion: form.descripcion.trim(),
      ultMant: form.ultMant,
      proxMant: form.proxMant,
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
              {isEdit ? "Editar uso de juego" : "Registrar uso de juego"}
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              El empleado registra uso operativo y actualiza mantenimiento del juego
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
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black text-black">Juego</label>
              <select
                name="idJuego"
                value={form.idJuego}
                onChange={handleChange}
                className={inputClass("idJuego")}
                disabled={isEdit}
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
              <label className="mb-2 block text-sm font-black text-black">Cantidad de uso</label>
              <input
                type="text"
                name="cantidadUso"
                value={form.cantidadUso}
                onChange={handleChange}
                className={inputClass("cantidadUso")}
                inputMode="numeric"
                maxLength={10}
                required
              />
              {renderError("cantidadUso")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Fecha de uso</label>
              <input
                type="date"
                name="fechaUso"
                value={form.fechaUso}
                onChange={handleChange}
                className={inputClass("fechaUso")}
                required
              />
              {renderError("fechaUso")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Últ. mantenimiento</label>
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
              <label className="mb-2 block text-sm font-black text-black">Próx. mantenimiento</label>
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
                maxLength={250}
                required
              />
              {renderError("descripcion")}
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

export default GameUsageFormModal;