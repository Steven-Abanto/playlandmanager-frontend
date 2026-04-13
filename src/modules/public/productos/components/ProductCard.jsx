function ProductCard({ product }) {
  const imageUrl = product.imagenUrl || "https://picsum.photos/400/200";

  const categories = {
    Paseos: "bg-cyan-400 text-black",
    Juegos: "bg-red-500 text-white",
    Comedores: "bg-yellow-400 text-black",
    Tienda: "bg-purple-500 text-white",
    Tickets: "bg-green-400 text-black",
    Servicios: "bg-orange-400 text-black",
  };

  const categoryColor = categories[product.categoria] || "bg-blue-500 text-white";

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
      <img
        src={imageUrl}
        alt={product.descripcion}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${categoryColor}`}
        >
          {product.categoria || "General"}
        </span>

        <h3 className="mt-3 text-xl font-black text-black">
          {product.descripcion}
        </h3>

        <p className="mt-2 text-sm font-semibold text-gray-700">
          Marca: {product.marca || "Play Land"}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-black text-yellow-500">
            S/ {Number(product.precio).toFixed(2)}
          </span>

          <button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-black shadow-md transition hover:bg-cyan-500">
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;