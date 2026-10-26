import { useCallback, useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS, SORTS } from '../data/products'
import { chip, field } from '../utils/ui'
import { SearchIcon } from './Icons'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

export default function Catalog() {
  const [filter, setFilter] = useState('semua')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('rekomendasi')
  const [selected, setSelected] = useState(null)
  const closeModal = useCallback(() => setSelected(null), [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = PRODUCTS.filter(
      (p) => (filter === 'semua' || p.category === filter) && (!q || p.name.toLowerCase().includes(q)),
    )
    if (sort === 'termurah') out.sort((a, b) => a.price - b.price)
    else if (sort === 'termahal') out.sort((a, b) => b.price - a.price)
    else if (sort === 'nama') out.sort((a, b) => a.name.localeCompare(b.name, 'id'))
    return out
  }, [filter, query, sort])

  const reset = () => {
    setFilter('semua')
    setQuery('')
    setSort('rekomendasi')
  }

  return (
    <section id="katalog" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Katalog bunga</h2>
            <p className="mt-3 text-muted">
              Pilih bunga favoritmu, tambahkan ke keranjang, lalu kirim pesanan lewat WhatsApp.
            </p>
          </div>

          <label className="relative block w-full md:w-72">
            <span className="sr-only">Cari bunga</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari bunga, mis. mawar"
              className={`${field} pl-11`}
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={filter === c.key}
                onClick={() => setFilter(c.key)}
                className={chip(filter === c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted">
            Urutkan
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-petal bg-white py-2 pl-4 pr-8 text-sm font-medium text-ink focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/25"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p aria-live="polite" className="mt-6 text-sm text-muted">
          {list.length === PRODUCTS.length ? `${list.length} bunga` : `${list.length} dari ${PRODUCTS.length} bunga`}
        </p>

        {list.length ? (
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[1.75rem] border border-dashed border-petal bg-blush/50 px-6 py-14 text-center">
            <p className="text-lg font-semibold">Bunga yang kamu cari belum ketemu</p>
            <p className="mt-1 text-sm text-muted">Coba kata kunci lain, atau tampilkan semua bunga.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full bg-leaf px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-dark"
            >
              Tampilkan semua bunga
            </button>
          </div>
        )}
      </div>

      {selected && <ProductModal product={selected} onClose={closeModal} />}
    </section>
  )
}
