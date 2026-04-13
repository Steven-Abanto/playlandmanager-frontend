function formatMoney(value) {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

function ProductCard({ product, onAddToCart, isAdding = false }) {
  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={product.imagenUrl || "/images/product-default.jpg"}
          alt={product.descripcion}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/product-default.jpg";
          }}
        />
      </div>

      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.15em] text-cyan-500">
            {product.categoria || "Producto"}
          </p>
          <h3 className="mt-1 text-2xl font-black text-black">
            {product.descripcion}
          </h3>
          <p className="mt-2 text-sm font-semibold text-gray-600">
            {product.marca || "Play Land"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-black text-black">
            {formatMoney(product.precio)}
          </span>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={isAdding}
            className="rounded-2xl bg-cyan-500 px-4 py-2 font-black text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;