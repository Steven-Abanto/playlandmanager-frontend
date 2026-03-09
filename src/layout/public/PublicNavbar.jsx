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
    <header className="border-b-2 border-black bg-red-500 text-yellow-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold"
        >
          Play Land Manager
        </button>

        <form onSubmit={handleSubmit} className="flex-1 max-w-xl text-white">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border-2 border-black px-5 py-3 text-lg outline-none"
          />
        </form>

        <nav className="flex items-center gap-8 text-xl font-semibold">
          <button onClick={() => navigate("/productos")}>Productos</button>
          <button onClick={() => navigate("/promociones")}>Promociones</button>
          <button onClick={() => navigate("/login")}>Perfil</button>
        </nav>
      </div>
    </header>
  );
}

export default PublicNavbar;