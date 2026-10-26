import { BRAND } from '../config'
import { CATEGORIES } from '../data/products'
import { useCart } from '../context/cart-context'
import useDialog from '../hooks/useDialog'
import { rupiah } from '../utils/format'
import { waLink } from '../utils/whatsapp'
import { ChatIcon, CloseIcon, PlusIcon } from './Icons'
import ProductMedia from './ProductMedia'
import QtyStepper from './QtyStepper'

const CARE = [
  'Potong sekitar 2 cm ujung tangkai secara miring.',
  'Taruh di air bersih dan ganti air setiap hari.',
  'Jauhkan dari sinar matahari langsung dan buah segar.',
]

// Jendela detail produk: foto besar, deskripsi, tips perawatan, dan tombol pesan
export default function ProductModal({ product, onClose }) {
  const ref = useDialog(onClose)
  const { qtyOf, change, openCart } = useCart()
  const qty = qtyOf(product.id)
  const category = CATEGORIES.find((c) => c.key === product.category)

  const orderNow = waLink(
    `Halo ${BRAND}, saya ingin memesan:\n- ${product.name} x${qty || 1} ${product.unit}`,
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-sm motion-safe:animate-fade" />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="produk-judul"
        className="group relative grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] bg-paper shadow-2xl motion-safe:animate-pop sm:rounded-[2rem] md:grid-cols-2"
      >
        <div className={`relative aspect-square w-full bg-gradient-to-br ${product.bg} md:aspect-auto md:min-h-[460px]`}>
          <ProductMedia
            product={product}
            emojiClass="text-8xl"
            dotsClass="bottom-4 left-1/2 -translate-x-1/2"
          />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <button
            type="button"
            data-autofocus
            aria-label="Tutup"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          {category && (
            <span className="w-fit rounded-full bg-blush px-3 py-1 text-xs font-semibold text-peony-dark">
              {category.label}
            </span>
          )}
          <h2 id="produk-judul" className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-2 text-xl font-semibold text-peony-dark">
            {rupiah(product.price)} <span className="text-sm font-normal text-muted">/ {product.unit}</span>
          </p>
          <p className="mt-4 leading-relaxed text-muted">{product.desc}</p>

          <div className="mt-6 rounded-2xl bg-leaf-mist p-4">
            <h3 className="text-sm font-semibold text-leaf">Tips perawatan</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-leaf-dark">
              {CARE.map((c) => (
                <li key={c} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-leaf" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-6">
            {qty === 0 ? (
              <button
                type="button"
                onClick={() => change(product.id, 1)}
                className="flex items-center justify-center gap-2 rounded-full bg-peony px-6 py-3.5 font-semibold text-white shadow-lift transition hover:bg-peony-dark"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah ke keranjang
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <QtyStepper
                  value={qty}
                  label={product.name}
                  onDec={() => change(product.id, -1)}
                  onInc={() => change(product.id, 1)}
                />
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    openCart()
                  }}
                  className="flex-1 rounded-full bg-leaf px-6 py-3.5 font-semibold text-white transition hover:bg-leaf-dark"
                >
                  Lihat keranjang
                </button>
              </div>
            )}
            <a
              href={orderNow}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-petal px-6 py-3 text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
            >
              <ChatIcon className="h-4 w-4" />
              Pesan langsung via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
