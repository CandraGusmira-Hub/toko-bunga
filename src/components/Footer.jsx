import { BRAND, CONTACT, WA_NUMBER } from '../config'
import useStoreStatus from '../hooks/useStoreStatus'
import { ChatIcon, ClockIcon, MailIcon, PinIcon, LeafIcon } from './Icons'

const MENU = [
  { href: '#katalog', label: 'Katalog Bunga' },
  { href: '#custombunga', label: 'Custom Builder' },
  { href: '#keunggulan', label: 'Keunggulan Layanan' },
  { href: '#faq', label: 'Pertanyaan Umum (FAQ)' },
]

const SOCIALS = [
  { href: CONTACT.instagram, label: 'Instagram' },
  { href: CONTACT.tiktok, label: 'TikTok' },
  { href: `https://wa.me/${WA_NUMBER}`, label: 'WhatsApp' },
]

const heading = 'font-display text-base font-bold uppercase tracking-wider text-ink'
const link = 'text-sm text-muted transition hover:text-peony hover:underline'
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`

export default function Footer() {
  const status = useStoreStatus()
  const [name, ...rest] = BRAND.split('.')
  const suffix = rest.join('.')

  return (
    <footer id="kontak" className="border-t border-petal/70 bg-paper pt-16 pb-12 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr] lg:gap-14">
          {/* Kolom 1: Profil Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-peony text-white shadow-xs">
                <LeafIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {name}
                {suffix && <span className="text-peony">.{suffix}</span>}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Toko bunga segar lokal melayani pengiriman hand bouquet, flower box, standing flower, dan bunga segar harian. Setiap tangkai dirangkai dengan sepenuh hati.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-petal bg-white px-4 py-2 text-xs font-semibold text-ink shadow-xs transition hover:border-peony hover:bg-blush hover:text-peony"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Kolom 2: Navigasi Menu */}
          <nav aria-label="Menu footer">
            <h3 className={heading}>Navigasi Toko</h3>
            <ul className="mt-4 space-y-3">
              {MENU.map((m) => (
                <li key={m.href}>
                  <a href={m.href} className={link}>
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kolom 3: Kontak & Jam Buka */}
          <div>
            <h3 className={heading}>Kontak &amp; Operasional</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-muted">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-peony" />
                <span>
                  <strong className="block text-ink font-semibold">{CONTACT.address}</strong>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block text-xs font-semibold text-peony hover:underline"
                  >
                    Petunjuk Arah Google Maps →
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <ChatIcon className="h-5 w-5 shrink-0 text-peony" />
                <a href={`https://wa.me/${WA_NUMBER}`} className={link}>
                  +{WA_NUMBER} (WhatsApp Admin)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 shrink-0 text-peony" />
                <a href={`mailto:${CONTACT.email}`} className={`${link} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-peony" />
                <div>
                  <span className="block text-ink font-medium">{CONTACT.hours}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-blush px-2.5 py-0.5 text-xs font-semibold text-ink border border-petal/60">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-500 animate-pulse' : 'bg-peony'}`}
                    />
                    {status.label}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bar Bawah Hak Cipta */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-petal/70 pt-6 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {BRAND}. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p className="flex items-center gap-1 text-ink/75 font-medium">
            <span>🌸</span> Rangkaian bunga segar harian dengan pengiriman aman
          </p>
        </div>
      </div>
    </footer>
  )
}
