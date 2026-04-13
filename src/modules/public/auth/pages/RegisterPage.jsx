import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerClienteRequest } from "../../../../auth/authService";

const INITIAL_FORM = {
  tipoDoc: "DNI",
  numeDoc: "",
  nombre: "",
  apePaterno: "",
  apeMaterno: "",
  genero: "",
  fechaNac: "",
  correo: "",
  telefono: "",
  direccion: "",
  usuario: "",
  contrasena: "",
  confirmarContrasena: "",
};

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (status.type !== "idle") {
      setStatus({ type: "idle", message: "" });
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.tipoDoc.trim()) {
      nextErrors.tipoDoc = "Selecciona el tipo de documento.";
    }

    if (!form.numeDoc.trim()) {
      nextErrors.numeDoc = "Ingresa el número de documento.";
    } else if (form.numeDoc.trim().length < 8 || form.numeDoc.trim().length > 15) {
      nextErrors.numeDoc = "El documento debe tener entre 8 y 15 caracteres.";
    }

    if (!form.nombre.trim()) {
      nextErrors.nombre = "Ingresa tu nombre.";
    }

    if (!form.apePaterno.trim()) {
      nextErrors.apePaterno = "Ingresa tu apellido paterno.";
    }

    if (!form.genero.trim()) {
      nextErrors.genero = "Selecciona tu género.";
    }

    if (!form.fechaNac) {
      nextErrors.fechaNac = "Ingresa tu fecha de nacimiento.";
    } else {
      const fecha = new Date(form.fechaNac);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fecha >= hoy) {
        nextErrors.fechaNac = "La fecha de nacimiento debe ser anterior a hoy.";
      }
    }

    if (!form.correo.trim()) {
      nextErrors.correo = "Ingresa tu correo.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      nextErrors.correo = "Ingresa un correo válido.";
    }

    if (!form.telefono.trim()) {
      nextErrors.telefono = "Ingresa tu teléfono.";
    }

    if (!form.direccion.trim()) {
      nextErrors.direccion = "Ingresa tu dirección.";
    }

    if (!form.usuario.trim()) {
      nextErrors.usuario = "Ingresa tu usuario.";
    } else if (form.usuario.trim().length < 4) {
      nextErrors.usuario = "El usuario debe tener al menos 4 caracteres.";
    }

    if (!form.contrasena.trim()) {
      nextErrors.contrasena = "Ingresa tu contraseña.";
    } else if (form.contrasena.trim().length < 6) {
      nextErrors.contrasena = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!form.confirmarContrasena.trim()) {
      nextErrors.confirmarContrasena = "Confirma tu contraseña.";
    } else if (form.contrasena !== form.confirmarContrasena) {
      nextErrors.confirmarContrasena = "Las contraseñas no coinciden.";
    }

    return nextErrors;
  };

  const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) return "No se pudo completar el registro.";

    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.detail) return data.detail;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }

    return "No se pudo completar el registro.";
  };

  const buildPayload = () => ({
    tipoDoc: form.tipoDoc.trim(),
    numeDoc: form.numeDoc.trim(),
    nombre: form.nombre.trim(),
    apePaterno: form.apePaterno.trim(),
    apeMaterno: form.apeMaterno.trim() || null,
    genero: form.genero.trim(),
    fechaNac: form.fechaNac,
    correo: form.correo.trim(),
    telefono: form.telefono.trim(),
    direccion: form.direccion.trim(),
    cuenta: {
      usuario: form.usuario.trim(),
      contrasena: form.contrasena,
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({
        type: "error",
        message: "Revisa los campos marcados antes de continuar.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      await registerClienteRequest(buildPayload());

      setStatus({
        type: "success",
        message: "Cuenta creada correctamente. Redirigiendo al login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setStatus({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-300 px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between gap-10 bg-blue-900 px-8 py-10 text-white sm:px-10 lg:px-12">
          <div className="space-y-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30"
            >
              ← Volver al inicio
            </Link>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-yellow-400 px-4 py-1 text-sm font-black text-blue-900">
                  Nuevo cliente
                </span>
              </div>

              <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">
                Crea tu cuenta en Play Land Manager
              </h1>

              <p className="max-w-xl text-lg leading-7 text-blue-100 sm:text-xl">
                Regístrate para consultar promociones, guardar tus datos y acceder más rápido a futuras compras y visitas.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Play Land Park Logo"
              className="h-48 w-auto object-contain"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold text-yellow-300">Paso 01</p>
              <p className="mt-2 text-sm leading-6 text-white">
                Completa tus datos personales y crea tu acceso.
              </p>
            </article>
            <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold text-yellow-300">Paso 02</p>
              <p className="mt-2 text-sm leading-6 text-white">
                Guarda tu cuenta para futuras compras y promociones.
              </p>
            </article>
            <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold text-yellow-300">Paso 03</p>
              <p className="mt-2 text-sm leading-6 text-white">
                Accede a una experiencia más rápida y personalizada.
              </p>
            </article>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
                Registro
              </p>
              <h2 className="text-4xl font-black text-black">Crea tu cuenta</h2>
              <p className="text-sm leading-6 text-gray-700">
                Completa el formulario para registrarte como cliente.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="tipoDoc" className="text-sm font-black text-black">
                    Tipo de documento
                  </label>
                  <select
                    id="tipoDoc"
                    name="tipoDoc"
                    value={form.tipoDoc}
                    onChange={handleChange}
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                  {errors.tipoDoc && (
                    <p className="text-sm font-bold text-red-600">{errors.tipoDoc}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="numeDoc" className="text-sm font-black text-black">
                    Número de documento
                  </label>
                  <input
                    id="numeDoc"
                    name="numeDoc"
                    type="text"
                    value={form.numeDoc}
                    onChange={handleChange}
                    placeholder="Ingresa tu documento"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.numeDoc && (
                    <p className="text-sm font-bold text-red-600">{errors.numeDoc}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="apePaterno" className="text-sm font-black text-black">
                    Apellido paterno
                  </label>
                  <input
                    id="apePaterno"
                    name="apePaterno"
                    type="text"
                    value={form.apePaterno}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido paterno"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.apePaterno && (
                    <p className="text-sm font-bold text-red-600">{errors.apePaterno}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="apeMaterno" className="text-sm font-black text-black">
                    Apellido materno
                  </label>
                  <input
                    id="apeMaterno"
                    name="apeMaterno"
                    type="text"
                    value={form.apeMaterno}
                    onChange={handleChange}
                    placeholder="Ingresa tu apellido materno"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-black text-black">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.nombre && (
                    <p className="text-sm font-bold text-red-600">{errors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="genero" className="text-sm font-black text-black">
                    Género
                  </label>
                  <select
                    id="genero"
                    name="genero"
                    value={form.genero}
                    onChange={handleChange}
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  >
                    <option value="">Selecciona</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  {errors.genero && (
                    <p className="text-sm font-bold text-red-600">{errors.genero}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="fechaNac" className="text-sm font-black text-black">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="fechaNac"
                    name="fechaNac"
                    type="date"
                    value={form.fechaNac}
                    onChange={handleChange}
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.fechaNac && (
                    <p className="text-sm font-bold text-red-600">{errors.fechaNac}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-sm font-black text-black">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="text"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Ingresa tu teléfono"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.telefono && (
                    <p className="text-sm font-bold text-red-600">{errors.telefono}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="correo" className="text-sm font-black text-black">
                Correo
                </label>
                <input
                id="correo"
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                />
                {errors.correo && (
                <p className="text-sm font-bold text-red-600">{errors.correo}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="direccion" className="text-sm font-black text-black">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Ingresa tu dirección"
                  className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                />
                {errors.direccion && (
                  <p className="text-sm font-bold text-red-600">{errors.direccion}</p>
                )}
              </div>

                <div className="space-y-2">
                  <label htmlFor="usuario" className="text-sm font-black text-black">
                    Usuario
                  </label>
                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    value={form.usuario}
                    onChange={handleChange}
                    placeholder="Crea tu usuario"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.usuario && (
                    <p className="text-sm font-bold text-red-600">{errors.usuario}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contrasena" className="text-sm font-black text-black">
                    Contraseña
                  </label>
                  <input
                    id="contrasena"
                    name="contrasena"
                    type="password"
                    value={form.contrasena}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                  />
                  {errors.contrasena && (
                    <p className="text-sm font-bold text-red-600">{errors.contrasena}</p>
                  )}
                </div>

              <div className="space-y-2">
                <label htmlFor="confirmarContrasena" className="text-sm font-black text-black">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  type="password"
                  value={form.confirmarContrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                />
                {errors.confirmarContrasena && (
                  <p className="text-sm font-bold text-red-600">{errors.confirmarContrasena}</p>
                )}
              </div>

              {status.message && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                    status.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-base font-black text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creando cuenta..." : "Registrarme"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-yellow-100 px-4 py-4 text-sm font-semibold leading-6 text-black">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-red-600">
                Inicia sesión
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;