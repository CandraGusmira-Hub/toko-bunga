import { useState } from 'react'
import { BRAND } from '../config'
import { useCart } from '../context/cart-context'
import { BagIcon, CloseIcon, LeafIcon, MenuIcon } from './Icons'

const LINKS = [
  { href: '#katalog', label: 'Katalog' },
  { href: '#custombunga', label: 'Custom' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()
  const [name, ...rest] = BRAND.split('.')
  const suffix = rest.join('.')

  return (
    <header className="sticky top-0 z-20 border-b border-petal/60 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <a href="#" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-peony-dark text-white">
            <LeafIcon className="h-4 w-4" />
          </span>
          <span className="truncate font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {name}
            {suffix && <span className="text-peony">.{suffix}</span>}
          </span>
        </a>

        <nav aria-label="Menu utama" className="hidden gap-8 text-sm font-medium md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-muted transition hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label={count > 0 ? `Buka keranjang, ${count} item` : 'Buka keranjang'}
            onClick={openCart}
            className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-blush"
          >
            <BagIcon className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-peony px-1 text-[11px] font-bold leading-none text-white">
                {count}
              </span>
            )}
          </button>
          <a
            href="#katalog"
            className="hidden rounded-full bg-peony px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-peony-dark sm:block"
          >
            Belanja
          </a>
          <button
            type="button"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full transition hover:bg-blush md:hidden"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Menu seluler" className="flex flex-col border-t border-petal/60 px-5 py-2 text-base font-medium md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-muted hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
