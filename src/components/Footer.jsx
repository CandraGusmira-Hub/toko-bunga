import { BRAND, CONTACT, WA_NUMBER } from '../config'
import useStoreStatus from '../hooks/useStoreStatus'
import { ChatIcon, ClockIcon, MailIcon, PinIcon } from './Icons'

const MENU = [
  { href: '#katalog', label: 'Katalog Bunga' },
  { href: '#custombunga', label: 'Custom Bouquet' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#faq', label: 'Pertanyaan umum' },
]

const SOCIALS = [
  { href: CONTACT.instagram, label: 'Instagram' },
  { href: CONTACT.tiktok, label: 'TikTok' },
  { href: `https://wa.me/${WA_NUMBER}`, label: 'WhatsApp' },
]

const heading = 'font-display text-lg font-semibold'
const link = 'text-muted transition hover:text-peony-dark'
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`

export default function Footer() {
  const status = useStoreStatus()

  return (
    <footer id="kontak" className="bg-blush">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-3xl font-semibold tracking-tight">{BRAND}</p>
            <p className="mt-3 max-w-xs leading-relaxed text-muted">
              Toko bunga segar untuk ucapan cinta, selamat, dan terima kasih. Dirangkai dengan sepenuh hati.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-leaf/25 px-4 py-2 text-sm font-semibold text-leaf transition hover:border-leaf hover:bg-leaf hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Menu footer">
            <h3 className={heading}>Menu</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {MENU.map((m) => (
                <li key={m.href}>
                  <a href={m.href} className={link}>
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={heading}>Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-peony" />
                <span>
                  {CONTACT.address}
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-leaf hover:underline">
                    Buka di Google Maps
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <ChatIcon className="mt-0.5 h-5 w-5 shrink-0 text-peony" />
                <a href={`https://wa.me/${WA_NUMBER}`} className={link}>
                  +{WA_NUMBER}
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-peony" />
                <a href={`mailto:${CONTACT.email}`} className={`${link} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-peony" />
                <span>
                  {CONTACT.hours}
                  <span className="mt-1 flex items-center gap-2 font-semibold text-ink">
                    <span aria-hidden="true" className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-muted/50'}`} />
                    {status.label}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-petal pt-6 text-center text-xs text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {BRAND} Fresh Flowers. Semua hak dilindungi.
          </p>
          <p>Dirangkai dengan cinta untuk para pecinta bunga</p>
        </div>
      </div>
    </footer>
  )
}
