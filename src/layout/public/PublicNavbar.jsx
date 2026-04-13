import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

function PublicNavbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { user, isAuthenticated, logout, hasRole } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();

    if (!query) return;

    navigate(`/productos?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-cyan-400 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-1">
        <button
          onClick={() => navigate("/")}
          className="transition hover:opacity-80"
        >
          <img
            src="/logo.png"
            alt="Play Land Park"
            className="h-24 w-auto"
          />
        </button>

        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Buscar productos o promociones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full px-5 py-2 text-base font-semibold outline-none transition focus:ring-4 focus:ring-yellow-200"
          />
        </form>

        <nav className="flex items-center gap-4 text-base font-bold text-white">
          <button
            onClick={() => navigate("/productos")}
            className="transition hover:opacity-80"
          >
            Productos
          </button>

          <button
            onClick={() => navigate("/promociones")}
            className="transition hover:opacity-80"
          >
            Promociones
          </button>


          {isAuthenticated && (hasRole("EMPLEADO") || hasRole("ADMIN")) && (
            <button
              onClick={() => navigate("/empleado/panel")}
              className="transition hover:opacity-80"
            >
              Panel Empleado
            </button>
          )}

          {isAuthenticated && hasRole("ADMIN") && (
            <>
              <button
                onClick={() => navigate("/admin/panel")}
                className="transition hover:opacity-80"
              >
                Panel Admin
              </button>

              <button
                onClick={() => navigate("/admin/usuarios")}
                className="transition hover:opacity-80"
              >
                Usuarios
              </button>
            </>
          )}

          {!isAuthenticated ? (
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-red-500 px-6 py-2 font-bold text-white transition hover:bg-red-600"
            >
              Iniciar sesión
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/perfil")}
                className="rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/30"
              >
                {user?.username}
              </button>

              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default PublicNavbar;