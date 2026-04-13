import { Link } from "react-router-dom";
import { useAuth } from "../../../../auth/AuthContext";

function AdminPanelPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="grid lg:grid-cols-[1fr_1.2fr]">
          <section className="flex flex-col justify-between gap-8 bg-blue-900 px-8 py-10 text-white sm:px-10 lg:px-12">
            <div className="space-y-5">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/30"
              >
                ← Volver al inicio
              </Link>

              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-yellow-400 px-4 py-1 text-sm font-black text-blue-900">
                  Panel Admin
                </span>

                <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">
                  Administración general
                </h1>

                <p className="max-w-xl text-lg leading-7 text-blue-100 sm:text-xl">
                  Gestiona productos, promociones, usuarios y los módulos internos
                  del sistema desde un solo lugar.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Administrador</p>
                <p className="mt-2 text-lg font-black text-white">
                  {user?.username || "Usuario admin"}
                </p>
              </article>

              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Rol principal</p>
                <p className="mt-2 text-lg font-black text-white">
                  {user?.rolPrincipal || "ADMIN"}
                </p>
              </article>

              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Estado</p>
                <p className="mt-2 text-lg font-black text-white">
                  {user?.activo ? "Cuenta activa" : "Cuenta inactiva"}
                </p>
              </article>

              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Acceso</p>
                <p className="mt-2 text-lg font-black text-white">
                  Gestión interna del sistema
                </p>
              </article>
            </div>
          </section>

          <section className="bg-white px-6 py-10 sm:px-10 lg:px-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
                  Módulos
                </p>
                <h2 className="text-4xl font-black text-black">
                  Accesos de administración
                </h2>
                <p className="text-sm leading-6 text-gray-700">
                  Selecciona el módulo que quieres gestionar. Empezaremos por
                  productos, y luego continuaremos con promociones y otros
                  procesos internos.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Link
                  to="/admin/productos"
                  className="rounded-3xl bg-cyan-100 p-6 transition hover:-translate-y-1 hover:bg-cyan-200"
                >
                  <p className="text-sm font-black uppercase tracking-wide text-cyan-800">
                    Catálogo
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-black">
                    Gestionar productos
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-gray-700">
                    Crea, edita y desactiva productos o servicios del catálogo.
                  </p>
                </Link>

                <Link
                  to="/admin/promociones"
                  className="rounded-3xl bg-yellow-100 p-6 transition hover:-translate-y-1 hover:bg-yellow-200"
                >
                  <p className="text-sm font-black uppercase tracking-wide text-yellow-800">
                    Comercial
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-black">
                    Gestionar promociones
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-gray-700">
                    Administra descuentos, campañas y relaciones con productos.
                  </p>
                </Link>

                <Link
                  to="/admin/usuarios"
                  className="rounded-3xl bg-red-100 p-6 transition hover:-translate-y-1 hover:bg-red-200"
                >
                  <p className="text-sm font-black uppercase tracking-wide text-red-700">
                    Seguridad
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-black">
                    Gestionar usuarios
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-gray-700">
                    Revisa accesos, perfiles y administración de cuentas.
                  </p>
                </Link>

                <div className="rounded-3xl bg-slate-100 p-6">
                  <p className="text-sm font-black uppercase tracking-wide text-slate-700">
                    Próximamente
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-black">
                    Reservas y reportes
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-gray-700">
                    Más adelante podrás administrar reservas, atención operativa
                    y reportes del parque.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-lg font-black text-black">
                  Flujo recomendado de desarrollo
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-gray-700">
                  1. Productos<br />
                  2. Promociones<br />
                  3. Reservas<br />
                  4. Ajustes operativos
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminPanelPage;