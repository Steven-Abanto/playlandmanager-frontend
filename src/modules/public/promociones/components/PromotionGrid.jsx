import PromotionCard from "./PromotionCard";

function PromotionGrid({ promotions }) {
  if (promotions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-xl font-semibold text-slate-800">
          No se encontraron promociones
        </h3>
        <p className="mt-2 text-slate-600">
          Intenta con otra búsqueda o revisa más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.idPromocion || promotion.id}
          promotion={promotion}
        />
      ))}
    </div>
  );
}

export default PromotionGrid;