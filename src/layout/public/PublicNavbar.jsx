import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

function PublicNavbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();

    if (!query) return;

    navigate(`/productos?search=${encodeURIComponent(query)}`);
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

        <nav className="flex items-center gap-6 text-lg font-bold text-white">
          <button onClick={() => navigate("/productos")} className="transition hover:opacity-80">
            Productos
          </button>
          <button onClick={() => navigate("/promociones")} className="transition hover:opacity-80">
            Promociones
          </button>
          <button onClick={() => navigate("/login")} className="rounded-full bg-red-500 px-6 py-2 text-white font-bold transition hover:bg-red-600">
            Iniciar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}

export default PublicNavbar;
