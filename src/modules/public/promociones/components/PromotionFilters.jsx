function PromotionFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Buscar promoción
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ej. combo, descuento, cumpleaños..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Estado
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          >
            <option value="Todas">Todas</option>
            <option value="Activas">Activas</option>
            <option value="Inactivas">Inactivas</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default PromotionFilters;