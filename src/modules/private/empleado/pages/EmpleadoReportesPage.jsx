import { useEffect, useMemo, useState } from "react";
import {
  getDashboardGamesRequest,
  getDashboardGameUsagesRequest,
  getDashboardMaintenancesRequest,
} from "../services/employeeDashboardService";

function EmpleadoReportesPage() {
  const [games, setGames] = useState([]);
  const [usages, setUsages] = useState([]);
  const [maintenances, setMaintenances] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tab, setTab] = useState("JUEGOS");
  const [search, setSearch] = useState("");

  const loadReports = async () => {
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
      setError("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredGames = useMemo(() => {
    const text = search.toLowerCase();
    return games.filter((g) =>
      (g.codigo || "").toLowerCase().includes(text) ||
      (g.nombre || "").toLowerCase().includes(text) ||
      (g.tipo || "").toLowerCase().includes(text) ||
      (g.estado || "").toLowerCase().includes(text)
    );
  }, [games, search]);

  const filteredUsages = useMemo(() => {
    const text = search.toLowerCase();
    return usages.filter((u) =>
      (u.juego?.codigo || "").toLowerCase().includes(text) ||
      (u.juego?.nombre || "").toLowerCase().includes(text) ||
      (u.descripcion || "").toLowerCase().includes(text) ||
      (u.fechaUso || "").toLowerCase().includes(text)
    );
  }, [usages, search]);

  const filteredMaintenances = useMemo(() => {
    const text = search.toLowerCase();
    return maintenances.filter((m) =>
      (m.empleadoNombre || "").toLowerCase().includes(text) ||
      (m.juego?.codigo || "").toLowerCase().includes(text) ||
      (m.juego?.nombre || "").toLowerCase().includes(text) ||
      (m.resultado || "").toLowerCase().includes(text) ||
      (m.observaciones || "").toLowerCase().includes(text)
    );
  }, [maintenances, search]);

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div>
          <h1 className="text-4xl font-black text-black">Reportes operativos</h1>
          <p className="text-sm font-semibold text-gray-600">
            Consulta juegos, uso de juegos y mantenimientos
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {["JUEGOS", "USOS", "MANTENIMIENTOS"].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`rounded-2xl px-4 py-2 font-black transition ${
                  tab === item
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-200 text-black hover:bg-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Buscar en el reporte actual..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-md"
          />
        </div>

        {loading && (
          <div className="mt-6 rounded-xl bg-yellow-100 p-4 font-semibold text-black">
            Cargando reportes...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && tab === "JUEGOS" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Código</th>
                  <th className="p-3 font-black">Nombre</th>
                  <th className="p-3 font-black">Tipo</th>
                  <th className="p-3 font-black">Estado</th>
                  <th className="p-3 font-black">Últ. mant.</th>
                  <th className="p-3 font-black">Próx. mant.</th>
                  <th className="p-3 font-black">Activo</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((g) => (
                  <tr key={g.idJuego} className="border-b">
                    <td className="p-3">{g.idJuego}</td>
                    <td className="p-3">{g.codigo}</td>
                    <td className="p-3">{g.nombre}</td>
                    <td className="p-3">{g.tipo}</td>
                    <td className="p-3">{g.estado}</td>
                    <td className="p-3">{g.ultMant}</td>
                    <td className="p-3">{g.proxMant}</td>
                    <td className="p-3">{g.activo ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tab === "USOS" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Juego</th>
                  <th className="p-3 font-black">Código</th>
                  <th className="p-3 font-black">Cantidad uso</th>
                  <th className="p-3 font-black">Fecha uso</th>
                  <th className="p-3 font-black">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsages.map((u) => (
                  <tr key={u.idJuegosUso} className="border-b">
                    <td className="p-3">{u.idJuegosUso}</td>
                    <td className="p-3">{u.juego?.nombre || "-"}</td>
                    <td className="p-3">{u.juego?.codigo || "-"}</td>
                    <td className="p-3">{u.cantidadUso}</td>
                    <td className="p-3">{u.fechaUso}</td>
                    <td className="p-3">{u.descripcion || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tab === "MANTENIMIENTOS" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Empleado</th>
                  <th className="p-3 font-black">Juego</th>
                  <th className="p-3 font-black">Código</th>
                  <th className="p-3 font-black">Inicio</th>
                  <th className="p-3 font-black">Fin</th>
                  <th className="p-3 font-black">Resultado</th>
                  <th className="p-3 font-black">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenances.map((m) => (
                  <tr key={m.idMantenimiento} className="border-b">
                    <td className="p-3">{m.idMantenimiento}</td>
                    <td className="p-3">{m.empleadoNombre || "-"}</td>
                    <td className="p-3">{m.juego?.nombre || "-"}</td>
                    <td className="p-3">{m.juego?.codigo || "-"}</td>
                    <td className="p-3">{m.fechaInicio}</td>
                    <td className="p-3">{m.fechaFin}</td>
                    <td className="p-3">{m.resultado}</td>
                    <td className="p-3">{m.observaciones || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default EmpleadoReportesPage;