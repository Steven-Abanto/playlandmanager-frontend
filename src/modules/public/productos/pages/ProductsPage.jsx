import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/productService";
import { useAuth } from "../../../../auth/AuthContext";
import {
  addCartItem,
  getOrCreateActiveCart,
} from "../../../private/cart/services/cartService";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("Todas");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);

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
        console.error(err);
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
      const descripcion = product.descripcion || "";
      const categoriaProducto = product.categoria || "";
      const marca = product.marca || "";
      const activo = product.activo ?? true;

      const matchesSearch =
        descripcion.toLowerCase().includes(search.toLowerCase()) ||
        marca.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas" || categoriaProducto === category;

      return activo && matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const handleAddToCart = async (product) => {
    try {
      if (!isAuthenticated) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
      }

      const rol = user?.rolPrincipal || user?.rol;

      if (rol !== "CLIENTE" && rol !== "EMPLEADO") {
        alert("Tu rol no puede crear carritos.");
        return;
      }

      const tipoCompra = rol === "EMPLEADO" ? "LOCAL" : "ONLINE";

      setAddingProductId(product.idProducto);

      const cart = await getOrCreateActiveCart({
        idUsuario: user.idUsuario,
        tipoCompra,
      });

      await addCartItem({
        idCarrito: cart.idCarrito,
        idProducto: product.idProducto,
        cantidad: 1,
      });

      alert("Producto agregado al carrito.");
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo agregar el producto al carrito.";
      alert(message);
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black">Productos</h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            Explora nuestro catálogo de productos disponibles en Play Land.
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
            <p className="text-lg font-bold text-black">Cargando productos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-100 p-10 text-center">
            <p className="text-lg font-bold text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            addingProductId={addingProductId}
          />
        )}
      </section>
    </div>
  );
}

export default ProductsPage;