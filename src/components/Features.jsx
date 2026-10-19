import { BRAND } from '../config'

const FEATURES = [
  { emoji: '🌿', title: 'Selalu Segar', desc: 'Bunga datang setiap pagi dari kebun mitra dan dirawat dengan standar rantai dingin.' },
  { emoji: '💬', title: 'Pesan Mudah', desc: 'Pilih bunga, klik tombol pesan, dan langsung terhubung ke WhatsApp kami.' },
  { emoji: '🚚', title: 'Pengiriman Cepat', desc: 'Dikemas rapi dan dikirim di hari yang sama untuk area kota.' },
]

export default function Features() {
  return (
    <section id="keunggulan" className="max-w-6xl mx-auto px-5 py-16">
      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-center">Kenapa {BRAND}?</h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-10">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-7 border border-rose-100 text-center">
            <div className="text-3xl sm:text-4xl">{f.emoji}</div>
            <h3 className="font-display text-xs sm:text-lg font-bold mt-2 sm:mt-3">{f.title}</h3>
            <p className="text-stone-600 text-[10px] leading-snug sm:text-sm sm:leading-normal mt-1 sm:mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
