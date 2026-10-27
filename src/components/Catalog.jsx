import { useCallback, useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS, SORTS, TYPES, PRICE_RANGES } from '../data/products'
import { chip, field } from '../utils/ui'
import { SearchIcon, CloseIcon } from './Icons'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import CategorySidebar from './CategorySidebar'

export default function Catalog() {
  const [filter, setFilter] = useState('semua')
  const [type, setType] = useState('semua')
  const [priceRange, setPriceRange] = useState('semua')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('rekomendasi')
  const [selected, setSelected] = useState(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const closeModal = useCallback(() => setSelected(null), [])

  // Hitung jumlah produk per kategori dan tipe
  const counts = useMemo(() => {
    const categoryCounts = { semua: PRODUCTS.length }
    CATEGORIES.forEach((c) => {
      if (c.key !== 'semua') {
        categoryCounts[c.key] = PRODUCTS.filter((p) => {
          if (c.key === 'buket') return p.type === 'buket'
          return p.category === c.key
        }).length
      }
    })

    const typeCounts = { semua: PRODUCTS.length }
    TYPES.forEach((t) => {
      if (t.key !== 'semua') {
        typeCounts[t.key] = PRODUCTS.filter((p) => p.type === t.key).length
      }
    })

    return { category: categoryCounts, type: typeCounts }
  }, [])

  // Filter dan urutkan produk
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const selectedRange = PRICE_RANGES.find((r) => r.key === priceRange) || PRICE_RANGES[0]

    const out = PRODUCTS.filter((p) => {
      // Filter kategori
      let matchCategory = true
      if (filter === 'buket') {
        matchCategory = p.type === 'buket'
      } else if (filter !== 'semua') {
        matchCategory = p.category === filter
      }

      // Filter tipe (buket vs tangkai)
      let matchType = true
      if (type !== 'semua') {
        matchType = p.type === type
      }

      // Filter rentang harga
      const matchPrice = p.price >= selectedRange.min && p.price <= selectedRange.max

      // Filter pencarian
      const matchQuery = !q || p.name.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q))

      return matchCategory && matchType && matchPrice && matchQuery
    })

    if (sort === 'termurah') out.sort((a, b) => a.price - b.price)
    else if (sort === 'termahal') out.sort((a, b) => b.price - a.price)
    else if (sort === 'nama') out.sort((a, b) => a.name.localeCompare(b.name, 'id'))
    return out
  }, [filter, type, priceRange, query, sort])

  const hasActiveFilters = filter !== 'semua' || type !== 'semua' || priceRange !== 'semua' || query.trim() !== ''

  const reset = () => {
    setFilter('semua')
    setType('semua')
    setPriceRange('semua')
    setQuery('')
    setSort('rekomendasi')
  }

  return (
    <section id="katalog" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Katalog */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold text-peony-dark">
              <span>🌸</span> Koleksi Bunga Segar &amp; Buket
            </span>
            <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl text-ink">
              Katalog Buket &amp; Bunga
            </h2>
            <p className="mt-3 text-muted">
              Pilih buket bunga siap kirim atau bunga segar favoritmu. Pesan instan langsung terhubung ke WhatsApp admin.
            </p>
          </div>

          {/* Bar Pencarian */}
          <div className="w-full md:w-80">
            <label className="relative block">
              <span className="sr-only">Cari bunga atau buket</span>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari buket mawar, sunflower..."
                className={`${field} pl-11 pr-10`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>
        </div>

        {/* Kontrol Mobile: Pill Kategori Cepat & Tombol Buka Filter */}
        <div className="mt-8 flex flex-col gap-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-petal bg-white px-4 py-2 text-sm font-semibold text-ink shadow-xs hover:bg-blush"
            >
              <span>⚙</span> Filter &amp; Kategori
              {hasActiveFilters && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-peony text-[11px] text-white">
                  !
                </span>
              )}
            </button>

            {/* Urutkan Mobile */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>Urut:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-petal bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-ink focus:border-peony"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pill Kategori Cepat (Horizontal Scroll di Layar HP) */}
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                className={`${chip(filter === c.key)} shrink-0 text-xs`}
              >
                <span className="mr-1">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Utama: Sidebar di Kiri + Grid Produk di Kanan */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-petal/70 bg-white p-5 shadow-xs">
              <CategorySidebar
                filter={filter}
                setFilter={setFilter}
                type={type}
                setType={setType}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                counts={counts}
                onReset={reset}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>

          {/* Area Produk */}
          <div>
            {/* Bar Toolbar Atas Grid di Desktop */}
            <div className="hidden items-center justify-between border-b border-petal/60 pb-4 lg:flex">
              <p aria-live="polite" className="text-sm font-medium text-muted">
                Menampilkan{' '}
                <strong className="text-ink">{list.length}</strong>{' '}
                {list.length === PRODUCTS.length ? 'produk' : `dari ${PRODUCTS.length} produk`}
              </p>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs font-semibold text-peony hover:underline"
                  >
                    Hapus semua filter
                  </button>
                )}
                <label className="flex items-center gap-2 text-sm text-muted">
                  <span>Urutkan:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-full border border-petal bg-white py-1.5 pl-4 pr-8 text-sm font-medium text-ink focus:border-peony focus:outline-none focus:ring-2 focus:ring-peony/25"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Grid Kartu Produk: 2 kolom di mobile/tablet, 3 kolom di desktop */}
            {list.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 xl:grid-cols-3">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setSelected} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[2rem] border border-dashed border-petal bg-blush/40 px-6 py-16 text-center">
                <span className="text-4xl">🌷</span>
                <p className="mt-3 text-lg font-semibold text-ink">Bunga yang kamu cari belum ditemukan</p>
                <p className="mt-1 text-sm text-muted">
                  Coba ubah kata kunci pencarian, filter kategori, atau rentang harga.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 rounded-full bg-peony px-6 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:bg-peony-dark active:scale-95"
                >
                  Tampilkan Semua Koleksi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Filter untuk Layar Mobile */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            aria-hidden="true"
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs"
          />
          <div className="relative max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-petal pb-3">
              <h3 className="text-lg font-bold text-ink">Filter &amp; Kategori</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-blush text-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <CategorySidebar
              filter={filter}
              setFilter={setFilter}
              type={type}
              setType={setType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              counts={counts}
              onReset={reset}
              hasActiveFilters={hasActiveFilters}
            />

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full rounded-full bg-peony py-3 text-center text-sm font-semibold text-white shadow-lift transition hover:bg-peony-dark"
            >
              Terapkan Filter ({list.length} Bunga)
            </button>
          </div>
        </div>
      )}

      {/* Modal Detail Produk */}
      {selected && <ProductModal product={selected} onClose={closeModal} />}
    </section>
  )
}
