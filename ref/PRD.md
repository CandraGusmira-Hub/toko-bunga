# Product Requirements Document (PRD)

**Produk:** Candra.florist — Website Katalog & Pemesanan Toko Bunga via WhatsApp
**Versi dokumen:** 1.0
**Tanggal:** 27 Oktober 2026
**Status:** Draft (disusun dari analisis kode sumber `src.zip`)
**Penulis:** Dihasilkan dari reverse-engineering kode; perlu divalidasi oleh pemilik produk

> **Catatan metodologi.** PRD ini disusun dengan membaca seluruh isi folder `src/` (36 file, ±2.800 baris). Zip tidak memuat `package.json`, `tailwind.config`, `index.html`, maupun folder `public/`, sehingga versi library dan aset gambar tidak dapat diverifikasi. Bagian yang merupakan **kesimpulan/asumsi**, bukan fakta dari kode, ditandai **[Asumsi]**. Bagian yang berupa temuan masalah di kode ditandai **[Temuan]**.

---

## 1. Ringkasan Eksekutif

Candra.florist adalah *single-page website* untuk toko bunga lokal berbahasa Indonesia. Pelanggan menelusuri katalog bunga, memasukkan ke keranjang atau merangkai buket sendiri secara visual, lalu **mengirim pesanan sebagai pesan WhatsApp yang sudah terformat** ke admin toko. Tidak ada backend, database, akun pengguna, atau pembayaran online: seluruh transaksi, konfirmasi harga final, ongkir, dan pembayaran diselesaikan manual oleh admin lewat WhatsApp.

Nilai utama produk: **menurunkan friksi pemesanan** (tanpa registrasi/checkout rumit) sambil menyajikan toko yang terasa profesional dan hangat, dan **menghemat waktu admin** karena pesan pesanan sudah berisi data lengkap (item, jumlah, tanggal, alamat, kartu ucapan).

## 2. Latar Belakang & Masalah

| Masalah | Dampak |
|---|---|
| Toko bunga kecil biasanya menerima pesanan lewat chat bebas (Instagram/WA) | Admin harus bolak-balik menanyakan item, tanggal, alamat; pesanan sering tidak lengkap |
| Pelanggan tidak punya katalog harga yang jelas | Pelanggan ragu, banyak pertanyaan berulang soal harga/jenis bunga |
| Platform e-commerce penuh (Tokopedia/Shopee/Shopify) terlalu berat untuk toko kecil | Biaya, komisi, dan kompleksitas operasional |
| Pelanggan ingin buket personal tetapi sulit membayangkan hasilnya | Keputusan beli tertunda |

**Solusi:** katalog + keranjang ringan + *custom bouquet builder* dengan pratinjau visual, dengan "checkout" berupa tautan `wa.me` yang membawa ringkasan pesanan.

## 3. Tujuan & Non-Tujuan

### 3.1 Tujuan (Goals)
1. Pelanggan dapat menemukan bunga dan harganya dalam < 30 detik dari halaman muka.
2. Pelanggan dapat menyelesaikan pesanan (sampai pesan WhatsApp terkirim) dalam < 2 menit.
3. Setiap pesan WhatsApp yang masuk memuat informasi minimum yang dibutuhkan admin untuk memproses pesanan (tanpa tanya ulang).
4. Pelanggan dapat mem-visualisasikan buket kustom sebelum memesan.
5. Pemilik toko dapat mengubah produk, harga, jam buka, kontak, FAQ, dan ulasan **tanpa menyentuh logika aplikasi** (cukup edit file data/konfigurasi).
6. Situs cepat, responsif *mobile-first*, dan dapat diakses (a11y).

### 3.2 Non-Tujuan (Out of Scope v1)
- Pembayaran online / payment gateway.
- Akun pelanggan, login, riwayat pesanan.
- Manajemen stok dan inventori *real-time*.
- Perhitungan ongkir otomatis / integrasi kurir.
- Panel admin/CMS dan backend/API.
- Multi-bahasa (saat ini hanya Bahasa Indonesia).
- Notifikasi otomatis ke pelanggan (status pesanan).

## 4. Target Pengguna & Persona

**Persona 1 — Rina (26), pembeli untuk pasangan/teman.** Memesan lewat HP, sering mendadak (H-0/H+1) untuk ulang tahun/anniversary. Ingin proses cepat dan tahu harga di muka.

**Persona 2 — Pak Budi (40), pembeli untuk acara formal.** Mencari bunga elegan (lily putih, baby breath) untuk ucapan duka/pernikahan. Ingin kartu ucapan dan kepastian jadwal.

