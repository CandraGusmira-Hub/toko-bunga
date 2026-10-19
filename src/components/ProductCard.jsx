import { useRef, useState } from 'react'
import { BRAND, WA_NUMBER } from '../config'
import { CATEGORIES } from '../data/products'
import { rupiah } from '../utils/format'

// Tombol panah: selalu tampil di HP, muncul saat hover/fokus di desktop
const arrow =
  'absolute top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 text-rose-600 text-lg leading-none flex items-center justify-center shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100'

export default function ProductCard({ product }) {
  const message = encodeURIComponent(`Halo ${BRAND}, saya ingin memesan ${product.name}`)
  const category = CATEGORIES.find((c) => c.key === product.category)

  const images = product.images ?? []
  const slider = useRef(null)
  const [index, setIndex] = useState(0)

  const onScroll = (e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
  const goTo = (i) => slider.current.scrollTo({ left: i * slider.current.clientWidth, behavior: 'smooth' })

  return (
    <article className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-rose-100 flex flex-col h-full">
      {/* Rasio tetap agar semua gambar seragam dan pas dengan card */}
      <div className={`aspect-square w-full bg-gradient-to-br ${product.bg} relative overflow-hidden`}>
        {images.length ? (
          <div
            ref={slider}
            onScroll={onScroll}
            className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${product.name} ${i + 1}`}
                loading="lazy"
                draggable="false"
                className="h-full w-full shrink-0 snap-center object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-7xl">
            {product.emoji}
          </div>
        )}

        {category && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/80 text-rose-600">
            {category.label}
          </span>
        )}

        {index > 0 && (
          <button
            type="button"
            aria-label="Gambar sebelumnya"
            onClick={() => goTo(index - 1)}
            className={`${arrow} left-2`}
          >
            ‹
          </button>
        )}
        {index < images.length - 1 && (
          <button
            type="button"
            aria-label="Gambar berikutnya"
            onClick={() => goTo(index + 1)}
            className={`${arrow} right-2`}
          >
            ›
          </button>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Lihat gambar ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 flex-1">
        <div>
          <h3 className="font-display text-sm sm:text-lg font-bold leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-rose-600 font-semibold text-sm sm:text-base mt-1">
            {rupiah(product.price)}{' '}
            <span className="text-[10px] sm:text-xs font-normal text-stone-500">/ {product.unit}</span>
          </p>
        </div>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-center text-xs sm:text-sm font-semibold rounded-full py-2 sm:py-2.5 bg-rose-500 text-white hover:bg-rose-600 transition"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </article>
  )
}
