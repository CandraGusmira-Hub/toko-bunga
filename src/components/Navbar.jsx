import { useState } from 'react'
import { BRAND } from '../config'

const LINKS = [
  { href: '#katalog', label: 'Katalog' },
  { href: '#custom', label: 'Custom' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#kontak', label: 'Kontak' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-[#fff7f8]/85 border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-2xl font-bold text-rose-600">
          {BRAND}
        </a>

        <nav className="hidden sm:flex gap-8 text-sm font-medium">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-rose-600 transition">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#katalog"
            className="text-sm font-semibold bg-rose-500 text-white rounded-full px-5 py-2 hover:bg-rose-600 transition"
          >
            Belanja
          </a>
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden text-2xl leading-none"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-rose-100 px-5 py-3 flex flex-col gap-3 text-sm font-medium">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-rose-600">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
