import { useState } from 'react'
import { BRAND } from '../config'
import { PRODUCTS } from '../data/products'
import { formatLongDate } from '../utils/date'
import { rupiah } from '../utils/format'
import { chip, field } from '../utils/ui'
import { waLink } from '../utils/whatsapp'
import DeliveryDate from './DeliveryDate'
import FlowerCanvas, { MAX_STEMS } from './FlowerCanvas'
import { ChatIcon, PlusIcon } from './Icons'
import QtyStepper from './QtyStepper'

const STYLES = ['Hand Bouquet', 'Flower Box', 'Standing Flower']
const MAX_QTY = 99
const MAX_SHOWN = MAX_STEMS // jumlah tangkai yang digambar di pratinjau

function buildMessage({ style, items, total, date, card, note }) {
  const lines = [
    `Halo ${BRAND}, saya ingin memesan *Custom Bouquet*.`,
    '',
    `Bentuk Rangkaian: ${style}`,
    'Komposisi Bunga:',
    ...items.map((p) => `- ${p.name} x${p.qty} ${p.unit} (${rupiah(p.price * p.qty)})`),
    '',
    `Estimasi total: ${rupiah(total)}`,
  ]
  if (date) lines.push(`Tanggal kirim: ${formatLongDate(date)}`)
  if (card.trim()) lines.push(`Kartu ucapan: ${card.trim()}`)
  if (note.trim()) lines.push(`Catatan: ${note.trim()}`)
  return lines.join('\n')
}

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

// Frame buket (SVG)
const FRAME_SVG = 'pointer-events-none absolute inset-0 h-full w-full'

function FrameBack({ shape }) {
  if (shape === 'Flower Box')
    return (
      <svg viewBox="0 0 300 320" className={FRAME_SVG} aria-hidden="true">
        <rect x="40" y="150" width="220" height="142" rx="16" className="fill-petal" />
      </svg>
    )
  if (shape === 'Standing Flower')
    return (
      <svg viewBox="0 0 300 320" className={FRAME_SVG} aria-hidden="true">
        <g className="stroke-leaf" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M150 238 V294" />
          <path d="M150 294 L98 314 M150 294 L202 314 M150 294 V316" />
        </g>
        <circle cx="150" cy="120" r="118" className="fill-white stroke-leaf" strokeWidth="6" />
      </svg>
    )
  // Hand Bouquet: kertas pembungkus
  return (
    <svg viewBox="0 0 300 320" className={FRAME_SVG} aria-hidden="true">
      <path d="M50 112 Q150 72 250 112 L177 298 Q150 310 123 298 Z" className="fill-[#5C3D2E]" />
      <path d="M150 128 L137 296" className="stroke-white" strokeWidth="2" opacity=".6" />
    </svg>
  )
}

function Bow({ x, y }) {
  return (
    <g>
      <path d={`M${x} ${y + 34} L${x - 18} ${y + 74} M${x} ${y + 34} L${x + 18} ${y + 74}`} className="stroke-peony" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d={`M${x} ${y + 30} C${x - 34} ${y + 2} ${x - 42} ${y + 46} ${x} ${y + 30} C${x + 42} ${y + 46} ${x + 34} ${y + 2} ${x} ${y + 30}Z`} className="fill-peony" />
      <circle cx={x} cy={y + 30} r="7" className="fill-peony-dark" />
    </g>
  )
}

