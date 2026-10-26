import { useState } from 'react'
import { BRAND } from '../config'
import { PRODUCTS } from '../data/products'
import { formatLongDate } from '../utils/date'
import { rupiah } from '../utils/format'
import { chip, field } from '../utils/ui'
import { waLink } from '../utils/whatsapp'
import DeliveryDate from './DeliveryDate'
import { ChatIcon, PlusIcon } from './Icons'
import QtyStepper from './QtyStepper'

const STYLES = ['Hand Bouquet', 'Flower Box', 'Standing Flower']
const MAX_QTY = 99
const MAX_SHOWN = 19 // jumlah tangkai yang digambar di pratinjau

function buildMessage({ style, items, total, date, card, note }) {
  const lines = [
    `Halo ${BRAND}, saya ingin memesan *Custom Bouquet*.`,
    '',
    `Bentuk: ${style}`,
    'Bunga:',
    ...items.map((p) => `- ${p.name} x${p.qty} ${p.unit}`),
    `Estimasi harga bunga: ${rupiah(total)}`,
  ]
  if (date) lines.push(`Tanggal kirim: ${formatLongDate(date)}`)
  if (card.trim()) lines.push(`Kartu ucapan: ${card.trim()}`)
  if (note.trim()) lines.push(`Catatan: ${note.trim()}`)
  return lines.join('\n')
}

// Posisi tangkai pada pratinjau (px dari pusat): 1 di tengah, lalu cincin berisi 6 dan 12
const ring = (n, r, offset = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = offset + (i / n) * 2 * Math.PI - Math.PI / 2
    return [Math.cos(a) * r, Math.sin(a) * r]
  })
const SLOTS = [[0, 0], ...ring(6, 54), ...ring(12, 104, Math.PI / 12)]

// Susun tangkai bergantian antar jenis bunga supaya warna tersebar rata
function spread(items, cap) {
  const left = items.map((p) => ({ product: p, n: p.qty }))
  const out = []
  while (out.length < cap && left.some((l) => l.n > 0)) {
    for (const l of left) {
      if (l.n > 0 && out.length < cap) {
        out.push(l.product)
        l.n -= 1
      }
    }
  }
  return out
}

function Thumb({ p, className = '', style }) {
  return (
    <div style={style} className={`grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${p.bg} ${className}`}>
      {p.images ? (
        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{p.emoji}</span>
      )}
    </div>
  )
}

// Pratinjau rangkaian: satu lingkaran = satu tangkai pilihanmu
function Preview({ items, stems }) {
  const shown = spread(items, MAX_SHOWN)
  return (
    <div
      role="img"
      aria-label={stems ? `Pratinjau rangkaian berisi ${stems} tangkai` : 'Pratinjau rangkaian masih kosong'}
      className="relative mx-auto h-[260px] w-full max-w-[280px]"
    >
      {shown.length === 0 && (
        <div className="absolute inset-4 grid place-items-center rounded-full border-2 border-dashed border-petal px-8 text-center text-sm text-muted">
          Rangkaianmu akan tersusun di sini
        </div>
      )}
      {shown.map((p, i) => {
        const [x, y] = SLOTS[i]
        return (
          <Thumb
            key={i}
            p={p}
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            className="absolute left-1/2 top-1/2 h-[52px] w-[52px] rounded-full border-2 border-white text-2xl shadow-md"
          />
        )
      })}
    </div>
  )
}

