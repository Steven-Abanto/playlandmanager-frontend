import { useEffect, useState } from "react";

const INITIAL_FORM = {
  tipoDoc: "DNI",
  numeDoc: "",
  nombre: "",
  apePaterno: "",
  apeMaterno: "",
  genero: "M",
  fechaNac: "",
  correo: "",
  telefono: "",
  direccion: "",
  local: 1,
  idCargo: 1,
  fechaInicio: "",
  fechaFin: "",
  activo: true,
  esAdmin: false,
  cuenta: {
    usuario: "",
    contrasena: "",
  },
};

const ONLY_LETTERS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const DOC_REGEX = /^\d{8,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{9,12}$/;
const USER_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;

function EmployeeFormModal({
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
        tipoDoc: initialData.tipoDoc || "DNI",
        numeDoc: initialData.numeDoc || "",
        nombre: initialData.nombre || "",
        apePaterno: initialData.apePaterno || "",
        apeMaterno: initialData.apeMaterno || "",
        genero: initialData.genero || "M",
        fechaNac: initialData.fechaNac || "",
        correo: initialData.correo || "",
        telefono: initialData.telefono || "",
        direccion: initialData.direccion || "",
        local: initialData.local || 1,
        idCargo: initialData.idCargo || 1,
        fechaInicio: initialData.fechaInicio || "",
        fechaFin: initialData.fechaFin || "",
        activo: initialData.activo ?? true,
        esAdmin: false,
        cuenta: {
          usuario: "",
          contrasena: "",
        },
      });
    } else {
      setForm(INITIAL_FORM);
    }

    setErrors({});
  }, [isOpen, initialData]);

  const setFieldError = (name, message) => {
    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const clearFieldError = (name) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    const today = new Date().toISOString().split("T")[0];

    switch (name) {
      case "nombre":
      case "apePaterno":
      case "apeMaterno":
        if (!trimmedValue) {
          return "Este campo es obligatorio.";
        }
        if (!ONLY_LETTERS_REGEX.test(trimmedValue)) {
          return "Solo se permiten letras y espacios.";
        }
        if (trimmedValue.length < 2) {
          return "Debe tener al menos 2 caracteres.";
        }
        return "";

      case "numeDoc":
        if (!trimmedValue) return "El número de documento es obligatorio.";
        if (!DOC_REGEX.test(trimmedValue)) {
          return "Debe tener entre 8 y 15 dígitos.";
        }
        return "";

      case "correo":
        if (!trimmedValue) return "El correo es obligatorio.";
        if (!EMAIL_REGEX.test(trimmedValue)) {
          return "Ingresa un correo válido.";
        }
        return "";

      case "telefono":
        if (!trimmedValue) return "El teléfono es obligatorio.";
        if (!PHONE_REGEX.test(trimmedValue)) {
          return "Debe tener entre 9 y 12 dígitos.";
        }
        return "";

      case "direccion":
        if (!trimmedValue) return "La dirección es obligatoria.";
        if (trimmedValue.length < 5) {
          return "La dirección es demasiado corta.";
        }
        return "";

      case "fechaNac":
        if (!trimmedValue) return "La fecha de nacimiento es obligatoria.";
        if (trimmedValue > today) {
          return "La fecha de nacimiento no puede ser futura.";
        }
        return "";

      case "fechaInicio":
        if (!trimmedValue) return "La fecha de inicio es obligatoria.";
        return "";

      case "fechaFin":
        if (trimmedValue && form.fechaInicio && trimmedValue < form.fechaInicio) {
          return "La fecha fin no puede ser menor que la fecha inicio.";
        }
        return "";

      case "local":
        if (!value || Number(value) < 1) {
          return "El local debe ser mayor o igual a 1.";
        }
        return "";

      case "idCargo":
        if (!value || Number(value) < 1) {
          return "El cargo es obligatorio.";
        }
        return "";

      case "usuario":
        if (isEdit) return "";
        if (!trimmedValue) return "El usuario es obligatorio.";
        if (!USER_REGEX.test(trimmedValue)) {
          return "Usa 4 a 20 caracteres: letras, números, punto, guion o guion bajo.";
        }
        return "";

      case "contrasena":
        if (isEdit) return "";
        if (!trimmedValue) return "La contraseña es obligatoria.";
        if (trimmedValue.length < 6) {
          return "Debe tener al menos 6 caracteres.";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const fieldsToValidate = [
      "numeDoc",
      "nombre",
      "apePaterno",
      "apeMaterno",
      "fechaNac",
      "correo",
      "telefono",
      "direccion",
      "local",
      "idCargo",
      "fechaInicio",
      "fechaFin",
    ];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    if (!isEdit) {
      const usuarioError = validateField("usuario", form.cuenta.usuario);
      const contrasenaError = validateField("contrasena", form.cuenta.contrasena);

      if (usuarioError) newErrors.usuario = usuarioError;
      if (contrasenaError) newErrors.contrasena = contrasenaError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let nextValue = type === "checkbox" ? checked : value;

    if (["nombre", "apePaterno", "apeMaterno"].includes(name)) {
      if (nextValue === "" || ONLY_LETTERS_REGEX.test(nextValue)) {
        setForm((prev) => ({
          ...prev,
          [name]: nextValue,
        }));
      }
    } else if (name === "numeDoc") {
      if (/^\d*$/.test(nextValue)) {
        setForm((prev) => ({
          ...prev,
          [name]: nextValue,
        }));
      }
    } else if (name === "telefono") {
      if (/^\d*$/.test(nextValue)) {
        setForm((prev) => ({
          ...prev,
          [name]: nextValue,
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: nextValue,
      }));
    }

    const valueToValidate =
      ["nombre", "apePaterno", "apeMaterno", "numeDoc", "telefono"].includes(name)
        ? nextValue
        : type === "checkbox"
        ? checked
        : value;

    const error = validateField(name, valueToValidate);
    if (error) setFieldError(name, error);
    else clearFieldError(name);
  };

  const handleCuentaChange = (e) => {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "usuario") {
      nextValue = value.replace(/\s/g, "");
    }

    setForm((prev) => ({
      ...prev,
      cuenta: {
        ...prev.cuenta,
        [name]: nextValue,
      },
    }));

    const error = validateField(name, nextValue);
    if (error) setFieldError(name, error);
    else clearFieldError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...form,
      numeDoc: form.numeDoc.trim(),
      nombre: form.nombre.trim(),
      apePaterno: form.apePaterno.trim(),
      apeMaterno: form.apeMaterno.trim(),
      correo: form.correo.trim().toLowerCase(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      local: Number(form.local),
      idCargo: Number(form.idCargo),
      fechaFin: form.fechaFin || null,
      cuenta: {
        usuario: form.cuenta.usuario.trim(),
        contrasena: form.cuenta.contrasena,
      },
    };

    await onSubmit(payload);
  };

  const inputClass = (fieldName) =>
    `w-full rounded-xl border px-4 py-3 font-semibold outline-none ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (fieldName) =>
    errors[fieldName] ? (
      <p className="mt-1 text-xs font-semibold text-red-600">{errors[fieldName]}</p>
    ) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-black">
              {isEdit ? "Editar empleado" : "Nuevo empleado"}
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              {isEdit
                ? "Actualiza los datos del empleado"
                : "Registra un empleado o administrador con acceso al sistema"}
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
          {!isEdit && (
            <div className="rounded-2xl bg-cyan-50 p-4">
              <label className="flex items-center gap-3 text-sm font-bold text-slate-800">
                <input
                  type="checkbox"
                  name="esAdmin"
                  checked={form.esAdmin}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Crear esta cuenta como ADMIN
              </label>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                Úsalo solo en casos especiales. Si no se marca, se registrará como EMPLEADO.
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-black text-black">Tipo documento</label>
              <select
                name="tipoDoc"
                value={form.tipoDoc}
                onChange={handleChange}
                className={inputClass("tipoDoc")}
              >
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Número documento</label>
              <input
                type="text"
                name="numeDoc"
                value={form.numeDoc}
                onChange={handleChange}
                className={inputClass("numeDoc")}
                maxLength={15}
                inputMode="numeric"
                required
              />
              {renderError("numeDoc")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Género</label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className={inputClass("genero")}
              >
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={inputClass("nombre")}
                maxLength={50}
                required
              />
              {renderError("nombre")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Apellido paterno</label>
              <input
                type="text"
                name="apePaterno"
                value={form.apePaterno}
                onChange={handleChange}
                className={inputClass("apePaterno")}
                maxLength={50}
                required
              />
              {renderError("apePaterno")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Apellido materno</label>
              <input
                type="text"
                name="apeMaterno"
                value={form.apeMaterno}
                onChange={handleChange}
                className={inputClass("apeMaterno")}
                maxLength={50}
                required
              />
              {renderError("apeMaterno")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Fecha nacimiento</label>
              <input
                type="date"
                name="fechaNac"
                value={form.fechaNac}
                onChange={handleChange}
                className={inputClass("fechaNac")}
                required
              />
              {renderError("fechaNac")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Correo</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                className={inputClass("correo")}
                maxLength={100}
                required
              />
              {renderError("correo")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className={inputClass("telefono")}
                maxLength={12}
                inputMode="numeric"
                required
              />
              {renderError("telefono")}
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-black text-black">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className={inputClass("direccion")}
                maxLength={150}
                required
              />
              {renderError("direccion")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">Local</label>
              <input
                type="number"
                name="local"
                value={form.local}
                onChange={handleChange}
                className={inputClass("local")}
                min="1"
                required
              />
              {renderError("local")}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-black">ID Cargo</label>
              <input
                type="number"
                name="idCargo"
                value={form.idCargo}
                onChange={handleChange}
                className={inputClass("idCargo")}
                min="1"
                required
              />
              {renderError("idCargo")}
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
              />
              {renderError("fechaFin")}
            </div>

            {isEdit && (
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <label className="text-sm font-bold text-slate-800">Empleado activo</label>
              </div>
            )}
          </div>

          {!isEdit && (
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="mb-4 text-lg font-black text-black">Cuenta de acceso</p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black text-black">Usuario</label>
                  <input
                    type="text"
                    name="usuario"
                    value={form.cuenta.usuario}
                    onChange={handleCuentaChange}
                    className={inputClass("usuario")}
                    maxLength={20}
                    required
                  />
                  {renderError("usuario")}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-black">Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={form.cuenta.contrasena}
                    onChange={handleCuentaChange}
                    className={inputClass("contrasena")}
                    minLength={6}
                    required
                  />
                  {renderError("contrasena")}
                </div>
              </div>
            </div>
          )}

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

export default EmployeeFormModal;