function FrameFront({ shape }) {
  if (shape === 'Flower Box')
    return (
      <svg viewBox="0 0 300 320" className={FRAME_SVG} aria-hidden="true">
        <path d="M40 200 H260 V276 a16 16 0 0 1 -16 16 H56 a16 16 0 0 1 -16 -16 Z" className="fill-white stroke-petal" strokeWidth="2" />
        <rect x="138" y="200" width="24" height="92" className="fill-peony" />
        <rect x="34" y="190" width="232" height="14" rx="7" className="fill-white stroke-petal" strokeWidth="2" />
        <Bow x={150} y={170} />
      </svg>
    )
  if (shape === 'Standing Flower')
    return (
      <svg viewBox="0 0 300 320" className={FRAME_SVG} aria-hidden="true">
        <path d="M57 190 Q150 236 243 190 L249 210 Q150 258 51 210 Z" className="fill-peony" />
      </svg>
    )
  return (
    <svg viewBox="0 0 300 320" className={FRAME_SVG} aria-hidden="true">
      <path d="M76 176 Q150 214 224 176 L176 296 Q150 305 124 296 Z" className="fill-white stroke-petal" strokeWidth="2" />
      <Bow x={150} y={206} />
    </svg>
  )
}

function Preview({ items, stems, shape }) {
  const shown = spread(items, MAX_SHOWN)
  return (
    <div
      role="img"
      aria-label={stems ? `Pratinjau ${shape} berisi ${stems} tangkai` : `Pratinjau ${shape} masih kosong`}
      className="relative mx-auto h-[300px] sm:h-[320px] w-[280px] sm:w-[300px] max-w-full"
    >
      <FrameBack shape={shape} />
      <FlowerCanvas names={shown.map((p) => p.name)} />
      <FrameFront shape={shape} />

      {shown.length === 0 && (
        <div className="absolute left-1/2 top-[120px] grid h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 px-4 text-center text-xs font-medium text-muted shadow-xs">
          Pilih jenis bunga di bawah, nanti otomatis masuk ke rangkaian
        </div>
      )}
    </div>
  )
}

