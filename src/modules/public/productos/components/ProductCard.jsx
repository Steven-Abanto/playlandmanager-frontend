function ProductCard({ product }) {
    const imageUrl =
    product.imagenUrl ||
    "https://picsum.photos/400/200";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={imageUrl}
        alt={product.nombre}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {product.categoria}
        </span>

        <h3 className="mt-3 text-xl font-bold text-slate-900">
          {product.nombre}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-600">
          {product.descripcion}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">
            S/ {product.precio.toFixed(2)}
          </span>

          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;