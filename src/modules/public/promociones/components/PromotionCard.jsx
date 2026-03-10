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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={imageUrl}
        alt={promotion.nombre || promotion.codigo || "Promoción"}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
          Promoción
        </span>

        <h3 className="mt-3 text-xl font-bold text-slate-900">
          {promotion.nombre || promotion.codigo || "Promoción disponible"}
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          {promotion.descripcion || "Promoción especial disponible por tiempo limitado."}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">
            {promotion.descuentoPorcentaje
              ? `${promotion.descuentoPorcentaje}% dscto.`
              : promotion.montoMax
              ? `Hasta S/ ${Number(promotion.montoMax).toFixed(2)}`
              : "Oferta activa"}
          </span>

          <button
            onClick={handleClick}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}

export default PromotionCard;