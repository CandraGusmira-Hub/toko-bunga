import { BRAND } from '../config'
import { waLink } from '../utils/whatsapp'
import { ChatIcon, ChevronDownIcon } from './Icons'

const FAQS = [
  {
    q: 'Bagaimana cara memesan bunga?',
    a: 'Pilih buket bunga siap jadi dari katalog atau rangkai sendiri di Custom Bouquet Builder. Masukkan detail pengiriman, lalu klik "Kirim Pesanan ke WhatsApp". Pesanan yang sudah tersusun rapi akan langsung diterima oleh admin kami.',
  },
  {
    q: 'Apakah bisa pengiriman di hari yang sama (Same-Day)?',
    a: 'Bisa! Untuk area dalam kota, kami melayani same-day delivery untuk pesanan sebelum pukul 17.00 WIB. Silakan konfirmasi ketersediaan slot melalui WhatsApp.',
  },
  {
    q: 'Bagaimana sistem pembayaran dan ongkos kirim?',
    a: 'Setelah pesan WhatsApp masuk, admin akan mengonfirmasi total biaya termasuk ongkir sesuai jarak tujuan. Pembayaran dapat dilakukan via transfer bank atau QRIS.',
  },
  {
    q: 'Apakah bisa request kartu ucapan dan warna pita?',
    a: 'Bisa dan gratis! Anda dapat mengisi pesan pada kolom kartu ucapan di formulir pemesanan, serta menuliskan preferensi warna pita pada catatan.',
  },
  {
    q: 'Bagaimana tips merawat bunga agar tetap segar tahan lama?',
    a: 'Potong miring ujung tangkai sekitar 1-2 cm setiap hari, ganti air vas dengan air bersih dingin, dan letakkan di tempat yang sejuk tanpa paparan sinar matahari langsung.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Sisi Kiri: Judul & CTA Chat */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3.5 py-1 text-xs font-semibold text-peony-dark border border-petal">
              <span>💬</span> Bantuan &amp; Panduan
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              Pertanyaan yang Sering Muncul
            </h2>
            <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-muted">
              Punya pertanyaan khusus seputar custom buket atau pengiriman mendadak? Hubungi kami langsung melalui WhatsApp untuk respon cepat.
            </p>
            <div className="mt-6">
              <a
                href={waLink(`Halo ${BRAND}, saya ingin bertanya seputar pemesanan bunga.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-peony/40 bg-blush px-6 py-3.5 text-sm font-semibold text-peony-dark transition hover:border-peony hover:bg-peony hover:text-white shadow-xs"
              >
                <ChatIcon className="h-4 w-4" />
                <span>Konsultasi dengan Admin</span>
              </a>
            </div>
          </div>

          {/* Sisi Kanan: Akordeon FAQ */}
          <div className="space-y-3.5">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-petal/70 bg-white p-5 transition-all hover:border-peony/40 shadow-xs open:bg-blush/20 open:border-peony/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base sm:text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-peony transition-transform duration-300 group-open:rotate-180">
                    <ChevronDownIcon className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 pt-2 border-t border-petal/50 text-sm leading-relaxed text-muted sm:text-base">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
