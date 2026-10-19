import { BRAND, CONTACT, WA_NUMBER } from '../config'

const MENU = [
  { href: '#katalog', label: 'Katalog Bunga' },
  { href: '#custom', label: 'Custom Bouquet' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#kontak', label: 'Hubungi Kami' },
]

const SOCIALS = [
  { href: CONTACT.instagram, label: 'Instagram' },
  { href: CONTACT.tiktok, label: 'TikTok' },
  { href: `https://wa.me/${WA_NUMBER}`, label: 'WhatsApp' },
]

const heading = 'font-display text-xs font-bold uppercase tracking-widest text-rose-600'
const link = 'text-stone-600 hover:text-rose-600 transition'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-rose-100">
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-2xl font-extrabold text-rose-600">{BRAND} 🌸</p>
            <p className="mt-3 text-sm text-stone-600 max-w-xs leading-relaxed">
              Toko bunga segar untuk ucapan cinta, selamat, dan terima kasih. Dirangkai dengan sepenuh hati.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold rounded-full border border-rose-200 text-rose-600 px-4 py-2 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition"
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
            <ul className="mt-4 space-y-3 text-sm text-stone-600">
              <li className="flex gap-3">
                <span aria-hidden="true">📍</span>
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true">💬</span>
                <a href={`https://wa.me/${WA_NUMBER}`} className={link}>
                  +{WA_NUMBER}
                </a>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true">✉️</span>
                <a href={`mailto:${CONTACT.email}`} className={`${link} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true">🕒</span>
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-rose-100 flex flex-col items-center gap-2 text-center text-xs text-stone-500 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {BRAND} Fresh Flowers. Semua hak dilindungi.
          </p>
          <p>Dirangkai dengan 💗 untuk para pecinta bunga</p>
        </div>
      </div>
    </footer>
  )
}
