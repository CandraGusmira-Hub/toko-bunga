import HeroScene from './HeroScene'
import { PRODUCTS } from '../data/products'

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-5 pt-8 pb-12 grid lg:grid-cols-2 items-center gap-4">
      <div>
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-500 bg-rose-100 rounded-full px-4 py-1.5">
          Fresh Flowers Setiap Hari
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mt-5">
          Bunga segar untuk setiap <span className="text-rose-500">momen</span> istimewa
        </h1>
        <p className="mt-5 text-stone-600 text-lg max-w-md">
          Dipetik pilihan dari kebun, dirangkai dengan sepenuh hati, dan dikirim dalam kondisi segar. Pesan langsung lewat WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#katalog"
            className="bg-rose-500 text-white font-semibold rounded-full px-7 py-3 hover:bg-rose-600 transition shadow-lg shadow-rose-200"
          >
            Lihat Katalog
          </a>
          <a
            href="#custombunga"
            className="border border-rose-300 text-rose-600 font-semibold rounded-full px-7 py-3 hover:bg-rose-50 transition"
          >
            Custom Bouquet
          </a>
        </div>
        <div className="mt-10 flex gap-8">
          <Stat value={`${PRODUCTS.length}+`} label="Jenis bunga" />
          <Stat value="100%" label="Bunga segar" />
          <Stat value="Same Day" label="Pengiriman kota" />
        </div>
      </div>

      <HeroScene />
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-2xl sm:text-3xl font-extrabold">{value}</p>
      <p className="text-sm text-stone-500">{label}</p>
    </div>
  )
}
