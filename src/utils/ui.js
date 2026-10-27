// Class Tailwind yang dipakai bersama agar tampilan form & filter konsisten selaras dengan tema.
export const field =
  'w-full rounded-2xl border border-petal/80 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/60 transition focus:border-peony focus:outline-none focus:ring-2 focus:ring-peony/20'

export const chip = (active) =>
  `rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
    active
      ? 'border-peony bg-peony text-white shadow-xs'
      : 'border-petal/80 bg-white text-ink/80 hover:border-peony/40 hover:bg-blush hover:text-ink'
  }`
