import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_FORM = {
  email: "",
  password: "",
  remember: false,
};

function LoginPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const helperText = useMemo(() => {
    return status.type === "success"
      ? "Tu formulario quedó listo para conectarse a la API de autenticación."
      : "Ingresa con tu cuenta para revisar tu perfil, compras y promociones personalizadas.";
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
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-400 to-amber-300 px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between gap-10 bg-slate-950 px-8 py-10 text-white sm:px-10 lg:px-12">
          <div className="space-y-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              ← Volver al inicio
            </Link>

            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-amber-300">
                Acceso a clientes
              </span>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Inicia sesión en Play Land Manager
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Gestiona tus reservas, consulta promociones activas y mantente al día
                con las novedades del parque desde una sola cuenta.
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
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-amber-300">Beneficio 01</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Revisa productos y experiencias destacadas con acceso rápido.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-amber-300">Beneficio 02</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Guarda tus datos para futuras compras y visitas al parque.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-amber-300">Beneficio 03</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Recibe promociones personalizadas y novedades exclusivas.
              </p>
            </article>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
                Bienvenido
              </p>
              <h2 className="text-3xl font-black text-slate-900">Accede a tu cuenta</h2>
              <p className="text-sm leading-6 text-slate-600">{helperText}</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-red-500 transition hover:text-red-600"
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />
                {errors.password && (
                  <p className="text-sm font-medium text-red-600">{errors.password}</p>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-red-500 focus:ring-red-400"
                />
                Recordar mi sesión en este dispositivo
              </label>

              {status.message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    status.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-red-500 px-4 py-3 text-base font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isSubmitting ? "Validando acceso..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-100 px-4 py-4 text-sm leading-6 text-slate-600">
              ¿Aún no tienes cuenta? <span className="font-semibold text-slate-900">Solicita tu acceso con el equipo de Play Land.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;


