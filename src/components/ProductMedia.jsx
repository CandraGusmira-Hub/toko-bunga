import { useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'

// Tombol panah: selalu tampil di HP, muncul saat hover/fokus di desktop
const arrow =
  'absolute top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'

// Gambar produk yang bisa digeser. Mengisi penuh parent (parent harus `relative` dan punya ukuran,
// dan memakai class `group` agar panah muncul saat hover).
export default function ProductMedia({
  product,
  onClick,
  emojiClass = 'text-6xl sm:text-7xl',
  dotsClass = 'right-3 top-4',
}) {
  const images = product.images ?? []
  const slider = useRef(null)
  const [index, setIndex] = useState(0)

  const onScroll = (e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
  const goTo = (i) => slider.current?.scrollTo({ left: i * slider.current.clientWidth, behavior: 'smooth' })

  if (!images.length) {
    return (
      <div
        onClick={onClick}
        className={`absolute inset-0 grid place-items-center ${emojiClass} ${onClick ? 'cursor-pointer' : ''}`}
      >
        <span role="img" aria-label={product.name}>
          {product.emoji}
        </span>
      </div>
    )
  }

  return (
    <>
      <div
        ref={slider}
        onScroll={onScroll}
        onClick={onClick}
        className={`absolute inset-0 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          onClick ? 'cursor-pointer' : ''
        }`}
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

      {index > 0 && (
        <button
          type="button"
          aria-label="Gambar sebelumnya"
          onClick={(e) => {
            e.stopPropagation()
            goTo(index - 1)
          }}
          className={`${arrow} left-2`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          type="button"
          aria-label="Gambar berikutnya"
          onClick={(e) => {
            e.stopPropagation()
            goTo(index + 1)
          }}
          className={`${arrow} right-2`}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}

      {images.length > 1 && (
        <div className={`pointer-events-none absolute flex gap-1.5 ${dotsClass}`}>
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
