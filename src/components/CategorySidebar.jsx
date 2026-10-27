import { CATEGORIES, TYPES, PRICE_RANGES, PRODUCTS } from '../data/products'

export default function CategorySidebar({
  filter,
  setFilter,
  type,
  setType,
  priceRange,
  setPriceRange,
  counts,
  onReset,
  hasActiveFilters,
  className = '',
}) {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Header filter & Reset */}
      <div className="flex items-center justify-between border-b border-petal/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peony/10 text-xs font-semibold text-peony">
            ⚙
          </span>
          <h3 className="font-semibold text-ink">Filter &amp; Kategori</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-peony hover:underline"
          >
            Reset Semua
          </button>
        )}
      </div>

      {/* 1. Kategori Bunga & Buket */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
          Kategori Pilihan
        </p>
        <div className="space-y-1">
          {CATEGORIES.map((c) => {
            const isActive = filter === c.key
            const count = counts?.category?.[c.key] ?? 0
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-peony text-white shadow-sm'
                    : 'text-ink/80 hover:bg-blush hover:text-ink'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{c.icon}</span>
                  <span>{c.label}</span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-petal/60 text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Format Produk (Buket Siap Jadi vs Tangkai) */}
      <div className="border-t border-petal/60 pt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
          Format Rangkaian
        </p>
        <div className="space-y-1">
          {TYPES.map((t) => {
            const isActive = type === t.key
            const count = counts?.type?.[t.key] ?? 0
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-peony text-white font-semibold shadow-xs'
                    : 'text-ink/80 hover:bg-blush hover:text-ink'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-petal/50 text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Rentang Harga */}
      <div className="border-t border-petal/60 pt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
          Rentang Harga
        </p>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const isActive = priceRange === r.key
            return (
              <label
                key={r.key}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                  isActive ? 'bg-blush font-semibold text-peony-dark' : 'text-ink/80 hover:bg-blush/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="priceRange"
                    value={r.key}
                    checked={isActive}
                    onChange={() => setPriceRange(r.key)}
                    className="accent-peony"
                  />
                  <span>{r.label}</span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* 4. Keuntungan Toko & Info Pelayanan */}
      <div className="rounded-2xl border border-petal bg-blush/40 p-4 text-xs space-y-2.5 text-ink/80">
        <p className="font-semibold text-ink flex items-center gap-1.5">
          <span>🌸</span> Layanan Candra.florist
        </p>
        <p className="flex items-center gap-2 text-muted">
          <span className="text-peony font-bold">✔</span> Bunga segar langsung dari kebun
        </p>
        <p className="flex items-center gap-2 text-muted">
          <span className="text-peony font-bold">✔</span> Gratis kartu ucapan &amp; pita satin
        </p>
        <p className="flex items-center gap-2 text-muted">
          <span className="text-peony font-bold">✔</span> Same-day delivery area kota
        </p>
      </div>
    </aside>
  )
}
