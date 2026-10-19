// Data produk. Ubah/tambah item di sini untuk memperbarui katalog.
// category: 'romantis' | 'ceria' | 'elegan'
// images: daftar gambar yang bisa digeser di card. Tanpa images, card memakai emoji.
export const CATEGORIES = [
  { key: 'semua', label: 'Semua' },
  { key: 'romantis', label: 'Romantis' },
  { key: 'ceria', label: 'Ceria' },
  { key: 'elegan', label: 'Elegan' },
]

export const PRODUCTS = [
  { id: 1, name: 'Mawar Merah', images: ['/produk/mawar.webp', '/produk/mawar1.webp'], price: 8000, unit: 'tangkai', category: 'romantis', bg: 'from-rose-200 to-rose-100' },
  { id: 2, name: 'SunFlower', images: ['/produk/sunflower.webp', '/produk/sunflower1.webp'], price: 15000, unit: 'tangkai', category: 'ceria', bg: 'from-pink-200 to-fuchsia-100' },
  { id: 3, name: 'Lily Pink', images: ['/produk/lilypink.webp', '/produk/lilypink1.webp'], price: 12000, unit: 'tangkai', category: 'romantis', bg: 'from-amber-200 to-yellow-100' },
  { id: 4, name: 'Lily Putih', emoji: '💮', price: 25000, unit: 'tangkai', category: 'elegan', bg: 'from-stone-200 to-rose-50' },
  { id: 5, name: 'Peony Pink', emoji: '🌸', price: 45000, unit: 'tangkai', category: 'romantis', bg: 'from-pink-300 to-rose-100' },
  { id: 6, name: 'Lavender', emoji: '🪻', price: 10000, unit: 'ikat', category: 'elegan', bg: 'from-violet-200 to-purple-100' },
  { id: 7, name: 'Baby Breath', emoji: '🤍', price: 7000, unit: 'ikat', category: 'elegan', bg: 'from-slate-200 to-white' },
  { id: 8, name: 'Gerbera Ceria', emoji: '🌼', price: 9000, unit: 'tangkai', category: 'ceria', bg: 'from-orange-200 to-amber-100' },
]
