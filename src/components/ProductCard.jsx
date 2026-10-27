import { CATEGORIES } from '../data/products'
import { useCart } from '../context/cart-context'
import { BRAND } from '../config'
import { rupiah } from '../utils/format'
import { waLink } from '../utils/whatsapp'
import { ChatIcon, PlusIcon } from './Icons'
import ProductMedia from './ProductMedia'
import QtyStepper from './QtyStepper'

export default function ProductCard({ product, onOpen }) {
  const { qtyOf, change } = useCart()
  const qty = qtyOf(product.id)
  const category = CATEGORIES.find((c) => c.key === product.category)

  const directWaHref = waLink(
    `Halo ${BRAND}, saya tertarik dan ingin memesan langsung:\n- *${product.name}* (${rupiah(product.price)} / ${product.unit})\nApakah produk ini tersedia untuk pengiriman segera?`
  )

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] sm:rounded-[1.6rem] border border-petal/70 bg-white p-2.5 sm:p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-peony/35 hover:shadow-md">
      {/* Gambar & Media dengan Rasio 4:5 */}
      <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] sm:rounded-[1.2rem] bg-gradient-to-br ${product.bg || 'from-rose-100 to-rose-50'}`}>
        <ProductMedia product={product} onClick={() => onOpen(product)} />

        {/* Badge Kategori & Penanda Khusus */}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {category && (
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide text-peony-dark shadow-xs backdrop-blur-xs">
              {category.label}
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-peony-dark px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Tombol aksi cepat di sudut bawah gambar */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {qty === 0 ? (
            <button
              type="button"
              aria-label={`Tambah ${product.name} ke keranjang`}
              onClick={() => change(product.id, 1)}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-peony text-white shadow-lift transition hover:bg-peony-dark hover:scale-105 active:scale-95"
              title="Tambah ke keranjang"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          ) : (
            <QtyStepper
              value={qty}
              label={product.name}
              onDec={() => change(product.id, -1)}
              onInc={() => change(product.id, 1)}
              className="scale-90 sm:scale-100 origin-bottom-right border-transparent bg-white shadow-lift"
            />
          )}
        </div>
      </div>

      {/* Info Produk: Nama, Deskripsi Singkat, Harga */}
      <div className="mt-2.5 sm:mt-3 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-display text-sm sm:text-base font-bold leading-snug text-ink">
            <button
              type="button"
              onClick={() => onOpen(product)}
              className="text-left line-clamp-1 transition hover:text-peony"
              title={product.name}
            >
              {product.name}
            </button>
          </h3>
          {product.desc && (
            <p className="mt-1 line-clamp-1 sm:line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-muted">
              {product.desc}
            </p>
          )}
        </div>

        {/* Harga & Tombol Pesan Langsung */}
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-1 border-t border-petal/50 pt-2 sm:pt-2.5">
          <div className="min-w-0">
            <span className="text-xs sm:text-base font-bold text-peony-dark truncate block">
              {rupiah(product.price)}
            </span>
            <span className="text-[10px] sm:text-xs text-muted block -mt-0.5">
              /{product.unit}
            </span>
          </div>

          <a
            href={directWaHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Pesan via WhatsApp"
            aria-label={`Pesan ${product.name} via WhatsApp`}
            className="flex items-center gap-1 rounded-full border border-petal bg-blush px-2 py-1 text-[11px] font-semibold text-peony-dark transition hover:border-peony hover:bg-peony hover:text-white shrink-0"
          >
            <ChatIcon className="h-3.5 w-3.5" />
            <span className="hidden min-[480px]:inline">Pesan</span>
          </a>
        </div>
      </div>
    </article>
  )
}
