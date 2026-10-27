# Panduan Membuat Landing Page Toko Bunga (React + TailwindCSS + Three.js)

Landing page toko bunga **Florea** dengan:

- Hero dengan **animasi 3D**: karakter wanita memegang buket, hati (love) berdetak dan melayang, kelopak jatuh pelan
- **Katalog produk** (nama, harga, kategori) dengan filter Romantis / Ceria / Elegan
- Tombol pesan via WhatsApp di setiap produk
- Section keunggulan, ajakan kontak (CTA), dan **footer** lengkap
- Responsif (HP, tablet, desktop)
- Font modern: **Plus Jakarta Sans** (judul) + **Inter** (teks)

> Fitur stok sengaja **tidak dipakai** di versi ini. Stok sebaiknya dikelola lewat dashboard admin (lihat bagian 8).

Stack: **Vite + React 18 + TailwindCSS 3 + Three.js + ESLint**

---

## 1. Prasyarat

- Node.js **18 atau lebih baru** (disarankan 20 LTS) — cek dengan `node -v`
- npm
- Code editor (VS Code)
- Browser dengan dukungan WebGL (semua browser modern)

---

## 2. Cara Cepat: Jalankan dari ZIP

```bash
cd toko-bunga          # setelah ekstrak toko-bunga.zip
npm install
cp .env.example .env   # lalu isi nomor WhatsApp toko
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

---

## 3. Cara Membuat dari Nol (Step by Step)

### Langkah 1 — Buat proyek Vite

```bash
npm create vite@latest toko-bunga -- --template react
cd toko-bunga
npm install
```

### Langkah 2 — Pasang TailwindCSS v3

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

Ganti isi `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1, h2, h3 { letter-spacing: -0.02em; }
}

