// Data produk. Ubah/tambah item di sini untuk memperbarui katalog.
// category: 'romantis' | 'ceria' | 'elegan'
// images: daftar gambar yang bisa digeser di card. Tanpa images, card memakai emoji.
// desc: deskripsi singkat yang tampil di jendela detail produk.
export const CATEGORIES = [
  { key: 'semua', label: 'Semua' },
  { key: 'romantis', label: 'Romantis' },
  { key: 'ceria', label: 'Ceria' },
  { key: 'elegan', label: 'Elegan' },
]

export const SORTS = [
  { key: 'rekomendasi', label: 'Rekomendasi' },
  { key: 'termurah', label: 'Harga terendah' },
  { key: 'termahal', label: 'Harga tertinggi' },
  { key: 'nama', label: 'Nama A–Z' },
]

export const PRODUCTS = [
  {
    id: 1,
    name: 'Mawar Merah',
    images: ['/produk/mawar.webp', '/produk/mawar1.webp'],
    price: 8000,
    unit: 'tangkai',
    category: 'romantis',
    bg: 'from-rose-200 to-rose-100',
    desc: 'Mawar merah klasik dengan kelopak beludru. Ungkapan cinta yang tidak pernah salah untuk pasangan.',
  },
  {
    id: 2,
    name: 'SunFlower',
    images: ['/produk/sunflower.webp', '/produk/sunflower1.webp'],
    price: 15000,
    unit: 'tangkai',
    category: 'ceria',
    bg: 'from-pink-200 to-fuchsia-100',
    desc: 'Bunga matahari yang mekar cerah, pembawa semangat untuk ulang tahun, wisuda, atau sekadar menyemangati seseorang.',
  },
  {
    id: 3,
    name: 'Lily Pink',
    images: ['/produk/lilypink.webp', '/produk/lilypink1.webp'],
    price: 12000,
    unit: 'tangkai',
    category: 'romantis',
    bg: 'from-amber-200 to-yellow-100',
    desc: 'Lily pink dengan kelopak besar yang anggun dan aroma harum. Cocok untuk ucapan sayang dan selamat.',
  },
  {
    id: 4,
    name: 'Lily Putih',
    emoji: '💮',
    price: 25000,
    unit: 'tangkai',
    category: 'elegan',
    bg: 'from-stone-200 to-rose-50',
    desc: 'Lily putih yang bersih dan elegan, pilihan untuk pernikahan, acara formal, dan ucapan simpati.',
  },
  {
    id: 5,
    name: 'Peony Pink',
    emoji: '🌸',
    price: 45000,
    unit: 'tangkai',
    category: 'romantis',
    bg: 'from-pink-300 to-rose-100',
    desc: 'Peony berkelopak tebal dan berlapis, lembut sekaligus mewah. Favorit untuk hadiah yang istimewa.',
  },
  {
    id: 6,
    name: 'Lavender',
    emoji: '🪻',
    price: 10000,
    unit: 'ikat',
    category: 'elegan',
    bg: 'from-violet-200 to-purple-100',
    desc: 'Lavender ungu beraroma menenangkan. Dijual per ikat, cocok sebagai pelengkap rangkaian atau hiasan meja.',
  },
  {
    id: 7,
    name: 'Baby Breath',
    emoji: '🤍',
    price: 7000,
    unit: 'ikat',
    category: 'elegan',
    bg: 'from-slate-200 to-white',
    desc: 'Bunga mungil putih yang membuat rangkaian tampak lebih penuh dan lembut. Dijual per ikat.',
  },
  {
    id: 8,
    name: 'Gerbera Ceria',
    emoji: '🌼',
    price: 9000,
    unit: 'tangkai',
    category: 'ceria',
    bg: 'from-orange-200 to-amber-100',
    desc: 'Gerbera berwarna cerah dengan kelopak lebar, membawa suasana riang untuk ulang tahun dan ucapan selamat.',
  },
]
