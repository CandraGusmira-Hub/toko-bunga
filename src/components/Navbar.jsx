import { useEffect, useRef, useState } from 'react'
import { BRAND, WA_NUMBER } from '../config'
import { useCart } from '../context/cart-context'
import useStoreStatus from '../hooks/useStoreStatus'
import { waLink } from '../utils/whatsapp'
import { BagIcon, CloseIcon, LeafIcon, MenuIcon, ChatIcon } from './Icons'

const LINKS = [
  { href: '#katalog', label: 'Katalog Bunga', icon: '🌸' },
  { href: '#custombunga', label: 'Custom Builder', icon: '🎨' },
  { href: '#keunggulan', label: 'Keunggulan Layanan', icon: '✨' },
  { href: '#faq', label: 'Pertanyaan (FAQ)', icon: '💬' },
  { href: '#kontak', label: 'Kontak & Lokasi', icon: '📍' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuRef = useRef(null)
  const { count, openCart } = useCart()
  const storeStatus = useStoreStatus()

  const [name, ...rest] = BRAND.split('.')
  const suffix = rest.join('.')

  // Deteksi scroll untuk efek glass pada navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8)

      const sections = ['katalog', 'custombunga', 'keunggulan', 'faq', 'kontak']
      const scrollPos = window.scrollY + 120

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(`#${sectionId}`)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Klik di luar dropdown untuk menutup menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        // Cek jika yang diklik bukan tombol toggle hamburger
        const toggleBtn = document.getElementById('navbar-mobile-toggle')
        if (toggleBtn && !toggleBtn.contains(e.target)) {
          setOpen(false)
        }
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  // Navigasi smooth scroll yang bebas bug
  const handleNavClick = (e, href) => {
    setOpen(false)

    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const navHeight = 68
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight
        window.scrollTo({
          top: targetTop > 0 ? targetTop : 0,
          behavior: 'smooth',
        })
        window.history.pushState(null, '', href)
        setActiveSection(href)
      }
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-petal/80 bg-white/90 shadow-xs backdrop-blur-xl'
          : 'border-b border-petal/50 bg-paper/90 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="group flex min-w-0 items-center gap-2.5 transition focus-visible:rounded-lg"
          title={`${BRAND} — Beranda`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-peony text-white shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:bg-peony-dark sm:h-10 sm:w-10">
            <LeafIcon className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="truncate font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {name}
              {suffix && <span className="text-peony">.{suffix}</span>}
            </span>
            <div className="hidden items-center gap-1.5 text-[11px] font-medium sm:flex">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  storeStatus.open ? 'bg-emerald-500 animate-pulse' : 'bg-peony'
                }`}
              />
              <span className="text-muted">
                {storeStatus.open ? 'Buka Sekarang' : 'Tutup Sementara'}
              </span>
            </div>
          </div>
        </a>

        {/* Menu Navigasi Desktop */}
        <nav aria-label="Menu utama" className="hidden items-center gap-1 md:flex lg:gap-1.5">
          {LINKS.map((link) => {
            const isActive = activeSection === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-peony/10 text-peony'
                    : 'text-ink/75 hover:bg-blush/60 hover:text-ink'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-peony" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Aksi Kanan (Keranjang, Belanja, Toggle Hamburger) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Tombol Keranjang */}
          <button
            type="button"
            aria-label={count > 0 ? `Buka keranjang belanja, ${count} item` : 'Buka keranjang belanja'}
            onClick={() => {
              setOpen(false)
              openCart()
            }}
            className="group relative grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border border-petal/80 bg-white text-ink shadow-xs transition hover:border-peony/40 hover:bg-blush active:scale-95"
          >
            <BagIcon className="h-5 w-5 transition group-hover:text-peony" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-peony px-1.5 text-[11px] font-bold leading-none text-white shadow-xs">
                {count}
              </span>
            )}
          </button>

          {/* Tombol CTA Pesan Bunga (Desktop) */}
          <a
            href="#katalog"
            onClick={(e) => handleNavClick(e, '#katalog')}
            className="hidden items-center gap-2 rounded-full bg-peony px-5 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:bg-peony-dark active:scale-95 sm:inline-flex"
          >
            <span>Pesan Bunga</span>
          </a>

          {/* Tombol Toggle Menu Mobile dengan Ikon Berubah */}
          <button
            id="navbar-mobile-toggle"
            type="button"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className={`grid h-10 w-10 place-items-center rounded-full border transition active:scale-95 md:hidden ${
              open
                ? 'border-peony bg-peony text-white shadow-lift'
                : 'border-petal/80 bg-white text-ink hover:bg-blush'
            }`}
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Modern Glass Dropdown Menu (Hanya turun di bawah navbar, TIDAK menutupi layar) */}
      {open && (
        <>
          {/* Backdrop transparan lembut: klik di luar otomatis tutup */}
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-30 bg-ink/15 backdrop-blur-xs transition-opacity duration-200 md:hidden"
          />

          {/* Panel Dropdown Glassmorphic yang Kompak & Elegan */}
          <div
            ref={menuRef}
            className="absolute left-0 right-0 top-full z-40 border-b border-petal/80 bg-white/95 px-4 pb-4 pt-2 shadow-xl backdrop-blur-2xl md:hidden animate-fade"
          >
            {/* Header Mini Dropdown dengan Tombol Tutup Khusus */}
            <div className="flex items-center justify-between border-b border-petal/50 pb-2.5 pt-1 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-ink">
                <span
                  className={`h-2 w-2 rounded-full ${
                    storeStatus.open ? 'bg-emerald-500 animate-pulse' : 'bg-peony'
                  }`}
                />
                <span className="text-muted">{storeStatus.label}</span>
              </div>

              {/* Tombol Tutup Eksplisit */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-xs font-semibold text-peony-dark hover:bg-petal/60 transition active:scale-95"
              >
                <span>Tutup</span>
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Daftar Menu Ringkas & Rapi */}
            <nav aria-label="Menu navigasi mobile" className="mt-2 divide-y divide-petal/40">
              {LINKS.map((link) => {
                const isActive = activeSection === link.href
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center justify-between py-2.5 px-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-peony/10 text-peony font-bold pl-3'
                        : 'text-ink/85 hover:bg-blush/60 hover:text-ink hover:pl-3'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </span>
                    <span className="text-xs text-muted/60">→</span>
                  </a>
                )
              })}
            </nav>

            {/* Aksi Cepat Bawah: Tombol Keranjang & Chat WA dalam 1 Baris Sejajar */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-petal/60 pt-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openCart()
                }}
                className="flex items-center justify-center gap-1.5 rounded-full border border-petal/80 bg-white py-2.5 text-xs font-semibold text-ink shadow-2xs hover:bg-blush transition"
              >
                <BagIcon className="h-4 w-4 text-peony" />
                <span>Keranjang ({count})</span>
              </button>

              <a
                href={waLink(`Halo ${BRAND}, saya ingin bertanya tentang pemesanan bunga.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-peony py-2.5 text-xs font-bold text-white shadow-lift hover:bg-peony-dark transition"
              >
                <ChatIcon className="h-3.5 w-3.5" />
                <span>Chat Admin</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
