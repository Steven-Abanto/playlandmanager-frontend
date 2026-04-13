const DEFAULT_PROMOTION_IMAGE = "src/modules/public/images/oferta.png";

function formatPercent(value) {
  if (value === null || value === undefined) return "-";
  return `${(Number(value) * 100).toFixed(0)}%`;
}

function formatMoney(value) {
  if (value === null || value === undefined) return "-";
  return `S/ ${Number(value).toFixed(2)}`;
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString();
}

function PromotionGrid({ promotions }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {promotions.map((promotion) => {
        const imageSrc =
          promotion.imagenUrl && promotion.imagenUrl.trim()
            ? promotion.imagenUrl
            : DEFAULT_PROMOTION_IMAGE;

        return (
          <article
            key={promotion.idPromocion}
            className="overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-56 w-full overflow-hidden bg-gray-100">
              <img
                src={imageSrc}
                alt={promotion.nombre || promotion.codigo || "Promoción"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PROMOTION_IMAGE;
                }}
              />

              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg">
                -{formatPercent(promotion.porcentaje)}
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-red-500">
                  {promotion.codigo || "PROMO"}
                </p>
                <h3 className="mt-1 text-2xl font-black text-black">
                  {promotion.nombre || "Promoción"}
                </h3>
                <p className="mt-2 text-sm font-semibold text-gray-600">
                  {promotion.descripcion || "Aprovecha esta promoción disponible por tiempo limitado."}
                </p>
              </div>

              <div className="grid gap-3 rounded-2xl bg-red-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-700">Descuento</span>
                  <span className="text-base font-black text-red-600">
                    {formatPercent(promotion.porcentaje)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-700">Tope máximo</span>
                  <span className="text-base font-black text-black">
                    {formatMoney(promotion.montoMax)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-700">Válido desde</span>
                  <span className="text-sm font-bold text-black">
                    {formatDate(promotion.fechaInicio)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-700">Hasta</span>
                  <span className="text-sm font-bold text-black">
                    {formatDate(promotion.fechaFin)}
                  </span>
                </div>
              </div>

              {!!promotion.productos?.length && (
                <div>
                  <p className="mb-2 text-sm font-black text-black">
                    Productos incluidos
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {promotion.productos.slice(0, 4).map((producto) => (
                      <span
                        key={producto}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                      >
                        {producto}
                      </span>
                    ))}

                    {promotion.productos.length > 4 && (
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-800">
                        +{promotion.productos.length - 4} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default PromotionGrid;