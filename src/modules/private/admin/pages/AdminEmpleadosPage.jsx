import { useEffect, useState } from "react";
import {
  createAdminRequest,
  createEmployeeRequest,
  deleteEmployeeRequest,
  getAdminEmployeesRequest,
  updateEmployeeRequest,
} from "../services/adminEmployeeService";
import EmployeeFormModal from "../components/EmployeeFormModal";

function AdminEmpleadosPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [onlyActive, setOnlyActive] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminEmployeesRequest({
        onlyActive,
      });

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los empleados.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [onlyActive]);

  const handleOpenCreate = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (payload) => {
    try {
      setIsSaving(true);

      if (selectedEmployee) {
        const updatePayload = {
          tipoDoc: payload.tipoDoc,
          numeDoc: payload.numeDoc,
          nombre: payload.nombre,
          apePaterno: payload.apePaterno,
          apeMaterno: payload.apeMaterno,
          genero: payload.genero,
          fechaNac: payload.fechaNac,
          correo: payload.correo,
          telefono: payload.telefono,
          direccion: payload.direccion,
          local: Number(payload.local),
          idCargo: Number(payload.idCargo),
          fechaInicio: payload.fechaInicio,
          fechaFin: payload.fechaFin || null,
          activo: payload.activo,
        };

        await updateEmployeeRequest(selectedEmployee.idEmpleado, updatePayload);
      } else {
        if (payload.esAdmin) {
          await createAdminRequest(payload);
        } else {
          await createEmployeeRequest(payload);
        }
      }

      await loadEmployees();
      handleCloseModal();
    } catch (err) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo guardar el empleado.";

      alert(backendMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas desactivar este empleado?");
    if (!confirmed) return;

    try {
      await deleteEmployeeRequest(id);
      await loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Error al desactivar el empleado.");
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const text = search.toLowerCase();

    const fullName =
      `${e.nombre || ""} ${e.apePaterno || ""} ${e.apeMaterno || ""}`.toLowerCase();

    const matchesSearch =
      fullName.includes(text) ||
      (e.numeDoc || "").toLowerCase().includes(text) ||
      (e.correo || "").toLowerCase().includes(text) ||
      (e.cargo || "").toLowerCase().includes(text) ||
      String(e.local || "").includes(text);

    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-cyan-300 px-6 py-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-black">Gestión de empleados</h1>
            <p className="text-sm font-semibold text-gray-600">
              Administra empleados y administradores del sistema
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-black text-white transition hover:bg-cyan-500"
          >
            + Nuevo empleado
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, correo, cargo o local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 font-semibold outline-none lg:max-w-xl"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            Cargando empleados...
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
                  <th className="p-3 font-black">Nombre completo</th>
                  <th className="p-3 font-black">Documento</th>
                  <th className="p-3 font-black">Correo</th>
                  <th className="p-3 font-black">Teléfono</th>
                  <th className="p-3 font-black">Cargo</th>
                  <th className="p-3 font-black">Local</th>
                  <th className="p-3 font-black">Fecha inicio</th>
                  <th className="p-3 font-black">Estado</th>
                  <th className="p-3 font-black text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((e) => (
                  <tr key={e.idEmpleado} className="border-b align-top">
                    <td className="p-3">{e.idEmpleado}</td>
                    <td className="p-3 font-semibold">
                      {[e.nombre, e.apePaterno, e.apeMaterno].filter(Boolean).join(" ")}
                    </td>
                    <td className="p-3">
                      {e.tipoDoc} - {e.numeDoc}
                    </td>
                    <td className="p-3">{e.correo}</td>
                    <td className="p-3">{e.telefono}</td>
                    <td className="p-3">{e.cargo || "-"}</td>
                    <td className="p-3">{e.local}</td>
                    <td className="p-3">{e.fechaInicio || "-"}</td>

                    <td className="p-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-black ${
                          e.activo
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {e.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleOpenEdit(e)}
                          className="rounded-xl bg-yellow-200 px-3 py-2 font-bold text-black transition hover:bg-yellow-300"
                        >
                          Editar
                        </button>

                        {e.activo && (
                          <button
                            onClick={() => handleDelete(e.idEmpleado)}
                            className="rounded-xl bg-red-200 px-3 py-2 font-bold text-black transition hover:bg-red-300"
                          >
                            Desactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="10" className="p-6 text-center text-gray-500">
                      No hay empleados registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveEmployee}
        initialData={selectedEmployee}
        isSubmitting={isSaving}
      />
    </main>
  );
}

export default AdminEmpleadosPage;