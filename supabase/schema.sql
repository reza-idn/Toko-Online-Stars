-- ============================================================================
-- SKEMA DATABASE SUPABASE UNTUK APLIKASI TOKO PRODUK DIGITAL SINGLE-TENANT
-- Cara pakai: Pilih SEMUA isi file ini (Ctrl+A), salin (Ctrl+C), tempel di
-- SQL Editor Supabase, lalu klik tombol "Run" TANPA memblok sebagian teks.
-- ============================================================================

-- 1. Buat tabel products untuk menyimpan katalog produk digital
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    cover_url TEXT DEFAULT '',
    file_url TEXT NOT NULL,
    category TEXT DEFAULT 'Produk Digital',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat tabel orders untuk menyimpan data pesanan pelanggan
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT DEFAULT '',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    unique_code INTEGER NOT NULL DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Buat Policy RLS untuk akses Single-Tenant Storefront & Admin Demo
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can insert products" ON public.products;
CREATE POLICY "Public can insert products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update products" ON public.products;
CREATE POLICY "Public can update products" ON public.products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete products" ON public.products;
CREATE POLICY "Public can delete products" ON public.products FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Data Contoh Produk Digital Awal
INSERT INTO public.products (title, description, price, cover_url, file_url, category, is_active)
SELECT * FROM (VALUES
    (
        'Panduan Lengkap Full-Stack Next.js 15 & Supabase (E-Book PDF)',
        'E-Book komprehensif 280+ halaman membahas arsitektur aplikasi web modern menggunakan Next.js App Router, Tailwind CSS, dan Supabase dari nol hingga produksi.',
        149000,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        'E-Book Premium',
        true
    ),
    (
        'UI Kit & Design System SaaS Modern (Figma + Tailwind)',
        'Koleksi 120+ komponen antarmuka siap pakai dengan tema minimalis elegan, responsif untuk mobile & desktop, lengkap dengan kode React dan konfigurasi Tailwind.',
        199000,
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80',
        'https://drive.google.com/drive/u/0/my-drive',
        'Design & UI Kit',
        true
    ),
    (
        'Notion Second Brain & Freelance OS Template',
        'Template produktivitas all-in-one untuk mengelola proyek klien, invoice otomatis, tracker keuangan, serta manajemen jadwal konten kreator digital.',
        89000,
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80',
        'https://www.notion.so/templates',
        'Template Produktivitas',
        true
    ),
    (
        'Source Code Starter Kit Toko Digital & Payment Gateway',
        'Boilerplate siap pakai untuk membangun toko produk digital instan dengan fitur keranjang, kupon diskon, manajemen lisensi, dan dashboard analitik.',
        249000,
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
        'https://github.com/vercel/next.js',
        'Source Code',
        true
    )
) AS v(title, description, price, cover_url, file_url, category, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);
