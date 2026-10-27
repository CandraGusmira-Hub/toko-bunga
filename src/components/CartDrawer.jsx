import { useState } from 'react'
import { BRAND, CONTACT } from '../config'
import { useCart } from '../context/cart-context'
import useDialog from '../hooks/useDialog'
import { formatLongDate } from '../utils/date'
import { rupiah } from '../utils/format'
import { chip, field } from '../utils/ui'
import { waLink } from '../utils/whatsapp'
import DeliveryDate from './DeliveryDate'
import { BagIcon, ChatIcon, CloseIcon, TrashIcon } from './Icons'
import QtyStepper from './QtyStepper'

function buildMessage({ lines, total, name, method, address, date, card }) {
  const out = [
    `Halo ${BRAND}, saya ingin memesan:`,
    '',
    ...lines.map(
      (l) => `- ${l.product.name} x${l.qty} ${l.product.unit} (${rupiah(l.product.price * l.qty)})`,
    ),
    '',
    `Estimasi harga bunga: ${rupiah(total)}`,
    '',
    `Nama: ${name.trim()}`,
    `Tanggal: ${formatLongDate(date)}`,
    method === 'antar' ? `Diantar ke: ${address.trim()}` : `Diambil di toko (${CONTACT.address})`,
  ]
  if (card.trim()) out.push(`Kartu ucapan: ${card.trim()}`)
  return out.join('\n')
}

function Panel() {
  const { lines, count, total, change, remove, clear, closeCart } = useCart()
  const ref = useDialog(closeCart)

  const [name, setName] = useState('')
  const [method, setMethod] = useState('antar')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState('')
  const [card, setCard] = useState('')

  const missing = []
  if (!name.trim()) missing.push('nama')
  if (!date) missing.push('tanggal')
  if (method === 'antar' && !address.trim()) missing.push('alamat')
  const ready = lines.length > 0 && missing.length === 0

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={closeCart} className="absolute inset-0 bg-ink/50 backdrop-blur-sm motion-safe:animate-fade" />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keranjang-judul"
        className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-paper shadow-2xl motion-safe:animate-slide"
      >
        <div className="flex items-center justify-between border-b border-petal px-5 py-4">
          <h2 id="keranjang-judul" className="text-2xl font-semibold">
            Keranjang{count > 0 && <span className="ml-2 text-base font-normal text-muted">({count} item)</span>}
          </h2>
          <button
            type="button"
            data-autofocus
            aria-label="Tutup keranjang"
            onClick={closeCart}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-blush"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-blush text-peony">
              <BagIcon className="h-8 w-8" />
            </span>
            <div>
              <p className="text-lg font-semibold">Keranjangmu masih kosong</p>
              <p className="mt-1 text-sm text-muted">Pilih bunga dari katalog atau rangkai buket sendiri.</p>
            </div>
            <a
              href="#katalog"
              onClick={closeCart}
              className="rounded-full bg-peony px-6 py-3 text-sm font-semibold text-white transition hover:bg-peony-dark"
            >
              Lihat katalog
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="divide-y divide-petal">
                {lines.map(({ product: p, qty }) => (
                  <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <div className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${p.bg} grid place-items-center text-3xl`}>
                      {p.images ? (
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span aria-hidden="true">{p.emoji}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="text-xs text-muted">
                        {rupiah(p.price)} / {p.unit}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <QtyStepper
                          value={qty}
                          label={p.name}
                          onDec={() => change(p.id, -1)}
                          onInc={() => change(p.id, 1)}
                        />
                        <button
                          type="button"
                          aria-label={`Hapus ${p.name}`}
                          onClick={() => remove(p.id)}
                          className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-blush hover:text-peony-dark"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="self-start text-sm font-semibold">{rupiah(p.price * qty)}</p>
                  </li>
                ))}
              </ul>

              <button type="button" onClick={clear} className="mt-2 text-xs text-muted underline-offset-2 hover:text-peony-dark hover:underline">
                Kosongkan keranjang
              </button>

              <div className="mt-6 space-y-5 border-t border-petal pt-6">
                <h3 className="text-lg font-semibold">Detail pesanan</h3>

                <label className="block">
                  <span className="text-sm font-semibold">Nama penerima pesanan</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Nama Anda"
                    className={`${field} mt-2`}
                  />
                </label>

                <div>
                  <p className="text-sm font-semibold">Cara menerima bunga</p>
                  <div className="mt-2 flex gap-2" role="group" aria-label="Cara menerima bunga">
                    <button type="button" aria-pressed={method === 'antar'} onClick={() => setMethod('antar')} className={chip(method === 'antar')}>
                      Diantar
                    </button>
                    <button type="button" aria-pressed={method === 'ambil'} onClick={() => setMethod('ambil')} className={chip(method === 'ambil')}>
                      Ambil di toko
                    </button>
                  </div>
                  {method === 'antar' ? (
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="street-address"
                      aria-label="Alamat pengiriman"
                      placeholder="Alamat lengkap, patokan, nama penerima bunga"
                      className={`${field} mt-3`}
                    />
                  ) : (
                    <p className="mt-3 text-sm text-muted">Ambil di {CONTACT.address}.</p>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">Tanggal {method === 'antar' ? 'pengiriman' : 'pengambilan'}</p>
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
              </div>
            </div>

            <div className="border-t border-petal bg-white px-5 py-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted">Estimasi harga bunga</p>
                <p className="text-xl font-bold text-peony-dark">{rupiah(total)}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted">Harga akhir dan ongkir dikonfirmasi admin via WhatsApp.</p>

              {ready ? (
                <a
                  href={waLink(buildMessage({ lines, total, name, method, address, date, card }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-peony px-6 py-3.5 font-semibold text-white shadow-lift transition hover:bg-peony-dark"
                >
                  <ChatIcon className="h-5 w-5" />
                  Kirim pesanan ke WhatsApp
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    disabled
                    className="mt-3 w-full cursor-not-allowed rounded-full bg-petal/40 px-6 py-3.5 font-semibold text-muted/70"
                  >
                    Kirim pesanan ke WhatsApp
                  </button>
                  <p className="mt-2 text-center text-xs text-muted">Lengkapi {missing.join(', ')} dulu.</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { isOpen } = useCart()
  return isOpen ? <Panel /> : null
}
