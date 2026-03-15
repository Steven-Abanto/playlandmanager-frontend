import { useNavigate } from "react-router-dom";

function PromotionCard({ promotion }) {
  const navigate = useNavigate();

  const imageUrl =
    promotion.imagenUrl ||
    "https://picsum.photos/400/200";

  const handleClick = () => {
    if (promotion.productoId) {
      navigate(`/productos/${promotion.productoId}`);
      return;
    }

    if (promotion.idPromocion || promotion.id) {
      navigate(`/promociones/${promotion.idPromocion || promotion.id}`);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
      <img
        src={imageUrl}
        alt={promotion.nombre || promotion.codigo || "Promoción"}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <span className="inline-block rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
          Promoción
        </span>

        <h3 className="mt-3 text-xl font-black text-black">
          {promotion.nombre || promotion.codigo || "Promoción disponible"}
        </h3>

        <p className="mt-2 text-sm text-gray-700">
          {promotion.descripcion || "Promoción especial disponible por tiempo limitado."}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-black text-yellow-500">
            {promotion.descuentoPorcentaje
              ? `${promotion.descuentoPorcentaje}% dscto.`
              : promotion.montoMax
              ? `Hasta S/ ${Number(promotion.montoMax).toFixed(2)}`
              : "Oferta activa"}
          </span>

          <button
            onClick={handleClick}
            className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-500 shadow-md"
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}

export default PromotionCard;
