"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  X,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  DownloadCloud,
  CreditCard,
  Search,
  User,
  Mail,
  Phone,
  ArrowRight,
  Database,
} from "lucide-react";
import {
  Product,
  fetchProducts,
  createOrderRecord,
  formatRupiah,
} from "@/lib/digitalStore";

const BSI_ACCOUNT_NUMBER = "7198 4520 88";
const BSI_ACCOUNT_HOLDER = "PT Karya Digital Nusantara";

export default function StorefrontPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State Modal Checkout
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uniqueCode, setUniqueCode] = useState<number>(127);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    setLoading(true);
    const res = await fetchProducts(true);
    setProducts(res.products);
    setIsFallback(res.isFallback);
    setLoading(false);
  }

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  function openCheckoutModal(product: Product) {
    // Generate kode unik 3 digit (101 - 899)
    const generatedCode = Math.floor(101 + Math.random() * 798);
    setUniqueCode(generatedCode);
    setSelectedProduct(product);
    setFormError("");
  }

  function closeCheckoutModal() {
    if (submitting) return;
    setSelectedProduct(null);
    setFormError("");
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  }

  async function handleCheckout(targetStatus: "completed" | "pending") {
    if (!selectedProduct) return;

    const name = customerName.trim();
    const email = customerEmail.trim();
    const whatsapp = customerWhatsapp.trim();

    if (!name || !email || !whatsapp) {
      setFormError("Mohon lengkapi Nama Lengkap, Email, dan Nomor WhatsApp Anda.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      const totalAmount = Number(selectedProduct.price) + uniqueCode;
      const { order } = await createOrderRecord({
        product: selectedProduct,
        customer_name: name,
        customer_email: email,
        customer_whatsapp: whatsapp,
        unique_code: uniqueCode,
        total_amount: totalAmount,
        status: targetStatus,
      });

      router.push(`/order/${order.id}`);
    } catch {
      setFormError("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
      setSubmitting(false);
    }
  }

  function fillDemoCustomer() {
    setCustomerName("Budi Santoso");
    setCustomerEmail("budi.santoso@email.com");
    setCustomerWhatsapp("081234567890");
    setFormError("");
  }

  const totalTransfer = selectedProduct
    ? Number(selectedProduct.price) + uniqueCode
    : 0;

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <section className="bg-[#FFFFFF] border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalog Produk Digital Resmi • Akses Instan Otomatis</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Tingkatkan Produktivitas dengan{" "}
              <span className="text-burgundy-grad">Aset Digital Premium</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Koleksi E-Book eksklusif, Template Produktivitas, UI Kit, dan Source
              Code siap pakai. Sekali beli, langsung unduh dan akses seumur hidup.
            </p>

            {/* Feature Badges */}
            <div className="mt-7 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-[#800020]" />
                <span>Unduh File & Link Seketika</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#800020]" />
                <span>Transfer Bank BSI Mudah</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#800020]" />
                <span>Lisensi Resmi & Update Gratis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
        {isFallback && (
          <div className="mb-6 rounded-2xl bg-[#FFFFFF] border border-[#800020]/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Mode Katalog Demo Aktif (Siap Demonstrasi)
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Tabel <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#800020]">products</code> /{" "}
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#800020]">orders</code> di Supabase belum dibuat atau sedang menggunakan penyimpanan lokal. Anda tetap dapat melakukan simulasi transaksi penuh atau menjalankan file{" "}
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-800">supabase/schema.sql</code> di SQL Editor Supabase.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Etalase Produk Digital
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Menampilkan {filteredProducts.length} produk digital aktif yang siap diunduh
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari e-book, template, source code..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-[#FFFFFF] rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="pt-4 flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-28" />
                    <div className="h-10 bg-gray-200 rounded-xl w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-200/80 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              Belum ada produk yang cocok dengan pencarian Anda, atau tambah produk baru melalui halaman Dashboard Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-[#FFFFFF] rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#800020]/30 transition-all duration-300 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.cover_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFFFF]/95 text-[#800020] shadow-sm backdrop-blur-sm">
                      {product.category || "Produk Digital"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#800020] transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                        Harga Resmi
                      </span>
                      <span className="text-lg font-extrabold text-[#800020]">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCheckoutModal(product)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-burgundy-grad shadow-md shadow-[#800020]/20 hover:shadow-lg active:scale-[0.99] transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Beli Sekarang</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal Checkout */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-burgundy-grad px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-white/80">
                  Checkout Produk Digital
                </span>
                <h3 className="text-lg font-bold leading-snug mt-0.5 line-clamp-1">
                  {selectedProduct.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCheckoutModal}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Data Pembeli Form */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">
                    1. Lengkapi Informasi Pembeli
                  </h4>
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    className="text-xs font-semibold text-[#800020] hover:underline"
                  >
                    + Isi Contoh Data Cepat
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Alamat Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="nama@email.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nomor WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={customerWhatsapp}
                          onChange={(e) => setCustomerWhatsapp(e.target.value)}
                          placeholder="0812xxxxxxx"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruksi Transfer Manual BSI */}
              <div className="rounded-2xl bg-[#F9FAFB] border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">
                    2. Instruksi Transfer Bank BSI
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#800020]/10 text-[#800020]">
                    Verifikasi Otomatis
                  </span>
                </div>

                {/* Nomor Rekening BSI Box */}
                <div className="bg-[#FFFFFF] rounded-xl border border-gray-200 p-3.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
                      Bank Syariah Indonesia (BSI)
                    </span>
                    <span className="text-base font-extrabold text-gray-900 tracking-wide">
                      {BSI_ACCOUNT_NUMBER}
                    </span>
                    <span className="block text-xs text-gray-500">
                      a.n. {BSI_ACCOUNT_HOLDER}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(BSI_ACCOUNT_NUMBER.replace(/\s+/g, ""), "rekening")
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    {copiedField === "rekening" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Rek</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rincian Harga + Kode Unik 3 Digit */}
                <div className="bg-[#FFFFFF] rounded-xl border border-gray-200 p-3.5 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Harga Produk</span>
                    <span className="font-medium text-gray-900">
                      {formatRupiah(selectedProduct.price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kode Unik Verifikasi (3 Digit)</span>
                    <span className="font-bold text-[#800020]">+{uniqueCode}</span>
                  </div>
                  <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">
                        Total Nominal Transfer
                      </span>
                      <span className="text-lg font-extrabold text-[#800020]">
                        {formatRupiah(totalTransfer)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(String(totalTransfer), "nominal")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#800020]/10 hover:bg-[#800020]/15 text-[#800020] transition-colors"
                    >
                      {copiedField === "nominal" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Nominal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed">
                  * Pastikan transfer tepat hingga <strong>3 digit terakhir ({uniqueCode})</strong> agar sistem dapat mengenali pembayaran Anda secara otomatis.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {formError}
                </div>
              )}

              {/* Action Buttons: Tombol Simulasi Bayar Lunas (Demo) & Buat Pesanan */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleCheckout("completed")}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-burgundy-grad shadow-lg shadow-[#800020]/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {submitting
                      ? "Memproses Pesanan..."
                      : "Simulasi Bayar Lunas (Demo Instan)"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleCheckout("pending")}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 bg-[#F9FAFB] hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Buat Pesanan Status Pending (Transfer Manual)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