**Persona 3 — Dita (22), pembeli kreatif.** Ingin buket personal; senang memilih bentuk (*Hand Bouquet*, *Flower Box*, *Standing Flower*) dan melihat pratinjau.

**Persona 4 — Candra (pemilik/admin toko).** Menerima pesanan via WhatsApp; ingin pesan terstruktur dan bisa memperbarui katalog sendiri dengan mudah.

## 5. Ruang Lingkup Produk

Satu halaman (*single page application*) dengan navigasi *anchor*. Urutan seksi sebagaimana dirender di `App.jsx`:

| # | Seksi | Anchor | Komponen |
|---|---|---|---|
| 0 | Skip link ("Langsung ke katalog") | — | `App` |
| 1 | Navbar (sticky) | — | `Navbar` |
| 2 | Hero | — | `Hero`, `HeroScene` |
| 3 | Katalog bunga | `#katalog` | `Catalog`, `ProductCard`, `ProductModal`, `ProductMedia` |
| 4 | Rangkai buket sendiri | `#custombunga` | `Custombouquet`, `FlowerCanvas` |
| 5 | Keunggulan & Cara pesan | `#keunggulan` | `Features` |
| 6 | Kata pelanggan (kondisional) | `#ulasan` | `Testimonials` |
| 7 | Footer + kontak | `#kontak` | `Footer` |
| — | Keranjang (drawer) | — | `CartDrawer` |
| — | Bar keranjang & tombol chat melayang | — | `FloatingActions` |

## 6. Persyaratan Fungsional

Setiap persyaratan diberi ID (FR-xx) agar dapat dilacak ke pengujian. Prioritas: **P0** = wajib, **P1** = penting, **P2** = baik dimiliki.

### 6.1 Navigasi & Layout
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-01 | Navbar sticky berisi logo (BRAND, sufiks setelah titik diberi warna aksen), tautan Katalog / Custom / Keunggulan / Kontak, ikon keranjang dengan *badge* jumlah item, dan tombol "Belanja". | P0 |
| FR-02 | Di layar < `md`, tautan menu dilipat ke menu *hamburger* yang menutup otomatis saat tautan diklik; tombol memiliki `aria-expanded`. | P0 |
| FR-03 | Tersedia *skip link* "Langsung ke katalog" yang tampil saat difokuskan keyboard. | P1 |
| FR-04 | Scroll halus antar-anchor dengan `scroll-padding-top` agar tidak tertutup navbar; dinonaktifkan jika `prefers-reduced-motion`. | P1 |

### 6.2 Hero & Status Toko
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-10 | Hero menampilkan headline, sub-headline, dua CTA ("Lihat katalog" → `#katalog`, "Rangkai buket sendiri" → `#custombunga`), dan 3 poin nilai jual (bunga segar, antar hari yang sama, pesan via WhatsApp). | P0 |
| FR-11 | Lencana **status Buka/Tutup** dihitung dari `STORE_HOURS` (zona waktu toko, default `Asia/Jakarta`, 08.00–22.00), diperbarui tiap 60 detik, dengan indikator warna hijau (buka) / merah (tutup) dan teks "Buka sampai 22.00" / "Tutup, buka lagi pukul 08.00". Perhitungan menggunakan zona waktu toko, **bukan** zona waktu perangkat pengguna. | P0 |
| FR-12 | Hero menampilkan ilustrasi 3D dekoratif (Three.js): figur perempuan membawa bunga, kelopak jatuh, dan hati melayang (`HeroScene`, `createWoman`, `createHeart`, `createFlower`). | P2 |

### 6.3 Katalog Bunga
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-20 | Katalog menampilkan semua produk dari `data/products.js` dalam grid responsif (2 kolom mobile, 3 kolom `md`, 4 kolom `lg`). | P0 |
| FR-21 | Kartu produk menampilkan gambar (rasio 4:5), badge kategori, nama, harga (`Rp x.xxx`), dan satuan (tangkai/ikat). Produk tanpa gambar menampilkan emoji dengan latar gradien. | P0 |
| FR-22 | **Filter kategori:** Semua / Romantis / Ceria / Elegan (tombol `aria-pressed`). | P0 |
| FR-23 | **Pencarian** teks bebas pada nama produk (tidak peka huruf besar-kecil). | P0 |
| FR-24 | **Urutkan:** Rekomendasi (urutan data), Harga terendah, Harga tertinggi, Nama A–Z (lokal `id`). | P1 |
| FR-25 | Penghitung hasil beresolusi `aria-live="polite"` ("8 bunga" / "3 dari 8 bunga"). | P1 |
| FR-26 | *Empty state* saat tidak ada hasil, dengan tombol "Tampilkan semua bunga" yang me-reset filter, pencarian, dan urutan. | P0 |
| FR-27 | Gambar produk dapat digeser (*swipe/scroll-snap*) dengan indikator titik dan tombol panah (selalu tampil di HP, muncul saat hover di desktop) bila produk punya > 1 gambar. | P1 |
| FR-28 | Tombol "+" pada kartu menambah 1 ke keranjang; setelah ada isi, berubah menjadi *stepper* jumlah. | P0 |

