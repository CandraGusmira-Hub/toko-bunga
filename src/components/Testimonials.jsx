import { TESTIMONIALS } from '../data/testimonials'

// Tampil hanya jika data/testimonials.js berisi ulasan asli pelanggan
export default function Testimonials() {
  if (!TESTIMONIALS.length) return null

  return (
    <section id="ulasan" className="bg-blush py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">Kata pelanggan</h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} className="flex flex-col rounded-[1.5rem] bg-white p-6">
              <p className="flex-1 leading-relaxed">“{t.text}”</p>
              <p className="mt-5 text-sm font-semibold">{t.name}</p>
              {t.note && <p className="text-sm text-muted">{t.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