export default function CustomBouquet() {
  const [qty, setQty] = useState({})
  const [style, setStyle] = useState(STYLES[0])
  const [date, setDate] = useState('')
  const [card, setCard] = useState('')
  const [note, setNote] = useState('')

  const items = PRODUCTS.filter((p) => qty[p.id] > 0).map((p) => ({ ...p, qty: qty[p.id] }))
  const total = items.reduce((sum, p) => sum + p.price * p.qty, 0)
  const stems = items.reduce((sum, p) => sum + p.qty, 0)
  const change = (id, delta) =>
    setQty((q) => ({ ...q, [id]: Math.min(MAX_QTY, Math.max(0, (q[id] || 0) + delta)) }))

  const href = waLink(buildMessage({ style, items, total, date, card, note }))

  return (
    <section id="custombunga" className="bg-blush py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Rangkai buketmu sendiri</h2>
          <p className="mt-3 text-muted">
            Pilih bentuk dan bunganya, lihat rangkaianmu tersusun, lalu kirim detailnya langsung ke WhatsApp kami.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-9 rounded-[1.75rem] bg-white p-5 sm:p-8">
            <div>
              <h3 className="text-xl font-semibold">1. Pilih bentuk rangkaian</h3>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Bentuk rangkaian">
                {STYLES.map((s) => (
                  <button key={s} type="button" aria-pressed={style === s} onClick={() => setStyle(s)} className={chip(style === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">2. Pilih bunga &amp; jumlahnya</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {PRODUCTS.map((p) => {
                  const n = qty[p.id] || 0
                  return (
                    <li
                      key={p.id}
                      className={`flex items-center gap-3 rounded-2xl border p-2.5 transition ${
                        n > 0 ? 'border-leaf bg-leaf-mist' : 'border-petal'
                      }`}
                    >
                      <Thumb p={p} className="h-12 w-12 rounded-xl text-2xl" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-muted">
                          {rupiah(p.price)} / {p.unit}
                        </p>
                      </div>
                      {n === 0 ? (
                        <button
                          type="button"
                          aria-label={`Tambah ${p.name}`}
                          onClick={() => change(p.id, 1)}
                          className="grid h-10 w-10 place-items-center rounded-full bg-peony text-white transition hover:bg-peony-dark active:scale-95"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <QtyStepper
                          value={n}
                          label={p.name}
                          onDec={() => change(p.id, -1)}
                          onInc={() => change(p.id, 1)}
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold">3. Detail pengiriman</h3>
              <div className="mt-4 space-y-5">
                <div>
                  <p className="mb-2 text-sm font-semibold">Tanggal pengiriman</p>
                  <DeliveryDate value={date} onChange={setDate} />
                </div>
                <label className="block">
                  <span className="text-sm font-semibold">Kartu ucapan (opsional)</span>
                  <input
                    type="text"
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                    placeholder="Selamat ulang tahun!"
                    className={`${field} mt-2`}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Catatan tambahan (opsional)</span>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Warna pita, tema, alamat pengiriman, dll."
                    className={`${field} mt-2`}
                  />
                </label>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.75rem] bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold">Rangkaianmu</h3>
              <p className="text-sm text-muted">{style}</p>
            </div>

            <div className="mt-4">
              <Preview items={items} stems={stems} />
              {stems > MAX_SHOWN && (
                <p className="mt-2 text-center text-xs text-muted">Pratinjau menampilkan {MAX_SHOWN} tangkai pertama.</p>
              )}
            </div>

            {items.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-petal pt-4 text-sm">
                {items.map((p) => (
                  <li key={p.id} className="flex justify-between gap-3">
                    <span>
                      {p.name} <span className="text-muted">×{p.qty}</span>
                    </span>
                    <span className="font-medium">{rupiah(p.price * p.qty)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 border-t border-petal pt-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted">Estimasi bunga</p>
                <p className="text-2xl font-bold text-peony-dark">{rupiah(total)}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted">Harga akhir dikonfirmasi admin via WhatsApp.</p>
            </div>

            {items.length ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-peony px-6 py-3.5 font-semibold text-white shadow-lift transition hover:bg-peony-dark"
              >
                <ChatIcon className="h-5 w-5" />
                Kirim ke WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-full bg-stone-200 px-6 py-3.5 font-semibold text-stone-500"
              >
                Pilih minimal 1 bunga
              </button>
            )}
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setQty({})}
                className="mx-auto mt-3 block text-xs text-muted underline-offset-2 hover:text-peony-dark hover:underline"
              >
                Kosongkan pilihan
              </button>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
