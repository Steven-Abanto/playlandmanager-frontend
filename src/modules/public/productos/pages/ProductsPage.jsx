import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("Todas");

  const [products, setProducts] = useState([]);
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
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.categoria).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const nombre = product.nombre || "";
      const descripcion = product.descripcion || "";
      const categoriaProducto = product.categoria || "";
      const activo = product.activo ?? true;

      const matchesSearch =
        nombre.toLowerCase().includes(search.toLowerCase()) ||
        descripcion.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas" || categoriaProducto === category;

      return activo && matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="min-h-screen bg-blue-100">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black">Productos</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            Explora nuestro catálogo de productos, combos y experiencias.
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
            <p className="text-lg font-bold text-black">
              Cargando productos...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-100 p-10 text-center">
            <p className="text-lg font-bold text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && <ProductGrid products={filteredProducts} />}
      </section>
    </div>
  );
}

export default ProductsPage;
