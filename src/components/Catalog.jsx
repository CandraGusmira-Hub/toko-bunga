import { useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS } from '../data/products'
import ProductCard from './ProductCard'

export default function Catalog() {
  const [filter, setFilter] = useState('semua')

  const list = useMemo(
    () => PRODUCTS.filter((p) => filter === 'semua' || p.category === filter),
    [filter],
  )

  return (
    <section id="katalog" className="bg-white/60 py-16">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-center">Katalog Bunga</h2>
        <p className="text-center text-stone-600 mt-2">Pilih bunga favorit Anda dan pesan langsung lewat WhatsApp.</p>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={`text-sm font-medium rounded-full px-5 py-2 border transition ${
                filter === c.key
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'border-rose-200 text-stone-600 hover:bg-rose-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 mt-10">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
