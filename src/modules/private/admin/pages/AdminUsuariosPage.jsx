import { useEffect, useMemo, useState } from "react";
import {
  deleteUserRequest,
  getAdminUsersRequest,
  getUsersByRoleRequest,
  updateUserRequest,
} from "../services/adminUserService";
import UserFormModal from "../components/UserFormModal";
import { useAuth } from "../../../../auth/AuthContext";

function AdminUsuariosPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [roleFilter, setRoleFilter] = useState("TODOS");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentRole = user?.rolPrincipal || user?.rol || "ADMIN";
  const isSuperAdmin = currentRole === "SUPER_ADMIN";

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      let data = [];

      if (roleFilter === "TODOS") {
        data = await getAdminUsersRequest();
        if (onlyActive) {
          data = Array.isArray(data) ? data.filter((u) => u.activo) : [];
        }
      } else {
        data = await getUsersByRoleRequest(roleFilter, onlyActive);
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, onlyActive]);

  const handleOpenEdit = (usuario) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const canEditUser = (targetUser) => {
    if (!targetUser) return false;
    if (isSuperAdmin) return true;
    return targetUser.rol !== "ADMIN" && targetUser.rol !== "SUPER_ADMIN";
  };

  const handleSaveUser = async (payload) => {
    if (!selectedUser) return;

    if (!canEditUser(selectedUser)) {
      alert("No tienes permisos para modificar este usuario.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserRequest(selectedUser.idUsuario, payload);
      await loadUsers();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo actualizar el usuario.";
      alert(backendMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (usuario) => {
    if (!canEditUser(usuario)) {
      alert("No tienes permisos para desactivar este usuario.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas desactivar al usuario "${usuario.usuario}"?`
    );
    if (!confirmed) return;

    try {
      await deleteUserRequest(usuario.idUsuario);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert("No se pudo desactivar el usuario.");
    }
  };

  const filteredUsers = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return users;

    return users.filter((u) => {
      return (
        (u.usuario || "").toLowerCase().includes(text) ||
        (u.rol || "").toLowerCase().includes(text) ||
        String(u.idUsuario || "").includes(text) ||
        String(u.idEmpleado || "").includes(text) ||
        String(u.idCliente || "").includes(text)
      );
    });
  }, [users, search]);

  const roleBadgeClass = (rol) => {
    switch (rol) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-red-100 text-red-700";
      case "EMPLEADO":
        return "bg-cyan-100 text-cyan-800";
      case "CLIENTE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Gestión de usuarios</h1>
            <p className="text-sm font-semibold text-gray-600">
              Administra cuentas de clientes, empleados y administradores
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Buscar por usuario, rol, id, empleado o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-xl"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border px-4 py-3 font-semibold outline-none"
            >
              <option value="TODOS">Todos</option>
              <option value="CLIENTE">Clientes</option>
              <option value="EMPLEADO">Empleados</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">Super Admins</option>
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
            Cargando usuarios...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 font-black">ID</th>
                  <th className="p-3 font-black">Usuario</th>
                  <th className="p-3 font-black">Rol</th>
                  <th className="p-3 font-black">ID Empleado</th>
                  <th className="p-3 font-black">ID Cliente</th>
                  <th className="p-3 font-black">Estado</th>
                  <th className="p-3 font-black text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.idUsuario} className="border-b align-top">
                    <td className="p-3">{u.idUsuario}</td>
                    <td className="p-3 font-semibold">{u.usuario}</td>

                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${roleBadgeClass(
                          u.rol
                        )}`}
                      >
                        {u.rol}
                      </span>
                    </td>

                    <td className="p-3">{u.idEmpleado ?? "-"}</td>
                    <td className="p-3">{u.idCliente ?? "-"}</td>

                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
                          u.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          disabled={!canEditUser(u)}
                          className="rounded-xl bg-yellow-200 px-3 py-2 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(u)}
                          disabled={!canEditUser(u) || !u.activo}
                          className="rounded-xl bg-red-200 px-3 py-2 font-bold text-black transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveUser}
        initialData={selectedUser}
        isSubmitting={isSaving}
        isSuperAdmin={isSuperAdmin}
      />
    </main>
  );
}

export default AdminUsuariosPage;