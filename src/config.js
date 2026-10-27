export const BRAND = 'Candra.florist'
export const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '6283110653062'

// Data kontak resmi toko
export const CONTACT = {
  address: 'Jl. Melati No. 12, Jakarta Selatan',
  email: 'halo@candraflorist.com',
  hours: 'Setiap hari, 08.00 – 22.00 WIB',
  instagram: 'https://instagram.com/candra.florist',
  tiktok: 'https://tiktok.com/@candra.florist',
}

// Jam operasional untuk status "Buka / Tutup" di website (format 24 jam, zona waktu toko)
export const STORE_HOURS = { timeZone: 'Asia/Jakarta', open: 8, close: 22 }