html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
body { margin: 0; background: #fff7f8; color: #3b1f2b; font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
```

### Langkah 3 — Pasang Three.js

```bash
npm install three
```

### Langkah 4 — Font di `index.html`

Di dalam `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
```

### Langkah 5 — Struktur folder

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── HeroScene.jsx       <- scene 3D (karakter, hati, kelopak)
│   ├── Catalog.jsx         <- filter kategori + grid produk
│   ├── ProductCard.jsx
│   ├── Features.jsx
│   ├── Contact.jsx         <- CTA WhatsApp
│   └── Footer.jsx
├── data/
│   └── products.js         <- data katalog + kategori
├── lib/
│   ├── createFlower.js     <- generator bunga 3D
│   ├── createWoman.js      <- karakter wanita + buket
│   └── createHeart.js      <- bentuk hati 3D
├── utils/
│   └── format.js           <- format rupiah
├── config.js               <- nama toko, WA, kontak footer
├── App.jsx
├── main.jsx
└── index.css
```

Isi lengkap tiap file ada di dalam ZIP. Urutan pengerjaan yang disarankan:

1. `config.js`, `data/products.js`, `utils/format.js`
2. `ProductCard.jsx` lalu `Catalog.jsx` — pastikan katalog dan filter jalan
3. `lib/createFlower.js` → `lib/createHeart.js` → `lib/createWoman.js`
4. `HeroScene.jsx` — gabungkan semua objek 3D dan animasinya
5. `Navbar`, `Hero`, `Features`, `Contact`, `Footer`
6. Susun semuanya di `App.jsx`

---

## 4. Penjelasan Bagian Penting

### 4.1 Data produk — `src/data/products.js`

```js
{ id: 1, name: 'Mawar Merah', emoji: '🌹', price: 8000, unit: 'tangkai', category: 'romantis', bg: 'from-rose-200 to-rose-100' }
```

| Field | Fungsi |
|-------|--------|
| `price` | Harga (angka, otomatis jadi `Rp 8.000`) |
| `unit` | Satuan (tangkai, ikat, dll.) |
| `category` | `romantis`, `ceria`, atau `elegan` (dipakai filter dan badge) |
| `bg` | Kelas gradient Tailwind untuk latar kartu |
| `emoji` | Pengganti foto produk |

Untuk menambah kategori baru, tambahkan di array `CATEGORIES` pada file yang sama.

### 4.2 Karakter wanita — `src/lib/createWoman.js`

Karakter dirakit dari bentuk dasar Three.js (tanpa file model):

| Bagian | Teknik |
|--------|--------|
| Gaun | `LatheGeometry` dari kurva halus (`SplineCurve`) yang diputar 360° |
| Kepala, rambut, mata, pipi | `SphereGeometry` yang diskalakan |
| Senyum | `TorusGeometry` setengah lingkaran |
| Lengan | `CapsuleGeometry` yang dihubungkan antar dua titik (fungsi `limb`) |
| Buket | kerucut kertas + 7 bunga (`createFlower`) tersusun kubah + daun + baby breath |

Kepala dibuat sebagai `Group` sendiri supaya bisa menoleh mengikuti kursor tanpa menggerakkan badan.

Warna yang mudah diubah di bagian atas file: `SKIN`, `HAIR`, `DRESS`.

### 4.3 Hati (love) — `src/lib/createHeart.js`

Bentuk hati dibuat dengan `Shape` (kurva bezier) lalu di-`ExtrudeGeometry` dengan **bevel** agar tepinya halus dan memantulkan cahaya. Geometri dibuat sekali lalu dipakai ulang oleh semua hati.

Di `HeroScene.jsx` ada dua jenis hati:

- **Hati besar** di belakang karakter yang berdetak (`beat`)
- **Hati kecil** (`HEARTS`) yang melayang naik, bergoyang, dan memudar di ujung

### 4.4 Scene — `src/components/HeroScene.jsx`

- `HEARTS` — daftar posisi/ukuran hati kecil. Tambah atau kurangi item untuk mengubah jumlah hati.
- `HEART_COLORS` — palet warna hati.
- `PETAL_COUNT` — jumlah kelopak/kilau yang jatuh.
- Pencahayaan: `HemisphereLight` (ambient pink lembut), `DirectionalLight` utama, dan rim light pink dari belakang.
- Animasi memakai delta waktu sehingga kecepatan sama di layar 60Hz maupun 120Hz.
- Hemat baterai: render dihentikan saat scene tidak terlihat (`IntersectionObserver`).
- Menghormati pengaturan "reduce motion" pengguna.
- Jika WebGL tidak tersedia, tampil ikon 💐 sebagai cadangan.
- Fungsi cleanup di `useEffect` membersihkan listener, texture, dan renderer supaya tidak terjadi kebocoran memori.

---

## 5. Kustomisasi

| Ingin mengubah | Edit |
|----------------|------|
| Nama toko | `BRAND` di `src/config.js` |
| Nomor WhatsApp | `VITE_WA_NUMBER` di `.env` (format `6281234567890`, tanpa `+`) |
| Alamat, email, jam buka, Instagram, TikTok (footer) | objek `CONTACT` di `src/config.js` |
| Produk dan harga | `src/data/products.js` |
| Warna gaun / kulit / rambut | konstanta di atas `createWoman.js` |
| Warna bunga di buket | array `colors` di fungsi `createBouquet` |
| Jumlah hati | `HEARTS` di `HeroScene.jsx` |
| Warna utama website | ganti kelas `rose-*` di komponen |
| Font | ubah link di `index.html` dan `fontFamily` di `tailwind.config.js` |
| Foto produk asli | letakkan gambar di `public/produk/`, lalu ganti `<span>{product.emoji}</span>` di `ProductCard.jsx` dengan `<img src="/produk/mawar.jpg" alt={product.name} className="h-full w-full object-cover" />` |

Setelah mengubah `.env`, **restart** `npm run dev`.

---

## 6. Build & Deploy

```bash
npm run lint     # cek kode dengan ESLint
npm run build    # hasil ada di folder dist/
npm run preview  # coba hasil build secara lokal
```

Folder `dist/` bisa di-upload ke Vercel, Netlify, Cloudflare Pages, atau hosting statis biasa.
Di Vercel/Netlify, set environment variable `VITE_WA_NUMBER` pada pengaturan proyek.

---

## 7. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Scene 3D tidak muncul | Cek console browser. Pastikan `npm install three` sudah dijalankan dan WebGL aktif. |
| Warna 3D terlihat gelap | Naikkan intensitas `HemisphereLight` / `DirectionalLight` di `HeroScene.jsx`. |
| Hati terlihat terbalik | Hapus/ubah baris `heartGeometry.rotateZ(Math.PI)` di `createHeart.js`. |
| Style Tailwind tidak jalan | Pastikan `content` di `tailwind.config.js` benar dan `index.css` di-import di `main.jsx`. |
| Font tidak berubah | Pastikan link Google Fonts ada di `index.html` dan perangkat terhubung internet. |
| Error saat `npm install` | Pastikan Node.js 18+. Hapus `node_modules` dan `package-lock.json`, ulangi. |
| Nomor WA tidak berubah | Restart dev server setelah mengedit `.env`. |
| Animasi berat di HP lama | Kurangi `HEARTS`, `PETAL_COUNT`, atau `layers` bunga di `createBouquet`. |

---

## 8. Pengembangan Lanjutan (Opsional)

- **Katalog dari dashboard/API:** ganti `PRODUCTS` dengan data dari backend (misalnya Laravel) memakai `fetch` di `useEffect` + `useState`. Struktur field cukup sama dengan `products.js`. Di tahap ini, stok bisa ditambahkan kembali dan dikelola dari dashboard admin.
- **Foto produk:** simpan URL gambar di data produk, tampilkan dengan `<img>`.
- **Model karakter sendiri:** gunakan `GLTFLoader` dari `three/examples/jsm/loaders/GLTFLoader.js` untuk memuat file `.glb` (misalnya dari Blender atau Ready Player Me).
- **Keranjang:** tambahkan state keranjang dan kirim ringkasan pesanan ke WhatsApp.