### 6.4 Detail Produk (Modal)
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-30 | Klik gambar/nama produk membuka modal: galeri gambar, kategori, nama, harga/satuan, deskripsi, dan kotak "Tips perawatan" (3 butir). | P0 |
| FR-31 | Modal menyediakan "Tambah ke keranjang"; bila sudah ada di keranjang, tampil *stepper* + tombol "Lihat keranjang" (menutup modal & membuka drawer). | P0 |
| FR-32 | Modal menyediakan "Pesan langsung via WhatsApp" dengan pesan berisi satu item (jumlah = jumlah di keranjang, minimal 1). | P1 |
| FR-33 | Modal berperilaku sebagai dialog yang aksesibel (lihat 6.9 / NFR-A). | P0 |

### 6.5 Keranjang
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-40 | State keranjang bertipe `{ [idProduk]: jumlah }`; harga selalu dihitung dari data produk terkini (bukan disimpan di keranjang). | P0 |
| FR-41 | Jumlah per produk dibatasi **0–99**; mengurangi sampai 0 menghapus item. | P0 |
| FR-42 | Keranjang **persisten** di `localStorage` (kunci `botanique.cart.v1`). Saat dimuat, entri dibersihkan: ID yang tidak ada di katalog dibuang, jumlah dibulatkan ke bawah dan di-*clamp*. Bila `localStorage` tidak tersedia (mode privat) atau berisi data rusak, aplikasi tetap berjalan dengan keranjang di memori/kosong tanpa error. | P0 |
| FR-43 | Drawer keranjang menampilkan tiap baris: thumbnail, nama, harga/satuan, *stepper*, tombol hapus, subtotal baris; tombol "Kosongkan keranjang"; header menampilkan jumlah item. | P0 |
| FR-44 | Keranjang kosong menampilkan *empty state* dengan tautan "Lihat katalog". | P1 |
| FR-45 | Bar keranjang melayang di bawah layar muncul bila ada item, menampilkan jumlah item + total + tombol "Lihat keranjang". | P1 |

### 6.6 Formulir Pesanan & Checkout via WhatsApp
Terletak di bawah daftar item pada drawer keranjang.

| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-50 | Kolom wajib: **Nama** (teks), **Cara menerima** (Diantar / Ambil di toko), **Tanggal** (lihat FR-60), dan **Alamat** (textarea, hanya wajib bila "Diantar"). Kolom opsional: **Kartu ucapan**. | P0 |
| FR-51 | Bila "Ambil di toko", alamat toko (`CONTACT.address`) ditampilkan sebagai teks dan kolom alamat disembunyikan. | P0 |
| FR-52 | Tombol "Kirim pesanan ke WhatsApp" **nonaktif** sampai keranjang tidak kosong dan semua kolom wajib terisi (input yang hanya berisi spasi dianggap kosong). Di bawahnya tampil petunjuk "Lengkapi {nama, tanggal, alamat} dulu." | P0 |
| FR-53 | Saat siap, tombol berupa tautan `https://wa.me/{WA_NUMBER}?text={pesan ter-encode}` yang dibuka di tab baru (`rel="noopener noreferrer"`). | P0 |
| FR-54 | Format pesan WhatsApp (urutan baku): sapaan `Halo {BRAND}, saya ingin memesan:` → daftar `- {Nama} x{qty} {satuan} ({subtotal})` → `Estimasi harga bunga` → `Nama` → `Tanggal` (format panjang `id-ID`) → `Diantar ke: …` **atau** `Diambil di toko (…)` → `Kartu ucapan: …` bila diisi. | P0 |
| FR-55 | Total ditampilkan sebagai **"Estimasi harga bunga"** dengan keterangan bahwa harga akhir dan ongkir dikonfirmasi admin via WhatsApp. | P0 |

### 6.7 Pemilihan Tanggal
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-60 | Komponen `DeliveryDate` menyediakan opsi cepat **Hari ini**, **Besok**, dan **Tanggal lain** (input `type="date"` dengan `min` = hari ini). Nilai berformat `YYYY-MM-DD` berdasarkan **jam lokal pengguna**, bukan UTC. | P0 |
| FR-61 | Label menyesuaikan konteks ("Tanggal pengiriman" vs "Tanggal pengambilan"). | P2 |

