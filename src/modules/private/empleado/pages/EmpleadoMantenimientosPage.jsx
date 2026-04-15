import { useEffect, useMemo, useState } from "react";
import {
  createMaintenanceRequest,
  deleteMaintenanceRequest,
  getEmployeesRequest,
  getGamesRequest,
  getMaintenancesRequest,
  updateMaintenanceRequest,
} from "../services/employeeMaintenanceService";
import MaintenanceFormModal from "../components/MaintenanceFormModal";

function EmpleadoMantenimientosPage() {
  const [maintenances, setMaintenances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [games, setGames] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [maintData, empData, gameData] = await Promise.all([
        getMaintenancesRequest(),
        getEmployeesRequest({ onlyActive: true }),
        getGamesRequest({ onlyActive: true }),
      ]);

      setMaintenances(Array.isArray(maintData) ? maintData : []);
      setEmployees(Array.isArray(empData) ? empData : []);
      setGames(Array.isArray(gameData) ? gameData : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la gestión de mantenimientos.");
      setMaintenances([]);
      setEmployees([]);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedMaintenance(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setSelectedMaintenance(null);
    setIsModalOpen(false);
  };

  const handleSaveMaintenance = async (payload) => {
    try {
      setIsSaving(true);

      if (selectedMaintenance) {
        await updateMaintenanceRequest(selectedMaintenance.idMantenimiento, payload);
      } else {
        await createMaintenanceRequest(payload);
      }

      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo guardar el mantenimiento.";
      alert(backendMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (maintenance) => {
    const confirmed = window.confirm(
      `¿Eliminar mantenimiento #${maintenance.idMantenimiento}?`
    );
    if (!confirmed) return;

    try {
      await deleteMaintenanceRequest(maintenance.idMantenimiento);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el mantenimiento.");
    }
  };

  const filteredMaintenances = useMemo(() => {
    const text = search.trim().toLowerCase();

    return maintenances.filter((m) => {
      return (
        String(m.idMantenimiento || "").includes(text) ||
        (m.empleadoNombre || "").toLowerCase().includes(text) ||
        (m.juego?.codigo || "").toLowerCase().includes(text) ||
        (m.juego?.nombre || "").toLowerCase().includes(text) ||
        (m.resultado || "").toLowerCase().includes(text) ||
        (m.observaciones || "").toLowerCase().includes(text)
      );
    });
  }, [maintenances, search]);

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Mantenimientos</h1>
            <p className="text-sm font-semibold text-gray-600">
              Registra y administra mantenimientos de juegos mecánicos
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-white transition hover:bg-cyan-500"
          >
            + Nuevo mantenimiento
          </button>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Buscar por empleado, juego, resultado u observaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-xl"
          />
        </div>

        {loading && (
          <div className="mt-6 rounded-xl bg-yellow-100 p-4 font-semibold text-black">
            Cargando mantenimientos...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Empleado</th>
                  <th className="p-3 font-black">Juego</th>
                  <th className="p-3 font-black">Código</th>
                  <th className="p-3 font-black">Fecha inicio</th>
                  <th className="p-3 font-black">Fecha fin</th>
                  <th className="p-3 font-black">Resultado</th>
                  <th className="p-3 font-black">Observaciones</th>
                  <th className="p-3 font-black text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredMaintenances.map((m) => (
                  <tr key={m.idMantenimiento} className="border-b align-top">
                    <td className="p-3">{m.idMantenimiento}</td>
                    <td className="p-3 font-semibold">{m.empleadoNombre || "-"}</td>
                    <td className="p-3 font-semibold">{m.juego?.nombre || "-"}</td>
                    <td className="p-3">{m.juego?.codigo || "-"}</td>
                    <td className="p-3">{m.fechaInicio || "-"}</td>
                    <td className="p-3">{m.fechaFin || "-"}</td>
                    <td className="p-3">{m.resultado || "-"}</td>
                    <td className="p-3">{m.observaciones || "-"}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="rounded-xl bg-yellow-200 px-3 py-2 font-bold text-black transition hover:bg-yellow-300"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(m)}
                          className="rounded-xl bg-red-200 px-3 py-2 font-bold text-black transition hover:bg-red-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMaintenances.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-gray-500">
                      No hay mantenimientos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MaintenanceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveMaintenance}
        initialData={selectedMaintenance}
        employees={employees}
        games={games}
        isSubmitting={isSaving}
      />
    </main>
  );
}

export default EmpleadoMantenimientosPage;