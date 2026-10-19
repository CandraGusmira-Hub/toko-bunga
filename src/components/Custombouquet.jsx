import { useState } from 'react'
import { BRAND, WA_NUMBER } from '../config'
import { PRODUCTS } from '../data/products'
import { rupiah } from '../utils/format'

const STYLES = ['Hand Bouquet', 'Flower Box', 'Standing Flower']
const MAX_QTY = 99

function buildMessage({ style, items, total, date, card, note }) {
  const lines = [
    `Halo ${BRAND}, saya ingin memesan *Custom Bouquet*.`,
    '',
    `Bentuk: ${style}`,
    'Bunga:',
    ...items.map((p) => `- ${p.name} x${p.qty} ${p.unit}`),
    `Estimasi harga bunga: ${rupiah(total)}`,
  ]
  if (date) {
    const d = new Date(`${date}T00:00`).toLocaleDateString('id-ID', { dateStyle: 'full' })
    lines.push(`Tanggal kirim: ${d}`)
  }
  if (card.trim()) lines.push(`Kartu ucapan: ${card.trim()}`)
  if (note.trim()) lines.push(`Catatan: ${note.trim()}`)
  return lines.join('\n')
}

export default function CustomBouquet() {
  const [qty, setQty] = useState({})
  const [style, setStyle] = useState(STYLES[0])
  const [date, setDate] = useState('')
  const [card, setCard] = useState('')
  const [note, setNote] = useState('')

  const items = PRODUCTS.filter((p) => qty[p.id] > 0).map((p) => ({ ...p, qty: qty[p.id] }))
  const total = items.reduce((sum, p) => sum + p.price * p.qty, 0)
  const change = (id, delta) =>
    setQty((q) => ({ ...q, [id]: Math.min(MAX_QTY, Math.max(0, (q[id] || 0) + delta)) }))

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    buildMessage({ style, items, total, date, card, note }),
  )}`

  const field =
    'w-full rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300'

  return (
    <section id="custombunga" className="max-w-3xl mx-auto px-5 py-16">
      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-center">Custom Bouquet</h2>
      <p className="text-center text-stone-600 mt-2">
        Rangkai buketmu sendiri. Detailnya langsung terkirim ke WhatsApp kami.
      </p>

      <div className="bg-white rounded-3xl border border-rose-100 p-4 sm:p-7 mt-8 flex flex-col gap-6">
        <div>
          <h3 className="font-semibold mb-3">1. Pilih bentuk rangkaian</h3>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`text-sm font-medium rounded-full px-4 py-2 border transition ${
                  style === s
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-rose-200 text-stone-600 hover:bg-rose-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">2. Pilih bunga &amp; jumlahnya</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-rose-100 p-2.5">
                <div
                  className={`h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br ${p.bg} flex items-center justify-center text-2xl`}
                >
                  {p.images ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-stone-500">
                    {rupiah(p.price)} / {p.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Kurangi ${p.name}`}
                    onClick={() => change(p.id, -1)}
                    className="h-7 w-7 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{qty[p.id] || 0}</span>
                  <button
                    type="button"
                    aria-label={`Tambah ${p.name}`}
                    onClick={() => change(p.id, 1)}
                    className="h-7 w-7 rounded-full bg-rose-500 text-white hover:bg-rose-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="font-semibold text-sm">Tanggal pengiriman</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-2`} />
          </label>
          <label className="block">
            <span className="font-semibold text-sm">Kartu ucapan (opsional)</span>
            <input
              type="text"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="Selamat ulang tahun!"
              className={`${field} mt-2`}
            />
          </label>
        </div>

        <label className="block">
          <span className="font-semibold text-sm">Catatan tambahan (opsional)</span>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Warna pita, tema, alamat pengiriman, dll."
            className={`${field} mt-2`}
          />
        </label>

        <div className="border-t border-rose-100 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-stone-600">
            Estimasi bunga: <span className="text-rose-600 font-bold text-lg">{rupiah(total)}</span>
            <span className="block text-xs text-stone-500">Harga akhir dikonfirmasi admin via WhatsApp.</span>
          </p>
          {items.length ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm font-semibold rounded-full px-7 py-3 bg-rose-500 text-white hover:bg-rose-600 transition"
            >
              Kirim ke WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="text-sm font-semibold rounded-full px-7 py-3 bg-stone-200 text-stone-500 cursor-not-allowed"
            >
              Pilih minimal 1 bunga
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