### 6.8 Custom Bouquet Builder
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-70 | Alur 3 langkah: (1) pilih **bentuk** — *Hand Bouquet*, *Flower Box*, *Standing Flower*; (2) pilih **bunga & jumlah** dari seluruh katalog (0–99 per jenis); (3) isi detail: tanggal pengiriman, kartu ucapan (opsional), catatan tambahan (opsional). | P0 |
| FR-71 | **Pratinjau visual** di panel samping (sticky di desktop): bunga digambar di kanvas 2D (Three.js, kamera ortografik) di dalam frame SVG sesuai bentuk (kertas kerucut + pita / kotak + pita / lingkaran berdiri). Maksimum tangkai yang digambar = `MAX_STEMS` (19: 1 tengah + cincin 6 + cincin 12); bila lebih, tampil catatan "Pratinjau menampilkan N tangkai pertama." | P1 |
| FR-72 | Susunan tangkai di pratinjau **berselang-seling antar jenis** (`spread`) agar warna tersebar merata. | P2 |
| FR-73 | Panel ringkasan menampilkan rincian per bunga, **estimasi total**, dan tombol "Kirim ke WhatsApp" (aktif minimal 1 bunga; selain itu tampil "Pilih minimal 1 bunga"). Tersedia tombol "Kosongkan pilihan". | P0 |
| FR-74 | Pesan WhatsApp custom berformat: `Halo {BRAND}, saya ingin memesan *Custom Bouquet*.` → `Bentuk` → `Bunga:` (daftar) → `Estimasi harga bunga` → `Tanggal kirim` (bila diisi) → `Kartu ucapan` → `Catatan`. | P0 |
| FR-75 | State builder **terpisah** dari keranjang utama dan tidak disimpan (hilang saat refresh). | P0 (perilaku saat ini) |

### 6.9 Bagian Informasi
| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-80 | **Keunggulan:** 3 poin (Selalu Segar, Pesan Mudah, Pengiriman Cepat). **Cara pesan:** 4 langkah berurutan (Pilih bunga → Kirim pesanan → Admin mengonfirmasi → Bunga sampai). | P1 |
| FR-81 | **Testimoni:** seksi hanya dirender jika `TESTIMONIALS` tidak kosong (saat ini kosong sehingga tersembunyi). Kebijakan: hanya ulasan **asli**. | P1 |
| FR-82 | **Footer:** nama merek, deskripsi, tautan sosial (Instagram, TikTok, WhatsApp), menu, info kontak (alamat dengan tautan Google Maps, email, jam operasional), serta status buka/tutup. | P1 |
| FR-83 | **Tombol WhatsApp melayang** ("Chat kami") selalu tampil di kanan bawah dan naik posisinya saat bar keranjang muncul agar tidak bertumpuk. | P1 |
| FR-84 | **FAQ** (5 pertanyaan, akordeon `<details>`) dan **Kartu CTA Kontak** sudah dibuat sebagai komponen, namun **belum dirender** (lihat Temuan T-01, T-02). | P1 |

## 7. Model Data & Konfigurasi

Seluruh konten dikelola lewat file statis (tanpa backend).

### 7.1 `config.js`
| Kunci | Fungsi | Catatan |
|---|---|---|
| `BRAND` | Nama toko | `Candra.florist`; bagian setelah titik diberi warna aksen di navbar |
| `WA_NUMBER` | Nomor WhatsApp tujuan pesanan | Diambil dari env `VITE_WA_NUMBER`, default `6283110653062` (format internasional tanpa `+`) |
| `CONTACT` | Alamat, email, jam teks, Instagram, TikTok | **Masih berisi data placeholder** ("Kota Anda", `botanique.florist`) — wajib diganti |
| `STORE_HOURS` | `{ timeZone, open, close }` jam 24 | Harus disamakan manual dengan `CONTACT.hours` |

### 7.2 Entitas `Product` (`data/products.js`)
| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | number | ya | Unik; dipakai sebagai kunci keranjang |
| `name` | string | ya | Nama tampil & kunci pencarian |
| `price` | number (Rupiah, bulat) | ya | Harga per satuan |
| `unit` | string | ya | `tangkai` / `ikat` |
| `category` | enum | ya | `romantis` \| `ceria` \| `elegan` |
| `desc` | string | ya | Deskripsi di modal |
| `bg` | string (kelas Tailwind gradien) | ya | Latar kartu |
| `images` | string[] | tidak | Path gambar; bila kosong dipakai `emoji` |
| `emoji` | string | tidak | Cadangan bila tak ada gambar |

