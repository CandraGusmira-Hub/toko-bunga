import { BRAND } from '../config'
import { waLink } from '../utils/whatsapp'
import { ChatIcon, ChevronDownIcon } from './Icons'

// Ubah jawaban di sini agar sesuai kebijakan toko (area antar, metode bayar, dll.)
const FAQS = [
  {
    q: 'Bagaimana cara memesan?',
    a: 'Tambahkan bunga ke keranjang atau rangkai buket custom, isi detail pengiriman, lalu kirim ke WhatsApp. Admin akan mengonfirmasi harga akhir sebelum pesanan diproses.',
  },
  {
    q: 'Apakah bisa dikirim di hari yang sama?',
    a: 'Bisa untuk area kota. Pilih "Hari ini" pada tanggal pengiriman, lalu konfirmasikan ketersediaannya ke admin lewat WhatsApp. Untuk area di luar kota, tanyakan langsung ke admin.',
  },
  {
    q: 'Bagaimana cara pembayarannya?',
    a: 'Metode pembayaran dan ongkos kirim dikonfirmasi admin lewat WhatsApp setelah pesananmu masuk.',
  },
  {
    q: 'Bisakah menambahkan kartu ucapan?',
    a: 'Bisa. Tulis pesanmu di kolom kartu ucapan pada keranjang atau form custom bouquet, dan pesan itu ikut terkirim ke admin.',
  },
  {
    q: 'Bagaimana merawat bunga agar tahan lama?',
    a: 'Potong sekitar 2 cm ujung tangkai secara miring, taruh di air bersih, dan ganti air setiap hari. Jauhkan dari sinar matahari langsung dan buah segar.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Pertanyaan yang sering muncul</h2>
          <p className="mt-4 max-w-sm text-muted">Belum ketemu jawabannya? Tanya langsung, kami balas lewat WhatsApp.</p>
          <a
            href={waLink(`Halo ${BRAND}, saya ingin bertanya.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-leaf/30 px-6 py-3 text-sm font-semibold text-leaf transition hover:border-leaf hover:bg-leaf-mist"
          >
            <ChatIcon className="h-4 w-4" />
            Tanya admin
          </a>
        </div>

        <div className="divide-y divide-petal border-y border-petal">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDownIcon className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" />
              </summary>
              <p className="pb-4 pr-8 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
