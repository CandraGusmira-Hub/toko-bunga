import { BRAND } from '../config'
import { useCart } from '../context/cart-context'
import { rupiah } from '../utils/format'
import { waLink } from '../utils/whatsapp'
import { BagIcon, ChatIcon } from './Icons'

// Bar keranjang (muncul saat ada isi) dan tombol chat WhatsApp yang selalu terlihat
export default function FloatingActions() {
  const { count, total, openCart } = useCart()

  return (
    <>
      {count > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <button
            type="button"
            onClick={openCart}
            className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-ink py-2.5 pl-5 pr-2.5 text-white shadow-2xl transition hover:bg-ink/90 motion-safe:animate-rise"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold">
              <BagIcon className="h-5 w-5 text-peony-light" />
              <span>{count} item</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="text-sm font-bold">{rupiah(total)}</span>
              <span className="rounded-full bg-peony px-4 py-2 text-xs sm:text-sm font-semibold shadow-lift hover:bg-peony-dark transition">
                Lihat Keranjang
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Tombol WhatsApp resmi: warna hijau WhatsApp asli (#25D366) yang tepat & universal */}
      <a
        href={waLink(`Halo ${BRAND}, saya ingin bertanya tentang pemesanan bunga.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin"
        className={`fixed right-4 z-30 flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/25 transition hover:bg-[#20ba5a] hover:scale-105 active:scale-95 lg:bottom-5 lg:w-auto lg:px-5 w-14 ${
          count > 0 ? 'bottom-24' : 'bottom-5'
        }`}
      >
        <ChatIcon className="h-6 w-6" />
        <span className="hidden text-sm font-bold lg:inline">Chat Kami</span>
      </a>
    </>
  )
}
