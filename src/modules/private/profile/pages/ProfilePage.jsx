import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../auth/AuthContext";
import { getClienteByIdRequest } from "../services/clienteService";
import { getEmpleadoByIdRequest } from "../services/empleadoService";

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm font-black text-gray-500">{label}</p>
      <p className="mt-2 text-lg font-black text-black">{value || "No disponible"}</p>
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  const rolPrincipal = user?.rolPrincipal || "SIN_ROL";
  const isCliente = rolPrincipal === "CLIENTE";
  const isEmpleado = rolPrincipal === "EMPLEADO";
  const isAdmin = rolPrincipal === "ADMIN";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        setProfileError("");

        if (isCliente && user.idCliente) {
          const data = await getClienteByIdRequest(user.idCliente);
          setProfileData(data);
          return;
        }

        if ((isEmpleado || isAdmin) && user.idEmpleado) {
          const data = await getEmpleadoByIdRequest(user.idEmpleado);
          setProfileData(data);
          return;
        }

        setProfileData(null);
      } catch (error) {
        setProfileError(
          error.response?.data?.message || "No se pudo cargar la información del perfil."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, isCliente, isEmpleado, isAdmin]);

  const nombreMostrado = useMemo(() => {
    if (profileData?.nombre) {
      return [
        profileData.nombre,
        profileData.apePaterno,
        profileData.apeMaterno,
      ]
        .filter(Boolean)
        .join(" ");
    }

    return user?.username || "Usuario";
  }, [profileData, user]);

  if (!user) {
    return (
      <main className="min-h-screen bg-cyan-300 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-2xl">
          <div className="rounded-2xl bg-yellow-100 px-4 py-4 text-sm font-semibold text-black">
            No se encontró una sesión activa.
          </div>
        </div>
      </main>
    );
  }

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
                  {isCliente ? "Mi cuenta" : "Mi perfil"}
                </span>

                <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">
                  Hola, {nombreMostrado}
                </h1>

                <p className="max-w-xl text-lg leading-7 text-blue-100 sm:text-xl">
                  {isCliente
                    ? "Consulta tus datos personales y la información principal de tu cuenta."
                    : "Consulta la información principal de tu cuenta y tus datos de personal."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Rol principal</p>
                <p className="mt-2 text-lg font-black text-white">{rolPrincipal}</p>
              </article>

              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Estado</p>
                <p className="mt-2 text-lg font-black text-white">
                  {user.activo ? "Cuenta activa" : "Cuenta inactiva"}
                </p>
              </article>

              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">Usuario</p>
                <p className="mt-2 text-lg font-black text-white">{user.username}</p>
              </article>

              <article className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-bold text-yellow-300">
                  {isCliente ? "ID Cliente" : "ID Empleado"}
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {isCliente ? user.idCliente ?? "No asociado" : user.idEmpleado ?? "No asociado"}
                </p>
              </article>
            </div>
          </section>

          <section className="bg-white px-6 py-10 sm:px-10 lg:px-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
                  {isCliente ? "Perfil del cliente" : "Información del personal"}
                </p>
                <h2 className="text-4xl font-black text-black">
                  {isCliente ? "Resumen de tu cuenta" : "Resumen de perfil"}
                </h2>
                <p className="text-sm leading-6 text-gray-700">
                  {isCliente
                    ? "Estos son tus datos personales registrados en el sistema."
                    : "Estos son los datos registrados para tu cuenta en el sistema."}
                </p>
              </div>

              {loadingProfile && (
                <div className="rounded-2xl bg-yellow-100 px-4 py-4 text-sm font-semibold text-black">
                  Cargando información del perfil...
                </div>
              )}

              {profileError && (
                <div className="rounded-2xl bg-red-100 px-4 py-4 text-sm font-semibold text-red-700">
                  {profileError}
                </div>
              )}

              {!loadingProfile && !profileError && profileData && (
                <>
                  {isCliente ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <InfoCard label="Nombre" value={profileData.nombre} />
                      <InfoCard label="Apellido paterno" value={profileData.apePaterno} />
                      <InfoCard label="Apellido materno" value={profileData.apeMaterno} />
                      <InfoCard label="Correo" value={profileData.correo} />
                      <InfoCard label="Teléfono" value={profileData.telefono} />
                      <InfoCard label="Dirección" value={profileData.direccion} />
                      <InfoCard label="Tipo de documento" value={profileData.tipoDoc} />
                      <InfoCard label="Número de documento" value={profileData.numeDoc} />
                      <InfoCard label="Género" value={profileData.genero} />
                      <InfoCard label="Fecha de nacimiento" value={profileData.fechaNac} />
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <InfoCard label="Nombre" value={profileData.nombre} />
                      <InfoCard label="Apellido paterno" value={profileData.apePaterno} />
                      <InfoCard label="Apellido materno" value={profileData.apeMaterno} />
                      <InfoCard label="Correo" value={profileData.correo} />
                      <InfoCard label="Teléfono" value={profileData.telefono} />
                      <InfoCard label="Dirección" value={profileData.direccion} />
                      <InfoCard label="Tipo de documento" value={profileData.tipoDoc} />
                      <InfoCard label="Número de documento" value={profileData.numeDoc} />
                      <InfoCard label="Género" value={profileData.genero} />
                      <InfoCard label="Fecha de nacimiento" value={profileData.fechaNac} />
                      <InfoCard label="Local" value={profileData.local} />
                      <InfoCard label="Cargo" value={profileData.cargo} />
                      <InfoCard label="Fecha de inicio" value={profileData.fechaInicio} />
                      <InfoCard label="Fecha de fin" value={profileData.fechaFin || "Vigente"} />
                    </div>
                  )}
                </>
              )}

              {!loadingProfile && !profileError && !profileData && (
                <div className="rounded-2xl bg-slate-100 px-4 py-4 text-sm font-semibold text-slate-700">
                  No hay información detallada disponible para este perfil.
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-black text-black">Accesos rápidos</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    to="/"
                    className="rounded-2xl bg-cyan-100 px-5 py-4 text-base font-black text-cyan-800 transition hover:bg-cyan-200"
                  >
                    Ir al inicio
                  </Link>

                  {(isEmpleado || isAdmin) && (
                    <Link
                      to="/empleado/panel"
                      className="rounded-2xl bg-yellow-100 px-5 py-4 text-base font-black text-yellow-800 transition hover:bg-yellow-200"
                    >
                      Ir a panel empleado
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin/panel"
                      className="rounded-2xl bg-slate-200 px-5 py-4 text-base font-black text-red-700 transition hover:bg-red-200"
                    >
                      Ir a panel admin
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-2xl bg-red-500 px-5 py-4 text-base font-black text-white transition hover:bg-red-400"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;