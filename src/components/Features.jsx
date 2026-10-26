import { BRAND } from '../config'
import { ChatIcon, LeafIcon, TruckIcon } from './Icons'

const FEATURES = [
  { icon: LeafIcon, title: 'Selalu Segar', desc: 'Bunga datang setiap pagi dari kebun mitra dan dirawat dengan standar rantai dingin.' },
  { icon: ChatIcon, title: 'Pesan Mudah', desc: 'Pilih bunga, klik tombol pesan, dan langsung terhubung ke WhatsApp kami.' },
  { icon: TruckIcon, title: 'Pengiriman Cepat', desc: 'Dikemas rapi dan dikirim di hari yang sama untuk area kota.' },
]

// Urutan ini memang berurutan, jadi penomoran di sini sesuai isinya
const STEPS = [
  { title: 'Pilih bunga', desc: 'Tambahkan bunga dari katalog ke keranjang, atau rangkai buket sendiri.' },
  { title: 'Kirim pesanan', desc: 'Isi nama, tanggal, dan alamat, lalu kirim ringkasan pesanan ke WhatsApp kami.' },
  { title: 'Admin mengonfirmasi', desc: 'Admin memastikan harga akhir dan detail pengiriman bersamamu.' },
  { title: 'Bunga sampai', desc: 'Bunga dirangkai segar, lalu diantar atau diambil sesuai jadwalmu.' },
]

export default function Features() {
  return (
    <section id="keunggulan" className="on-dark bg-paper text-black">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:py-24 lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Kenapa {BRAND}?</h2>
          <ul className="mt-10 divide-y divide-white/15">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4 py-6 first:pt-0">
                <span className="grid h-12 w-12 shrink-0 place-items-center  rounded-full bg-peony text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Cara pesan</h2>
          <ol className="mt-10 space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-peony font-display text-lg font-semibold text-white"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
