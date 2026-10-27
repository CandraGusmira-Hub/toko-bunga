import useStoreStatus from '../hooks/useStoreStatus'
import { ChatIcon, LeafIcon, TruckIcon } from './Icons'
import HeroScene from './HeroScene'

const POINTS = [
  { icon: LeafIcon, text: 'Bunga segar harian dari kebun' },
  { icon: TruckIcon, text: 'Same-day delivery area kota' },
  { icon: ChatIcon, text: 'Pemesanan praktis via WhatsApp' },
]

export default function Hero() {
  const status = useStoreStatus()

  return (
    <section className="relative overflow-hidden bg-blush/70 pb-16 pt-8 sm:pb-24 sm:pt-14">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8">
        {/* Konten Teks Hero */}
        <div className="motion-safe:animate-rise flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge Status Toko */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-petal/80 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-ink shadow-xs">
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full ${
                status.open ? 'bg-emerald-500 animate-pulse' : 'bg-peony'
              }`}
            />
            <span>{status.label}</span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Bunga segar untuk setiap momen istimewa.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Rangkaian buket bunga segar berkualitas dan buket kustom untuk wisuda, ulang tahun, dan perayaan cinta. Pesan cepat tanpa registrasi rumit langsung via WhatsApp.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="#katalog"
              className="inline-flex items-center justify-center rounded-full bg-peony px-8 py-3.5 text-center text-base font-semibold text-white shadow-lift transition hover:bg-peony-dark active:scale-95"
            >
              Lihat Katalog Bunga
            </a>
            <a
              href="#custombunga"
              className="inline-flex items-center justify-center rounded-full border border-peony/40 bg-white/80 px-8 py-3.5 text-center text-base font-semibold text-peony transition hover:border-peony hover:bg-white active:scale-95"
            >
              Rangkai Buket Sendiri
            </a>
          </div>

          {/* 3 Nilai Unggulan */}
          <ul className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-2xl border border-petal/60 bg-white/70 p-3 text-left text-xs font-semibold text-ink shadow-xs backdrop-blur-xs sm:flex-col sm:items-start sm:p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blush text-peony border border-petal/50 shadow-xs sm:h-10 sm:w-10">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3D Scene Hero */}
        <div className="motion-safe:animate-rise w-full [animation-delay:150ms]">
          <HeroScene />
        </div>
      </div>
    </section>
  )
}