**Katalog awal (8 produk):** Mawar Merah (Rp 8.000/tangkai, romantis), SunFlower (15.000, ceria), Lily Pink (12.000, romantis), Lily Putih (25.000, elegan), Peony Pink (45.000, romantis), Lavender (10.000/ikat, elegan), Baby Breath (7.000/ikat, elegan), Gerbera Ceria (9.000, ceria). Tiga produk pertama punya foto (`/produk/*.webp`); lima lainnya masih memakai emoji.

### 7.3 Data lain
- `CATEGORIES`, `SORTS` — daftar filter dan opsi urutan (di `products.js`).
- `TESTIMONIALS` — `{ name, note?, text }[]`, saat ini `[]`.

### 7.4 Penyimpanan klien
| Kunci | Isi | Skema |
|---|---|---|
| `localStorage["botanique.cart.v1"]` | Keranjang | `{ "<idProduk>": <qty> }` |

## 8. Persyaratan Non-Fungsional

### NFR-A Aksesibilitas
- Dialog (keranjang & modal produk): `role="dialog"`, `aria-modal`, `aria-labelledby`; **Esc** menutup; scroll *body* dikunci; fokus **terperangkap** (*focus trap*) dan dikembalikan ke pemicu saat ditutup (`useDialog`).
- Tombol toggle memakai `aria-pressed`; hasil dinamis memakai `aria-live`; gambar dekoratif `alt=""`/`aria-hidden`; pratinjau buket memakai `role="img"` + `aria-label` dinamis.
- Ring fokus terlihat, termasuk varian putih pada area gelap; target sentuh ≥ 40 px.
- Menghormati `prefers-reduced-motion` (animasi `motion-safe:`, scroll halus dimatikan).
- Sasaran: **WCAG 2.1 AA**. **[Asumsi]** kontras warna perlu diaudit (mis. teks `muted` di atas latar `blush`).

### NFR-P Performa
- Aplikasi sepenuhnya statis; tidak ada panggilan API.
- Three.js (≈ ratusan KB) dipakai di Hero dan builder — **[Asumsi]** perlu *lazy-load* / *code-splitting* agar LCP mobile < 2,5 dtk.
- Gambar produk berformat WebP; disarankan `loading="lazy"` dan dimensi eksplisit (belum dapat diverifikasi).
- Sasaran **[Asumsi]**: Lighthouse Performance ≥ 90 (mobile), CLS < 0,1.

### NFR-R Responsif & Kompatibilitas
- *Mobile-first*; breakpoint Tailwind `sm/md/lg`; mencegah geser horizontal (`overflow-x: clip`) tanpa merusak navbar sticky; memakai `100dvh` untuk drawer di browser seluler.
- Browser target: versi terbaru Chrome, Safari (iOS 15+), Firefox, Edge. **[Asumsi]**
- Fallback tanpa WebGL untuk Hero/pratinjau **belum ada** (lihat T-06).

### NFR-S Keamanan & Privasi
- Tidak ada data pribadi yang dikirim ke server milik situs; data pesanan hanya dikirim ke WhatsApp oleh pengguna sendiri (aksi eksplisit klik tautan).
- Teks pesan di-*encode* dengan `encodeURIComponent`; React meng-*escape* keluaran sehingga tidak ada rendering HTML mentah.
- Tautan eksternal memakai `rel="noopener noreferrer"`.
- Satu-satunya data tersimpan di perangkat adalah isi keranjang (tanpa PII). Formulir nama/alamat **tidak** disimpan.
- Sumber font eksternal (Google Fonts) mengirim IP pengguna ke Google — **[Asumsi]** pertimbangkan *self-host* font.

### NFR-I Internasionalisasi & Format
- Bahasa UI: Indonesia. Mata uang: Rupiah, format `Rp 12.000` (`toLocaleString('id-ID')`). Tanggal: format panjang `id-ID`.

### NFR-M Kemudahan Pemeliharaan
- Konten dipisah dari logika (`data/`, `config.js`). Utilitas kecil terpusat (`utils/ui.js`, `format.js`, `date.js`, `whatsapp.js`). State keranjang di `CartProvider` + `useReducer`.
- Bahasa komentar kode: Indonesia.

## 9. Arsitektur & Tech Stack (hasil inferensi)

