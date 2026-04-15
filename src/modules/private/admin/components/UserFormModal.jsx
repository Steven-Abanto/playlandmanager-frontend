import { useEffect, useState } from "react";

const INITIAL_FORM = {
  usuario: "",
  rol: "CLIENTE",
  activo: true,
  idEmpleado: "",
  idCliente: "",
  contrasena: "",
};

const USER_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;

function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  isSuperAdmin = false,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || !initialData) return;

    setForm({
      usuario: initialData.usuario || "",
      rol: initialData.rol || "CLIENTE",
      activo: initialData.activo ?? true,
      idEmpleado: initialData.idEmpleado ?? "",
      idCliente: initialData.idCliente ?? "",
      contrasena: "",
    });

    setErrors({});
  }, [isOpen, initialData]);

  if (!isOpen || !initialData) return null;

  const roleOptions = isSuperAdmin
    ? ["CLIENTE", "EMPLEADO", "ADMIN", "SUPER_ADMIN"]
    : ["CLIENTE", "EMPLEADO", "ADMIN"];

  const validateForm = () => {
    const nextErrors = {};

    if (!USER_REGEX.test(form.usuario.trim())) {
      nextErrors.usuario =
        "Usa 4 a 20 caracteres: letras, números, punto, guion o guion bajo.";
    }

    if (!form.rol) {
      nextErrors.rol = "El rol es obligatorio.";
    }

    if (form.rol === "CLIENTE") {
      if (!form.idCliente || Number(form.idCliente) < 1) {
        nextErrors.idCliente = "Para CLIENTE debes indicar idCliente válido.";
      }
    }

    if (form.rol === "EMPLEADO" || form.rol === "ADMIN" || form.rol === "SUPER_ADMIN") {
      if (!form.idEmpleado || Number(form.idEmpleado) < 1) {
        nextErrors.idEmpleado = "Para este rol debes indicar idEmpleado válido.";
      }
    }

    if (form.contrasena && form.contrasena.length < 6) {
      nextErrors.contrasena = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: nextValue,
      };

      if (name === "rol") {
        if (value === "CLIENTE") {
          updated.idEmpleado = "";
        } else {
          updated.idCliente = "";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      usuario: form.usuario.trim(),
      rol: form.rol,
      activo: form.activo,
      idEmpleado:
        form.rol === "EMPLEADO" || form.rol === "ADMIN" || form.rol === "SUPER_ADMIN"
          ? Number(form.idEmpleado)
          : null,
      idCliente: form.rol === "CLIENTE" ? Number(form.idCliente) : null,
    };

    if (form.contrasena.trim()) {
      payload.contrasena = form.contrasena.trim();
    }

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-black">Editar usuario</h2>
            <p className="text-sm font-semibold text-gray-600">
              Modifica cuenta, rol, relación y estado del usuario
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
              <label className="mb-2 block text-sm font-black text-black">Usuario</label>
              <input
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                className={inputClass("usuario")}
                maxLength={20}
                required
              />
              {renderError("usuario")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Rol</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className={inputClass("rol")}
              >
                {roleOptions.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
              {renderError("rol")}
            </div>

            {form.rol === "CLIENTE" ? (
              <div>
                <label className="mb-2 block text-sm font-black text-black">ID Cliente</label>
                <input
                  type="number"
                  name="idCliente"
                  value={form.idCliente}
                  onChange={handleChange}
                  className={inputClass("idCliente")}
                  min="1"
                  required
                />
                {renderError("idCliente")}
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-black text-black">ID Empleado</label>
                <input
                  type="number"
                  name="idEmpleado"
                  value={form.idEmpleado}
                  onChange={handleChange}
                  className={inputClass("idEmpleado")}
                  min="1"
                  required
                />
                {renderError("idEmpleado")}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-black text-black">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                className={inputClass("contrasena")}
                minLength={6}
                placeholder="Opcional"
              />
              {renderError("contrasena")}
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label className="text-sm font-bold text-slate-800">Usuario activo</label>
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
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;