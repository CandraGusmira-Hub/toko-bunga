import { MinusIcon, PlusIcon } from './Icons'

// Pengatur jumlah (− 2 +) yang dipakai di kartu produk, detail produk, keranjang, dan custom bouquet
export default function QtyStepper({ value, onDec, onInc, label, className = '' }) {
  return (
    <div className={`inline-flex items-center rounded-full border border-petal bg-white p-0.5 ${className}`}>
      <button
        type="button"
        aria-label={`Kurangi ${label}`}
        onClick={onDec}
        className="grid h-9 w-9 place-items-center rounded-full text-peony-dark transition hover:bg-blush active:scale-95"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Tambah ${label}`}
        onClick={onInc}
        className="grid h-9 w-9 place-items-center rounded-full bg-peony text-white transition hover:bg-peony-dark active:scale-95"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
