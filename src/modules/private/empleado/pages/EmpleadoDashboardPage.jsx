import { useEffect, useMemo, useState } from "react";
import {
  getDashboardGamesRequest,
  getDashboardGameUsagesRequest,
  getDashboardMaintenancesRequest,
} from "../services/employeeDashboardService";

function EmployeeDashboardPage() {
  const [games, setGames] = useState([]);
  const [usages, setUsages] = useState([]);
  const [maintenances, setMaintenances] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [gamesData, usagesData, maintData] = await Promise.all([
        getDashboardGamesRequest(),
        getDashboardGameUsagesRequest(),
        getDashboardMaintenancesRequest(),
      ]);

      setGames(Array.isArray(gamesData) ? gamesData : []);
      setUsages(Array.isArray(usagesData) ? usagesData : []);
      setMaintenances(Array.isArray(maintData) ? maintData : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el dashboard.");
      setGames([]);
      setUsages([]);
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const totalGames = games.length;
    const activeGames = games.filter((g) => g.activo).length;
    const inactiveGames = games.filter((g) => !g.activo).length;

    const operativo = games.filter((g) => g.estado === "OPERATIVO").length;
    const mantenimiento = games.filter((g) => g.estado === "MANTENIMIENTO").length;
    const fueraServicio = games.filter((g) => g.estado === "FUERA_DE_SERVICIO").length;
    const inactivoEstado = games.filter((g) => g.estado === "INACTIVO").length;

    const totalUsages = usages.length;
    const usagesToday = usages.filter((u) => u.fechaUso === today).length;
    const usagesThisMonth = usages.filter((u) =>
      String(u.fechaUso || "").startsWith(currentMonth)
    ).length;

    const totalMaintenances = maintenances.length;
    const maintenancesThisMonth = maintenances.filter((m) =>
      String(m.fechaInicio || "").startsWith(currentMonth)
    ).length;

    const upcomingMaintenances = games
      .filter((g) => g.proxMant && g.activo)
      .sort((a, b) => String(a.proxMant).localeCompare(String(b.proxMant)))
      .slice(0, 5);

    return {
      totalGames,
      activeGames,
      inactiveGames,
      operativo,
      mantenimiento,
      fueraServicio,
      inactivoEstado,
      totalUsages,
      usagesToday,
      usagesThisMonth,
      totalMaintenances,
      maintenancesThisMonth,
      upcomingMaintenances,
    };
  }, [games, usages, maintenances, today, currentMonth]);

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6 rounded-[2rem] bg-white p-8 shadow-2xl">
        <div>
          <h1 className="text-4xl font-black text-black">Dashboard operativo</h1>
          <p className="text-sm font-semibold text-gray-600">
            Resumen de juegos, uso y mantenimientos
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-yellow-100 p-4 font-semibold text-black">
            Cargando dashboard...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-3xl bg-cyan-100 p-5">
                <p className="text-sm font-black text-cyan-800">Juegos totales</p>
                <p className="mt-2 text-4xl font-black text-black">{metrics.totalGames}</p>
              </article>

              <article className="rounded-3xl bg-green-100 p-5">
                <p className="text-sm font-black text-green-800">Juegos activos</p>
                <p className="mt-2 text-4xl font-black text-black">{metrics.activeGames}</p>
              </article>

              <article className="rounded-3xl bg-yellow-100 p-5">
                <p className="text-sm font-black text-yellow-800">Usos del día</p>
                <p className="mt-2 text-4xl font-black text-black">{metrics.usagesToday}</p>
              </article>

              <article className="rounded-3xl bg-fuchsia-100 p-5">
                <p className="text-sm font-black text-fuchsia-800">Mantenimientos del mes</p>
                <p className="mt-2 text-4xl font-black text-black">
                  {metrics.maintenancesThisMonth}
                </p>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <h2 className="text-2xl font-black text-black">Estado de juegos</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow">
                    <p className="text-sm font-black text-green-700">Operativos</p>
                    <p className="mt-2 text-3xl font-black text-black">{metrics.operativo}</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow">
                    <p className="text-sm font-black text-yellow-700">En mantenimiento</p>
                    <p className="mt-2 text-3xl font-black text-black">
                      {metrics.mantenimiento}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow">
                    <p className="text-sm font-black text-red-700">Fuera de servicio</p>
                    <p className="mt-2 text-3xl font-black text-black">
                      {metrics.fueraServicio}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow">
                    <p className="text-sm font-black text-slate-700">Inactivos</p>
                    <p className="mt-2 text-3xl font-black text-black">
                      {metrics.inactivoEstado || metrics.inactiveGames}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <h2 className="text-2xl font-black text-black">Actividad operativa</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow">
                    <p className="text-sm font-black text-cyan-700">Usos totales</p>
                    <p className="mt-2 text-3xl font-black text-black">{metrics.totalUsages}</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow">
                    <p className="text-sm font-black text-cyan-700">Usos del mes</p>
                    <p className="mt-2 text-3xl font-black text-black">
                      {metrics.usagesThisMonth}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow sm:col-span-2">
                    <p className="text-sm font-black text-fuchsia-700">Mantenimientos totales</p>
                    <p className="mt-2 text-3xl font-black text-black">
                      {metrics.totalMaintenances}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-2xl font-black text-black">Próximos mantenimientos</h2>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 font-black">Código</th>
                      <th className="p-3 font-black">Juego</th>
                      <th className="p-3 font-black">Estado</th>
                      <th className="p-3 font-black">Últ. mantenimiento</th>
                      <th className="p-3 font-black">Próx. mantenimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.upcomingMaintenances.map((game) => (
                      <tr key={game.idJuego} className="border-b">
                        <td className="p-3 font-semibold">{game.codigo}</td>
                        <td className="p-3">{game.nombre || "-"}</td>
                        <td className="p-3">{game.estado || "-"}</td>
                        <td className="p-3">{game.ultMant || "-"}</td>
                        <td className="p-3">{game.proxMant || "-"}</td>
                      </tr>
                    ))}

                    {metrics.upcomingMaintenances.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-gray-500">
                          No hay próximos mantenimientos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default EmployeeDashboardPage;