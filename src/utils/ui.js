// Class Tailwind yang dipakai bersama agar tampilan form & filter konsisten.
export const field =
  'w-full rounded-xl border border-petal bg-white px-4 py-3 text-base text-ink placeholder:text-muted/60 focus:border-leaf focus:outline-none focus:ring-2 focus:ring-leaf/25'

export const chip = (active) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition ${
    active ? 'border-leaf bg-leaf text-white' : 'border-petal bg-white text-ink hover:border-leaf/50'
  }`