| Lapisan | Teknologi | Bukti |
|---|---|---|
| UI | **React** (hooks, Context, `StrictMode`) | `main.jsx`, `App.jsx` |
| Build | **Vite** (kemungkinan besar) | `import.meta.env.VITE_WA_NUMBER` |
| Styling | **Tailwind CSS** + tema kustom (warna `ink`, `paper`, `blush`, `petal`, `peony`, `leaf`, `muted`, animasi `rise/fade/slide/pop`) | `@tailwind` di `index.css` |
| Tipografi | Fraunces (display, sumbu SOFT) + Figtree (teks) via Google Fonts | `index.css` |
| Grafik | **Three.js** | `HeroScene`, `FlowerCanvas`, `lib/create*` |
| State | `useReducer` + Context; `localStorage` untuk keranjang | `CartProvider.jsx` |
| Integrasi | Deep link `wa.me` | `utils/whatsapp.js` |
| Backend | **Tidak ada** | — |

**Struktur direktori:**
```
src/
  components/   # 19 komponen UI
  context/      # CartProvider + cart-context (useCart)
  data/         # products.js, testimonials.js
  hooks/        # useDialog, useStoreStatus
  lib/          # createWoman, createHeart, createFlower (Three.js)
  utils/        # date, format, ui, whatsapp
  config.js     # BRAND, WA_NUMBER, CONTACT, STORE_HOURS
```

> **Kekurangan arsip:** tidak ada `package.json`, `vite.config`, `tailwind.config`, `index.html`, `public/`. Aset `/produk/*.webp` dan konfigurasi tema Tailwind harus tersedia di repo asli.

## 10. Alur Pengguna Utama

**A. Pesan dari katalog**
1. Landing → "Lihat katalog" → cari/filter/urutkan.
2. Tekan "+" pada kartu (atau buka modal detail lalu tambah).
3. Bar keranjang muncul → "Lihat keranjang".
4. Atur jumlah → isi Nama, cara menerima, alamat (jika diantar), tanggal, kartu ucapan.
5. Tombol aktif → "Kirim pesanan ke WhatsApp" → aplikasi/web WhatsApp terbuka dengan pesan terisi → pelanggan menekan kirim.
6. Admin mengonfirmasi harga final, ongkir, dan pembayaran di WhatsApp.

**B. Custom bouquet**
1. "Rangkai buket sendiri" → pilih bentuk → pilih bunga & jumlah (pratinjau terisi) → isi tanggal/kartu/catatan → "Kirim ke WhatsApp".

**C. Tanya cepat**
- Tombol "Chat kami" melayang → WhatsApp dengan pesan "Halo {BRAND}, saya ingin bertanya."

## 11. Metrik Keberhasilan

Saat ini **tidak ada analytics** di kode. **[Asumsi]** KPI yang disarankan beserta cara ukurnya:

| Metrik | Target awal | Cara ukur |
|---|---|---|
| Rasio klik "Kirim ke WhatsApp" / sesi | ≥ 5% | Event analytics (perlu ditambahkan) |
| Rasio penyelesaian form keranjang (buka drawer → klik kirim) | ≥ 40% | Event analytics |
| Pesanan WA yang lengkap tanpa tanya ulang | ≥ 90% | Audit manual admin per minggu |
| Waktu dari kunjungan ke klik kirim (median) | < 2 menit | Event timing |
| LCP mobile | < 2,5 dtk | Lighthouse / CrUX |
| Skor Lighthouse a11y | ≥ 95 | Lighthouse CI |
| Penggunaan custom bouquet | ≥ 15% dari total pesanan | Event + penandaan pesan |

## 12. Temuan & Celah pada Implementasi Saat Ini

Hasil pembacaan kode; diurutkan dari dampak terbesar.

