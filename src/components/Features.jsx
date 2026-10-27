import { BRAND } from '../config'
import { ChatIcon, LeafIcon, TruckIcon } from './Icons'

const FEATURES = [
  {
    icon: LeafIcon,
    title: 'Selalu Segar',
    desc: 'Bunga segar dipetik setiap pagi dari kebun mitra pilihan dan dirawat dengan standar rantai dingin optimal.',
  },
  {
    icon: ChatIcon,
    title: 'Pesan Mudah',
    desc: 'Pilih buket bunga atau rangkai sendiri, klik tombol pesan, dan rincian otomatis terhubung ke WhatsApp kami.',
  },
  {
    icon: TruckIcon,
    title: 'Pengiriman Cepat',
    desc: 'Dikemas rapi dalam kemasan tahan guncangan dan diantar di hari yang sama (same-day) untuk area kota.',
  },
]

const STEPS = [
  {
    title: 'Pilih Bunga atau Buket',
    desc: 'Temukan buket favorit dari katalog atau gunakan custom bouquet builder untuk merangkai sendiri.',
  },
  {
    title: 'Kirim Rincian Pesanan',
    desc: 'Isi nama, tanggal pengiriman, dan alamat, lalu kirim ringkasan pesanan langsung ke WhatsApp admin.',
  },
  {
    title: 'Admin Mengonfirmasi',
    desc: 'Admin memeriksa ketersediaan, mengonfirmasi ongkos kirim, dan memproses pesananmu dengan cepat.',
  },
  {
    title: 'Bunga Sampai di Tujuan',
    desc: 'Bunga dirangkai segar dengan kartu ucapan personal, lalu diantar tepat waktu sesuai jadwalmu.',
  },
]

export default function Features() {
  return (
    <section id="keunggulan" className="bg-blush/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Seksi */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-peony-dark shadow-xs border border-petal">
            <span>✨</span> Dedikasi Kualitas
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            Kenapa Memilih {BRAND}?
          </h2>
          <p className="mt-3 text-muted text-sm sm:text-base">
            Kami menghadirkan pengalaman memesan bunga yang hangat, mudah, dan terpercaya untuk setiap momen berharga.
          </p>
        </div>

        {/* Grid Dua Kolom Responsif */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Kolom 1: Keunggulan */}
          <div className="flex flex-col justify-between rounded-[2rem] border border-petal/70 bg-white p-6 sm:p-10 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2.5 w-2.5 rounded-full bg-peony" />
                <h3 className="text-xl font-bold text-ink sm:text-2xl">Keunggulan Layanan</h3>
              </div>
              <ul className="divide-y divide-petal/60">
                {FEATURES.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blush text-peony border border-petal/60 shadow-xs">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-bold text-ink">{title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl bg-blush p-4 border border-petal text-xs text-ink/80 flex items-center gap-3">
              <span className="text-lg">🌸</span>
              <span>Seluruh bunga dipotong miring dan diberi nutrisi pengawet segar sebelum pengiriman.</span>
            </div>
          </div>

          {/* Kolom 2: 4 Langkah Cara Pesan */}
          <div className="flex flex-col justify-between rounded-[2rem] border border-petal/70 bg-white p-6 sm:p-10 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2.5 w-2.5 rounded-full bg-peony" />
                <h3 className="text-xl font-bold text-ink sm:text-2xl">Cara Pesan via WhatsApp</h3>
              </div>
              <ol className="space-y-6">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-peony font-display text-base font-bold text-white shadow-lift"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-ink sm:text-lg">{s.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 rounded-2xl bg-blush p-4 border border-petal text-xs text-ink/80 flex items-center justify-between gap-3">
              <span className="font-semibold text-peony-dark">Butuh konsultasi cepat?</span>
              <a
                href="#kontak"
                className="font-bold text-peony hover:underline"
              >
                Hubungi Admin →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
