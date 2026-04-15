import { useEffect, useMemo, useState } from "react";
import {
  createGameRequest,
  deleteGameRequest,
  getAdminGamesRequest,
  getGamesByEstadoRequest,
  updateGameRequest,
} from "../services/adminGameService";
import GameFormModal from "../components/GameFormModal";

function AdminJuegosPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState("TODOS");

  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError("");

      let data = [];

      if (estadoFilter === "TODOS") {
        data = await getAdminGamesRequest({ onlyActive });
      } else {
        data = await getGamesByEstadoRequest(estadoFilter, onlyActive);
      }

      setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los juegos.");
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, [estadoFilter, onlyActive]);

  const handleOpenCreate = () => {
    setSelectedGame(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setSelectedGame(null);
    setIsModalOpen(false);
  };

  const handleSaveGame = async (payload) => {
    try {
      setIsSaving(true);

      if (selectedGame) {
        await updateGameRequest(selectedGame.idJuego, payload);
      } else {
        await createGameRequest(payload);
      }

      await loadGames();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo guardar el juego.";
      alert(backendMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (idJuego) => {
    const confirmed = window.confirm("¿Seguro que deseas desactivar este juego?");
    if (!confirmed) return;

    try {
      await deleteGameRequest(idJuego);
      await loadGames();
    } catch (err) {
      console.error(err);
      alert("No se pudo desactivar el juego.");
    }
  };

  const filteredGames = useMemo(() => {
    const text = search.trim().toLowerCase();

    return games.filter((g) => {
      return (
        (g.codigo || "").toLowerCase().includes(text) ||
        (g.nombre || "").toLowerCase().includes(text) ||
        (g.tipo || "").toLowerCase().includes(text) ||
        (g.descripcion || "").toLowerCase().includes(text) ||
        (g.estado || "").toLowerCase().includes(text)
      );
    });
  }, [games, search]);

  const estadoBadgeClass = (estado) => {
    switch (estado) {
      case "OPERATIVO":
        return "bg-green-100 text-green-700";
      case "MANTENIMIENTO":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVO":
        return "bg-slate-200 text-slate-700";
      case "FUERA_DE_SERVICIO":
        return "bg-red-100 text-red-700";
      default:
        return "bg-cyan-100 text-cyan-700";
    }
  };

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Gestión de juegos</h1>
            <p className="text-sm font-semibold text-gray-600">
              Administra juegos mecánicos, estado operativo y fechas de mantenimiento
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-white transition hover:bg-cyan-500"
          >
            + Nuevo juego
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Buscar por código, nombre, tipo, descripción o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-xl"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="rounded-xl border px-4 py-3 font-semibold outline-none"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="OPERATIVO">Operativo</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="FUERA_DE_SERVICIO">Fuera de servicio</option>
            </select>

            <label className="flex items-center gap-2 text-sm font-semibold text-black">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={() => setOnlyActive(!onlyActive)}
                className="h-4 w-4"
              />
              Solo activos
            </label>
          </div>
        </div>

        {loading && (
          <div className="mt-6 rounded-xl bg-yellow-100 p-4 font-semibold text-black">
            Cargando juegos...
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
                  <th className="p-3 font-black">Código</th>
                  <th className="p-3 font-black">Nombre</th>
                  <th className="p-3 font-black">Tipo</th>
                  <th className="p-3 font-black">Descripción</th>
                  <th className="p-3 font-black">Estado</th>
                  <th className="p-3 font-black">Últ. mant.</th>
                  <th className="p-3 font-black">Próx. mant.</th>
                  <th className="p-3 font-black">Activo</th>
                  <th className="p-3 font-black text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredGames.map((g) => (
                  <tr key={g.idJuego} className="border-b align-top">
                    <td className="p-3">{g.idJuego}</td>
                    <td className="p-3 font-semibold">{g.codigo}</td>
                    <td className="p-3 font-semibold">{g.nombre || "-"}</td>
                    <td className="p-3">{g.tipo || "-"}</td>
                    <td className="p-3">{g.descripcion || "-"}</td>

                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${estadoBadgeClass(
                          g.estado
                        )}`}
                      >
                        {g.estado}
                      </span>
                    </td>

                    <td className="p-3">{g.ultMant || "-"}</td>
                    <td className="p-3">{g.proxMant || "-"}</td>

                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
                          g.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {g.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="rounded-xl bg-yellow-200 px-3 py-2 font-bold text-black transition hover:bg-yellow-300"
                        >
                          Editar
                        </button>

                        {g.activo && (
                          <button
                            onClick={() => handleDelete(g.idJuego)}
                            className="rounded-xl bg-red-200 px-3 py-2 font-bold text-black transition hover:bg-red-300"
                          >
                            Desactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredGames.length === 0 && (
                  <tr>
                    <td colSpan="10" className="p-6 text-center text-gray-500">
                      No hay juegos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GameFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveGame}
        initialData={selectedGame}
        isSubmitting={isSaving}
      />
    </main>
  );
}

export default AdminJuegosPage;