| ID | Temuan | Dampak | Rekomendasi |
|---|---|---|---|
| **T-01** | Komponen **`FAQ`** tidak diimpor/dirender di `App.jsx`, tetapi Footer menautkan ke `#faq`. | Tautan footer "Pertanyaan umum" tidak berfungsi | Render `<FAQ />` setelah `Testimonials` atau hapus tautannya |
| **T-02** | Komponen **`Contact`** (CTA "Siap mengirim bunga hari ini?") tidak dirender; juga memakai gaya lama (`rose-500`, `font-extrabold`) yang berbeda dari tema, dan `id="kontak"` bentrok dengan `Footer` (`id="kontak"`). | Kode mati; potensi ID ganda jika diaktifkan | Hapus atau seragamkan gaya dan ubah ID |
| **T-03** | `CONTACT` masih placeholder (`Jl. Melati No. 12, Kota Anda`, `halo@botanique.florist`, IG/TikTok `botanique.florist`). Kunci `localStorage` juga `botanique.cart.v1` — sisa nama lama. | Info palsu tampil ke publik; tautan sosial salah | Isi data asli; ganti nama kunci (sertakan migrasi bila perlu) |
| **T-04** | Klaim pemasaran tertulis tegas ("dipilih dari kebun", "rantai dingin", "antar di hari yang sama") tanpa mekanisme verifikasi ketersediaan. | Risiko ekspektasi pelanggan tidak terpenuhi | Pastikan klaim sesuai operasional atau lunakkan teks |
| **T-05** | Tanggal "Hari ini" tetap bisa dipilih meski **toko sudah tutup** atau melewati jam tutup; tidak ada *cut-off* pesanan hari-H. | Pesanan tidak realistis | Tambah aturan jam batas pesanan same-day (lihat FR-90) |
| **T-06** | Tidak ada fallback bila WebGL gagal / perangkat lemah (Hero & pratinjau). Pratinjau juga terbatas 19 tangkai. | Area kosong/error di perangkat tertentu | Deteksi WebGL; tampilkan gambar statis |
| **T-07** | Keranjang dan Custom Bouquet adalah dua sistem state terpisah; builder tidak persisten dan tidak bisa digabung dalam satu pesanan. | Pengalaman terputus; kehilangan pilihan saat refresh | Pertimbangkan persistensi builder atau penggabungan |
| **T-08** | Form keranjang (nama, alamat, tanggal) tidak persisten; hilang bila drawer ditutup (komponen `Panel` di-*unmount*). | Pengguna harus mengetik ulang | Simpan draf form di state level provider / `sessionStorage` |
| **T-09** | Validasi hanya "tidak kosong": tidak ada validasi panjang, nomor telepon pemesan, atau tanggal manual yang lampau (input `min` bisa dilewati lewat pengetikan). Pesan WA tidak memuat **nomor kontak pemesan** (hanya nama) — admin bergantung pada nomor pengirim WhatsApp. | Data kurang andal | Validasi tanggal ≥ hari ini di logika; opsional kolom telepon |
| **T-10** | Pengurutan "Rekomendasi" = urutan array, tidak ada penanda produk unggulan/stok habis/terlaris. | Tidak ada kontrol merchandising | Tambah field `featured` / `soldOut` |
| **T-11** | Tidak ada `<title>`/meta SEO/OG, `sitemap`, atau skema `LocalBusiness`/`Product` yang dapat diverifikasi dari arsip (kemungkinan ada di `index.html` yang tidak disertakan). | Penemuan organik lemah | Verifikasi & lengkapi |
| **T-12** | Teks `FAQ` menyebut kebijakan (same-day, pembayaran) yang harus diselaraskan dengan operasional; `STORE_HOURS` dan `CONTACT.hours` harus dijaga sinkron manual. | Inkonsistensi | Turunkan `CONTACT.hours` dari `STORE_HOURS` |
| **T-13** | Hero menampilkan teks status `"Tutup , buka lagi"` dengan spasi sebelum koma. | Salah ketik minor | Perbaiki string di `useStoreStatus` |

## 13. Rencana Rilis & Peningkatan

### Fase 0 — Perbaikan sebelum rilis publik (wajib)
- Isi `CONTACT`, `WA_NUMBER` (via env), dan ganti kunci penyimpanan (T-03).
- Render `FAQ` atau hapus tautannya; putuskan nasib `Contact` (T-01, T-02).
- Tambahkan foto untuk 5 produk yang masih beremoji.
- Lengkapi `index.html` (title, meta, OG, favicon) dan konfigurasi build; pastikan aset `public/produk/` ada.
- Perbaiki typo T-13.

### Fase 1 — Konversi & kualitas (disarankan)
- FR-90: Aturan *cut-off* same-day berdasarkan `STORE_HOURS` (nonaktifkan "Hari ini" setelah jam batas, tampilkan pesan).
- Analytics ringan (mis. Plausible/GA4) dengan event: `add_to_cart`, `open_cart`, `click_whatsapp_order`, `click_whatsapp_custom`.
- Persistensi draf form & builder (T-07, T-08).
- *Lazy-load* Three.js; fallback tanpa WebGL (T-06).
- Penanda `soldOut` / `featured` per produk (T-10).

### Fase 2 — Pertumbuhan (opsional)
- Kolom nomor telepon & validasi; area/zona pengiriman dengan estimasi ongkir statis.
- Kupon / harga paket (*bundle*), varian ukuran buket.
- Mode kontenan dari CMS ringan (Google Sheets / Notion / headless CMS) agar admin tidak perlu edit kode.
- Integrasi pembayaran (QRIS) dan status pesanan — memerlukan backend (di luar lingkup v1).

