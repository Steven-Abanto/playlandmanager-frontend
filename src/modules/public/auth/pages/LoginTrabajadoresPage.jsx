import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const INITIAL_FORM = {
  email: "",
  password: "",
  remember: false,
};

function LoginTrabajadoresPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const helperText = useMemo(() => {
    return status.type === "success"
      ? "Tu formulario quedó listo para conectarse a la API de autenticación."
      : "Ingresa con tu cuenta de trabajador para acceder al panel de administración.";
  }, [status.type]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
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

    if (!form.email.trim()) {
      nextErrors.email = "Ingresa tu correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Escribe un correo válido.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Ingresa tu contraseña.";
    } else if (form.password.trim().length < 6) {
      nextErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return nextErrors;
  };

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

    await new Promise((resolve) => window.setTimeout(resolve, 700));

    setIsSubmitting(false);
    setStatus({
      type: "success",
      message:
        "Vista de login lista. El siguiente paso es conectarla con tu servicio de autenticación.",
    });
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
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex rounded-full bg-white/20 px-4 py-1 text-sm font-bold text-white hover:bg-white/30 transition"
                >
                  Acceso clientes
                </button>
                <span className="inline-flex rounded-full bg-yellow-400 px-4 py-1 text-sm font-black text-blue-900">
                  Acceso trabajadores
                </span>
              </div>
              <h1 className="text-5xl font-black leading-tight sm:text-6xl text-white">
                Panel de Trabajadores
              </h1>
              <p className="max-w-xl text-lg leading-7 text-blue-100 sm:text-xl">
                Accede al panel de control para gestionar el parque, promociones y consultar reportes.
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
              <p className="text-sm font-bold text-yellow-300">Beneficio 01</p>
              <p className="mt-2 text-sm leading-6 text-white">
                Gestiona productos, promociones y disponibilidad del parque.
              </p>
            </article>
            <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold text-yellow-300">Beneficio 02</p>
              <p className="mt-2 text-sm leading-6 text-white">
                Visualiza reservas y consulta el historial de transacciones.
              </p>
            </article>
            <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold text-yellow-300">Beneficio 03</p>
              <p className="mt-2 text-sm leading-6 text-white">
                Accede a reportes detallados y análisis de desempeño.
              </p>
            </article>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
                Bienvenido
              </p>
              <h2 className="text-4xl font-black text-black">Acceso de trabajador</h2>
              <p className="text-sm leading-6 text-gray-700">{helperText}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-black text-black">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                />
                {errors.email && (
                  <p className="text-sm font-bold text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-black text-black">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-sm text-red-600 transition hover:text-red-700 underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3 text-base font-semibold outline-none transition focus:ring-4 focus:ring-cyan-200"
                />
                {errors.password && (
                  <p className="text-sm font-bold text-red-600">{errors.password}</p>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold text-black">
                <input
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded cursor-pointer"
                />
                Recordar mi sesión en este dispositivo
              </label>

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
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-base font-black text-white transition hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Validando acceso..." : "Iniciar sesión"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginTrabajadoresPage;




