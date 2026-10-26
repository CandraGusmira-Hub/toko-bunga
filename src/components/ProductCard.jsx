import { CATEGORIES } from '../data/products'
import { useCart } from '../context/cart-context'
import { rupiah } from '../utils/format'
import { PlusIcon } from './Icons'
import ProductMedia from './ProductMedia'
import QtyStepper from './QtyStepper'

export default function ProductCard({ product, onOpen }) {
  const { qtyOf, change } = useCart()
  const qty = qtyOf(product.id)
  const category = CATEGORIES.find((c) => c.key === product.category)

  return (
    <article className="group flex h-full flex-col">
      {/* Rasio tetap agar semua gambar seragam */}
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${product.bg}`}>
        <ProductMedia product={product} onClick={() => onOpen(product)} />

        {category && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-peony-dark">
            {category.label}
          </span>
        )}

        <div className="absolute bottom-3 right-3">
          {qty === 0 ? (
            <button
              type="button"
              aria-label={`Tambah ${product.name} ke keranjang`}
              onClick={() => change(product.id, 1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-peony text-white shadow-lift transition hover:bg-peony-dark active:scale-95"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          ) : (
            <QtyStepper
              value={qty}
              label={product.name}
              onDec={() => change(product.id, -1)}
              onInc={() => change(product.id, 1)}
              className="border-transparent shadow-lift"
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug sm:text-lg">
          <button type="button" onClick={() => onOpen(product)} className="text-left hover:text-peony-dark">
            {product.name}
          </button>
        </h3>
        <p className="shrink-0 text-right text-sm font-semibold text-peony-dark">
          {rupiah(product.price)}
          <span className="block text-xs font-normal text-muted">/ {product.unit}</span>
        </p>
      </div>
    </article>
  )
}
