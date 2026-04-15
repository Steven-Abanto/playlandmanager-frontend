import { useEffect, useMemo, useState } from "react";
import {
  createGameUsageRequest,
  deleteGameUsageRequest,
  getGameUsagesRequest,
  getGamesRequest,
  updateGameRequest,
  updateGameUsageRequest,
} from "../services/employeeGameUsageService";
import GameUsageFormModal from "../components/GameUsageFormModal";

function EmpleadoJuegosUsoPage() {
  const [games, setGames] = useState([]);
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [gamesData, usagesData] = await Promise.all([
        getGamesRequest({ onlyActive: true }),
        getGameUsagesRequest(),
      ]);

      setGames(Array.isArray(gamesData) ? gamesData : []);
      setUsages(Array.isArray(usagesData) ? usagesData : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la gestión de uso de juegos.");
      setGames([]);
      setUsages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUsage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usage) => {
    setSelectedUsage(usage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setSelectedUsage(null);
    setIsModalOpen(false);
  };

  const handleSaveUsage = async (payload) => {
    try {
      setIsSaving(true);

      const selectedGame = games.find(
        (g) => Number(g.idJuego) === Number(payload.idJuego)
      );

      if (!selectedGame) {
        alert("No se encontró el juego seleccionado.");
        return;
      }

      const usagePayload = {
        idJuego: Number(payload.idJuego),
        cantidadUso: payload.cantidadUso,
        fechaUso: payload.fechaUso,
        descripcion: payload.descripcion?.trim() || "",
      };

      const gamePayload = {
        codigo: selectedGame.codigo,
        nombre: selectedGame.nombre,
        tipo: selectedGame.tipo,
        descripcion: selectedGame.descripcion,
        estado: selectedGame.estado,
        ultMant: payload.ultMant,
        proxMant: payload.proxMant,
        activo: selectedGame.activo,
      };

      if (selectedUsage) {
        await updateGameUsageRequest(selectedUsage.idJuegosUso, usagePayload);
      } else {
        await createGameUsageRequest(usagePayload);
      }

      await updateGameRequest(selectedGame.idJuego, gamePayload);

      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo guardar el uso del juego.";
      alert(backendMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (usage) => {
    const confirmed = window.confirm(
      `¿Eliminar registro de uso del juego "${usage?.juego?.nombre || ""}"?`
    );
    if (!confirmed) return;

    try {
      await deleteGameUsageRequest(usage.idJuegosUso);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el registro de uso.");
    }
  };

  const filteredUsages = useMemo(() => {
    const text = search.trim().toLowerCase();

    return usages.filter((u) => {
      return (
        (u.juego?.codigo || "").toLowerCase().includes(text) ||
        (u.juego?.nombre || "").toLowerCase().includes(text) ||
        (u.descripcion || "").toLowerCase().includes(text) ||
        (u.fechaUso || "").toLowerCase().includes(text)
      );
    });
  }, [usages, search]);

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Uso de juegos</h1>
            <p className="text-sm font-semibold text-gray-600">
              Registra uso operativo de juegos y actualiza mantenimiento programado
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-white transition hover:bg-cyan-500"
          >
            + Registrar uso
          </button>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Buscar por código, nombre, fecha o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-xl"
          />
        </div>

        {loading && (
          <div className="mt-6 rounded-xl bg-yellow-100 p-4 font-semibold text-black">
            Cargando registros de uso...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Juego</th>
                  <th className="p-3 font-black">Código</th>
                  <th className="p-3 font-black">Cantidad uso</th>
                  <th className="p-3 font-black">Fecha uso</th>
                  <th className="p-3 font-black">Descripción</th>
                  <th className="p-3 font-black">Estado juego</th>
                  <th className="p-3 font-black text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsages.map((u) => (
                  <tr key={u.idJuegosUso} className="border-b align-top">
                    <td className="p-3">{u.idJuegosUso}</td>
                    <td className="p-3 font-semibold">{u.juego?.nombre || "-"}</td>
                    <td className="p-3">{u.juego?.codigo || "-"}</td>
                    <td className="p-3">{u.cantidadUso || "-"}</td>
                    <td className="p-3">{u.fechaUso || "-"}</td>
                    <td className="p-3">{u.descripcion || "-"}</td>
                    <td className="p-3">{u.juego?.estado || "-"}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="rounded-xl bg-yellow-200 px-3 py-2 font-bold text-black transition hover:bg-yellow-300"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(u)}
                          className="rounded-xl bg-red-200 px-3 py-2 font-bold text-black transition hover:bg-red-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsages.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-gray-500">
                      No hay registros de uso.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GameUsageFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveUsage}
        initialData={selectedUsage}
        games={games}
        isSubmitting={isSaving}
      />
    </main>
  );
}

export default EmpleadoJuegosUsoPage;