## 14. Kriteria Penerimaan (Ringkas)

| Area | Kriteria "selesai" |
|---|---|
| Katalog | Filter, pencarian, dan urutan dapat dikombinasikan; hasil 0 menampilkan *empty state* yang bisa di-reset |
| Keranjang | Jumlah 0–99; refresh halaman mempertahankan isi; data `localStorage` rusak tidak menyebabkan crash |
| Checkout | Tombol nonaktif sampai nama, tanggal (dan alamat bila diantar) terisi; pesan WA sesuai format FR-54 dan karakter khusus ter-*encode* |
| Custom | Pratinjau berubah saat bentuk/bunga berubah; total sama dengan jumlah (harga × qty); tombol nonaktif bila kosong |
| Status toko | Berubah tepat pada jam buka/tutup menurut zona waktu toko, terlepas dari zona waktu perangkat |
| A11y | Seluruh alur dapat diselesaikan hanya dengan keyboard; fokus tidak keluar dari dialog; Esc menutup dialog |
| Responsif | Tidak ada geser horizontal pada lebar 320 px; drawer memenuhi layar di HP |

## 15. Kasus Uji Kunci

1. Tambah item → refresh → jumlah dan total tetap.
2. Ubah `localStorage` jadi JSON rusak / ID tak dikenal → aplikasi tetap terbuka, keranjang bersih.
3. Tekan "−" pada jumlah 1 → item hilang dari keranjang.
4. Tambah 99 lalu "+" → tetap 99.
5. Pilih "Ambil di toko" → kolom alamat hilang, tombol bisa aktif tanpa alamat.
6. Nama hanya spasi → dianggap kosong.
7. Pilih "Tanggal lain" lalu "Hari ini" → mode dan nilai berpindah benar.
8. Pesan berisi `&`, `#`, baris baru, emoji pada kartu ucapan → pesan WA utuh dan tidak terpotong.
9. Jam perangkat di zona waktu lain → status buka/tutup tetap mengikuti `Asia/Jakarta`.
10. Custom: pilih > 19 tangkai → pratinjau berhenti di 19 dengan catatan; total tetap menghitung semua.
11. Navigasi keyboard penuh di drawer & modal; Esc menutup dan fokus kembali ke tombol pemicu.
12. Testimoni kosong → seksi tidak ada di DOM.

## 16. Risiko & Ketergantungan

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Ketergantungan penuh pada WhatsApp (nomor diblokir/diganti) | Rendah | Tinggi | Nomor di env; siapkan kanal cadangan (IG DM / telepon) |
| Pesanan tidak tercatat (tidak ada backend) | Sedang | Sedang | Admin mencatat dari chat; pertimbangkan Google Sheet via formulir |
| Harga/ketersediaan di situs tak sinkron dengan stok nyata | Tinggi | Sedang | Disclaimer "estimasi" (sudah ada), penanda `soldOut` |
| Performa buruk di HP low-end akibat Three.js | Sedang | Sedang | Lazy-load, fallback, `prefers-reduced-motion` |
| Info placeholder terbit ke publik | Sedang | Tinggi | Checklist Fase 0 |
| Ketergantungan Google Fonts | Rendah | Rendah | Self-host |

## 17. Pertanyaan Terbuka

1. Nama merek final: **Candra.florist** atau **Botanique** (masih tersisa di placeholder dan kunci storage)?
2. Area layanan dan kebijakan same-day yang sebenarnya (radius, jam batas pesanan)?
3. Metode pembayaran yang diterima dan kebijakan ongkir/DP?
4. Apakah toko ingin FAQ dan kartu CTA kontak ditampilkan?
5. Apakah perlu pelacakan konversi (analytics) dan persetujuan cookie?
6. Siapa yang mengelola konten — pemilik langsung edit file, atau perlu CMS?
7. Apakah ada rencana produk lain (buket siap jadi, paket, hampers) di luar bunga per tangkai/ikat?

## 18. Glosarium

| Istilah | Arti |
|---|---|
| Tangkai / Ikat | Satuan jual bunga (batang tunggal / seikat) |
| Custom Bouquet | Buket rakitan pelanggan lewat builder |
| Hand Bouquet / Flower Box / Standing Flower | Tiga bentuk rangkaian yang tersedia |
| `wa.me` | Tautan *deep link* WhatsApp yang membuka chat dengan teks terisi |
| Estimasi harga | Total hitungan situs; harga akhir ditentukan admin |

---
*Akhir dokumen.*
