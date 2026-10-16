# KaryaDigital — Aplikasi Web Jual Produk Digital Single-Tenant

Aplikasi web toko produk digital (*Single-Tenant Digital Storefront*) yang dibangun dengan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Supabase**.

## Fitur Utama
1. **Halaman Etalase (`src/app/page.tsx`)**:
   - Menampilkan katalog produk digital aktif dari tabel Supabase `products`.
   - Kartu produk dilengkapi cover, kategori, judul, deskripsi, harga dalam Rupiah, dan tombol **"Beli Sekarang"**.
2. **Modal Checkout & Transfer BSI**:
   - Pop-up formulir pembelian (**Nama Lengkap**, **Email**, **WhatsApp**) beserta tombol pengisi data contoh cepat.
   - Instruksi transfer manual ke **Rekening Bank Syariah Indonesia (BSI)** lengkap dengan **kode unik 3 digit** otomatis.
   - Tombol **"Simulasi Bayar Lunas (Demo Instan)"** untuk langsung mengubah status pesanan menjadi `'completed'` dan mengarahkan ke halaman unduhan tanpa perlu transfer riil.
3. **Halaman Sukses & Download (`src/app/order/[id]/page.tsx`)**:
   - Menampilkan ucapan terima kasih setelah pembayaran lunas (`status === 'completed'`).
   - Menyediakan tombol langsung **"Unduh File / Buka Akses Produk"** serta unduh bukti lisensi akses (`.txt`).
4. **Dashboard Admin Sederhana (`src/app/admin/page.tsx`)**:
   - Formulir tambah produk digital baru (judul, harga, kategori, link akses/file, cover, dan deskripsi).
   - Tabel daftar pesanan masuk beserta rincian pembeli, nominal + kode unik, dan status pesanan.

## Setup Database Supabase (Opsional)
Buka **SQL Editor** pada dashboard proyek Supabase Anda, lalu salin dan jalankan seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql) untuk membuat tabel `products` dan `orders` beserta contoh produk awal.
*(Apabila tabel belum dibuat di Supabase, aplikasi otomatis menyediakan Mode Katalog Demo sehingga seluruh fitur tetap dapat langsung didemonstrasikan tanpa kendala).*

## Cara Menjalankan
```bash
cd toko-produk-digital
npm install
npm run dev
```
Buka `http://localhost:3000` di browser.
