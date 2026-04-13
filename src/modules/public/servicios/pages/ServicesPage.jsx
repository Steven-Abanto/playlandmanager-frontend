import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../../productos/components/ProductFilters";
import ProductGrid from "../../productos/components/ProductGrid";
import { getServices } from "../services/serviceService";

function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("Todas");

  const [services, setServices] = useState([]);
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
    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const data = await getServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los servicios.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(services.map((service) => service.categoria).filter(Boolean))];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const descripcion = service.descripcion || "";
      const categoriaServicio = service.categoria || "";
      const marca = service.marca || "";
      const activo = service.activo ?? true;

      const matchesSearch =
        descripcion.toLowerCase().includes(search.toLowerCase()) ||
        marca.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas" || categoriaServicio === category;

      return activo && matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  return (
    <div className="min-h-screen bg-blue-100">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black">Servicios</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            Explora nuestras experiencias, salas, actividades y servicios disponibles.
          </p>
        </div>

        <div className="mb-8">
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
          />
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-bold text-black">Cargando servicios...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-100 p-10 text-center">
            <p className="text-lg font-bold text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && <ProductGrid products={filteredServices} />}
      </section>
    </div>
  );
}

export default ServicesPage;