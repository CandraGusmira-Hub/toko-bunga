const pad = (n) => String(n).padStart(2, '0')

// Format YYYY-MM-DD berdasarkan jam lokal pengguna (bukan UTC)
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const isoFromToday = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return toISODate(d)
}

export const formatLongDate = (iso) =>
  new Date(`${iso}T00:00`).toLocaleDateString('id-ID', { dateStyle: 'full' })