export default function CustomBouquet() {
  const [qty, setQty] = useState({})
  const [style, setStyle] = useState(STYLES[0])
  const [date, setDate] = useState('')
  const [card, setCard] = useState('')
  const [note, setNote] = useState('')

  const stemProducts = PRODUCTS.filter((p) => p.type === 'tangkai' || p.unit === 'tangkai' || p.unit === 'ikat')
  const items = stemProducts.filter((p) => qty[p.id] > 0).map((p) => ({ ...p, qty: qty[p.id] }))
  const total = items.reduce((sum, p) => sum + p.price * p.qty, 0)
  const stems = items.reduce((sum, p) => sum + p.qty, 0)

  const change = (id, delta) =>
    setQty((q) => ({ ...q, [id]: Math.min(MAX_QTY, Math.max(0, (q[id] || 0) + delta)) }))

  const href = waLink(buildMessage({ style, items, total, date, card, note }))

  return (
    <section id="custombunga" className="bg-blush/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-peony-dark shadow-xs border border-petal">
            <span>🎨</span> Rangkai Sendiri
          </span>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            Custom Bouquet Builder
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Pilih bentuk wadah dan kombinasi bunga favoritmu. Lihat simulasi visualnya secara langsung lalu kirim detailnya via WhatsApp.
          </p>
        </div>

        {/* Layout: Form Langkah di Kiri, Pratinjau Visual di Kanan */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
          {/* Kolom Form Rangkaian */}
          <div className="space-y-8 rounded-[2rem] border border-petal/70 bg-white p-5 shadow-xs sm:p-8">
            {/* Langkah 1: Bentuk Rangkaian */}
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-peony text-xs font-bold text-white">
                  1
                </span>
                <h3 className="text-lg font-bold text-ink sm:text-xl">Pilih Bentuk Rangkaian</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5" role="group" aria-label="Bentuk rangkaian">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={style === s}
                    onClick={() => setStyle(s)}
                    className={chip(style === s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Langkah 2: Bunga & Jumlah */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-peony text-xs font-bold text-white">
                    2
                  </span>
                  <h3 className="text-lg font-bold text-ink sm:text-xl">Pilih Bunga &amp; Tangkai</h3>
                </div>
                {stems > 0 && (
                  <span className="text-xs font-semibold text-peony bg-blush px-3 py-1 rounded-full border border-petal">
                    {stems} tangkai terpilih
                  </span>
                )}
              </div>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {stemProducts.map((p) => {
                  const n = qty[p.id] || 0
                  const isSelected = n > 0
                  return (
                    <li
                      key={p.id}
                      className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                        isSelected
                          ? 'border-peony bg-blush/60 shadow-xs'
                          : 'border-petal/70 bg-paper/50 hover:border-peony/30'
                      }`}
                    >
                      <Thumb p={p} className="h-12 w-12 rounded-xl text-2xl shadow-xs" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{p.name}</p>
                        <p className="text-xs text-muted">
                          {rupiah(p.price)} <span className="opacity-75">/{p.unit}</span>
                        </p>
                      </div>
                      {n === 0 ? (
                        <button
                          type="button"
                          aria-label={`Tambah ${p.name}`}
                          onClick={() => change(p.id, 1)}
                          className="grid h-9 w-9 place-items-center rounded-full bg-peony text-white shadow-xs transition hover:bg-peony-dark active:scale-95"
                        >
                          <PlusIcon className="h-4 w-4" />
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

            {/* Langkah 3: Detail Tambahan */}
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-peony text-xs font-bold text-white">
                  3
                </span>
                <h3 className="text-lg font-bold text-ink sm:text-xl">Detail Pemesanan</h3>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">Tanggal Pengiriman / Acara</p>
                  <DeliveryDate value={date} onChange={setDate} />
                </div>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Kartu Ucapan (Gratis)</span>
                  <input
                    type="text"
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                    placeholder="Contoh: Happy Birthday, wishing you all the best!"
                    className={`${field} mt-2 text-sm`}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Catatan Khusus (Opsional)</span>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Warna pita favorit, instruksi kurir, atau detail khusus..."
                    className={`${field} mt-2 text-sm`}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Kolom Pratinjau Sticky */}
          <aside className="rounded-[2rem] border border-petal/70 bg-white p-5 shadow-xs sm:p-7 lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between gap-3 border-b border-petal/60 pb-3">
              <h3 className="text-lg font-bold text-ink sm:text-xl">Pratinjau Visual</h3>
              <span className="rounded-full bg-blush px-3 py-0.5 text-xs font-semibold text-peony-dark">
                {style}
              </span>
            </div>

            <div className="mt-4">
              <Preview items={items} stems={stems} shape={style} />
              {stems > MAX_SHOWN && (
                <p className="mt-2 text-center text-xs text-muted">
                  Pratinjau visual menampilkan {MAX_SHOWN} tangkai teratas.
                </p>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-5 border-t border-petal/60 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Daftar Rangkaian:
                </p>
                <ul className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-ink/80 pr-1">
                  {items.map((p) => (
                    <li key={p.id} className="flex justify-between gap-2 py-0.5">
                      <span className="truncate">
                        {p.name} <span className="text-muted">×{p.qty}</span>
                      </span>
                      <span className="font-semibold text-peony-dark shrink-0">
                        {rupiah(p.price * p.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 border-t border-petal/60 pt-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted">Estimasi Harga</p>
                <p className="text-2xl font-bold text-peony-dark">{rupiah(total)}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                Harga akhir &amp; ongkir dikonfirmasi admin via WhatsApp.
              </p>
            </div>

            {items.length > 0 ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-peony px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lift transition hover:bg-peony-dark active:scale-95"
              >
                <ChatIcon className="h-4 w-4" />
                <span>Kirim Rangkaian ke WhatsApp</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-full bg-petal/40 px-6 py-3.5 text-center text-sm font-semibold text-muted/70"
              >
                Pilih minimal 1 jenis bunga
              </button>
            )}

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setQty({})}
                className="mx-auto mt-3 block text-xs text-muted underline-offset-2 hover:text-peony hover:underline"
              >
                Kosongkan pilihan rangkaian
              </button>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
