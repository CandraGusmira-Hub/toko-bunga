import useStoreStatus from '../hooks/useStoreStatus'
import { ChatIcon, LeafIcon, TruckIcon } from './Icons'
import HeroScene from './HeroScene'

const POINTS = [
  { icon: LeafIcon, text: 'Bunga segar, dipilih dari kebun' },
  { icon: TruckIcon, text: 'Antar di hari yang sama untuk area kota' },
  { icon: ChatIcon, text: 'Pesan mudah lewat WhatsApp' },
]

export default function Hero() {
  const status = useStoreStatus()

  return (
    <section className="relative overflow-hidden bg-blush">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24">
        <div className="motion-safe:animate-rise">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-red-500'}`}
            />
            {status.label}
          </p>

          <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Bunga segar untuk setiap momen istimewa
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Dipetik pilihan dari kebun, dirangkai dengan sepenuh hati, dan dikirim dalam kondisi segar. Pesan langsung lewat WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#katalog"
              className="rounded-full bg-peony px-7 py-3.5 font-semibold text-white shadow-lift transition hover:bg-peony-dark"
            >
              Lihat katalog
            </a>
            <a
              href="#custombunga"
              className="rounded-full border border-leaf/30 bg-white/60 px-7 py-3.5 font-semibold text-leaf transition hover:border-leaf hover:bg-white"
            >
              Rangkai buket sendiri
            </a>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm leading-snug sm:flex-col sm:items-start ">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-leaf/30 rounded-full  bg-white text-leaf shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="motion-safe:animate-rise [animation-delay:150ms]">
          <HeroScene />
        </div>
      </div>
    </section>
  )
}
