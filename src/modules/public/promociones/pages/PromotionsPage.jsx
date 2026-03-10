import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPromotions } from "../services/promotionService";
import PromotionFilters from "../components/PromotionFilters";
import PromotionGrid from "../components/PromotionGrid";

function PromotionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState("Todas");

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      setSearchParams(params);
    }, 250);

    return () => clearTimeout(delay);
  }, [search, setSearchParams]);

  useEffect(() => {
    async function loadPromotions() {
      try {
        setLoading(true);
        setError("");

        const data = await getPromotions();
        setPromotions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudieron cargar las promociones.");
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    }

    loadPromotions();
  }, []);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const nombre = (promotion.nombre || promotion.codigo || "").toLowerCase();
      const descripcion = (promotion.descripcion || "").toLowerCase();
      const activo = promotion.activo ?? true;

      const matchesSearch =
        nombre.includes(search.toLowerCase()) ||
        descripcion.includes(search.toLowerCase());

      const matchesStatus =
        status === "Todas" ||
        (status === "Activas" && activo) ||
        (status === "Inactivas" && !activo);

      return matchesSearch && matchesStatus;
    });
  }, [promotions, search, status]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Promociones</h1>
          <p className="mt-2 text-lg text-slate-600">
            Descubre nuestras promociones activas y encuentra la mejor opción para tu visita.
          </p>
        </div>

        <div className="mb-8">
          <PromotionFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
          />
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-700">
              Cargando promociones...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="text-lg font-medium text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <PromotionGrid promotions={filteredPromotions} />
        )}
      </section>
    </div>
  );
}

export default PromotionsPage;