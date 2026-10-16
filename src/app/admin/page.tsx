"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Package,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Sparkles,
  RefreshCw,
  DollarSign,
  Link2,
  Image as ImageIcon,
  FileText,
  Zap,
  Pencil,
  X,
  Save,
  LogOut,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Product,
  Order,
  fetchProducts,
  fetchOrders,
  addProduct,
  updateProduct,
  removeProduct,
  updateOrderStatusById,
  formatRupiah,
} from "@/lib/digitalStore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State Tambah Produk
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [category, setCategory] = useState("E-Book & Modul");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal State Edit Produk
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFileUrl, setEditFileUrl] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function verifyAuthAndLoad() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        if (!isMounted) return;
        setAdminEmail(session.user.email || "admin@karyadigital.id");
        setAuthChecking(false);
        loadDashboardData();
        return;
      }

      if (isMounted) {
        router.replace("/login");
      }
    }

    verifyAuthAndLoad();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAdminEmail(session.user.email || "admin@karyadigital.id");
        setAuthChecking(false);
      } else {
        router.replace("/login");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function loadDashboardData() {
    setLoading(true);
    const [prodRes, ordRes] = await Promise.all([
      fetchProducts(false),
      fetchOrders(),
    ]);
    setProducts(prodRes.products);
    setOrders(ordRes.orders);
    setLoading(false);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !price || !fileUrl.trim()) {
      setFeedback({
        type: "error",
        message: "Judul produk, harga, dan link akses/file wajib diisi.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const { product } = await addProduct({
        title,
        price: Number(price),
        file_url: fileUrl,
        description:
          description.trim() ||
          "Produk digital eksklusif siap unduh dan akses instan setelah pembayaran lunas.",
        cover_url: coverUrl,
        category,
      });

      setProducts((prev) => [product, ...prev]);
      setTitle("");
      setPrice("");
      setFileUrl("");
      setDescription("");
      setCoverUrl("");
      setFeedback({
        type: "success",
        message: `Produk "${product.title}" berhasil ditambahkan ke etalase!`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Gagal menambahkan produk baru. Silakan coba kembali.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function openEditModal(prod: Product) {
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditPrice(String(prod.price));
    setEditCategory(prod.category || "Produk Digital");
    setEditFileUrl(prod.file_url);
    setEditCoverUrl(prod.cover_url);
    setEditDescription(prod.description);
    setEditIsActive(prod.is_active !== false);
    setEditError("");
  }

  function closeEditModal() {
    if (editSubmitting) return;
    setEditingProduct(null);
    setEditError("");
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editTitle.trim() || !editPrice || !editFileUrl.trim()) {
      setEditError("Judul produk, harga, dan link akses/file wajib diisi.");
      return;
    }

    setEditSubmitting(true);
    setEditError("");

    try {
      const { product: updated } = await updateProduct(editingProduct.id, {
        title: editTitle,
        price: Number(editPrice),
        category: editCategory,
        file_url: editFileUrl,
        cover_url: editCoverUrl,
        description: editDescription,
        is_active: editIsActive,
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updated : p))
      );
      setFeedback({
        type: "success",
        message: `Perubahan pada produk "${updated.title}" berhasil disimpan!`,
      });
      setEditingProduct(null);
    } catch {
      setEditError("Gagal menyimpan perubahan produk. Silakan coba lagi.");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    await removeProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleMarkOrderCompleted(orderId: string) {
    const updated = await updateOrderStatusById(orderId, "completed");
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, ...(updated || {}), status: "completed" }
          : o
      )
    );
  }

  function fillSampleProduct() {
    setTitle(" Kelas Mastering Tailwind CSS & Next.js App Router (Video + Modul)");
    setPrice("125000");
    setFileUrl(
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    );
    setDescription(
      "Paket belajar mandiri berisi modul PDF 150 halaman dan source code studi kasus membangun aplikasi web modern dengan tema kustom."
    );
    setCoverUrl(
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
    );
    setCategory("E-Course & Modul");
    setFeedback(null);
  }

  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  if (authChecking) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="bg-[#FFFFFF] rounded-3xl border border-gray-200 p-8 shadow-sm text-center space-y-3 max-w-sm w-full animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gray-200 mx-auto" />
          <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#800020]/10 text-[#800020]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panel Pengelola Single-Tenant</span>
            </span>
            {adminEmail && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{adminEmail}</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Dashboard Admin Toko Digital
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola produk digital di etalase dan pantau seluruh pesanan masuk secara real-time.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-[#F9FAFB] hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Muat Ulang</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-burgundy-grad shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Etalase</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Produk Aktif
            </span>
            <p className="text-2xl font-extrabold text-gray-900">
              {products.length} Produk
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pesanan Masuk / Lunas
            </span>
            <p className="text-2xl font-extrabold text-gray-900">
              {orders.length}{" "}
              <span className="text-sm font-semibold text-emerald-600">
                ({completedOrders.length} Lunas)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-grad text-white flex items-center justify-center shrink-0 shadow-md shadow-[#800020]/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Pendapatan Lunas
            </span>
            <p className="text-2xl font-extrabold text-[#800020]">
              {formatRupiah(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Utama: Form Tambah Produk (Kiri) & Daftar Pesanan Masuk (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah Produk Baru */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="bg-burgundy-grad px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              <h2 className="text-base font-bold">Tambah Produk Digital Baru</h2>
            </div>
            <button
              type="button"
              onClick={fillSampleProduct}
              className="text-xs font-semibold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors"
            >
              + Isi Contoh
            </button>
          </div>

          <form onSubmit={handleAddProduct} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Judul Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: E-Book Panduan Next.js & Supabase"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99000"
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="E-Book / Template"
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Link Akses / File Produk Digital <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/... atau link file PDF/ZIP"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                URL Gambar Cover (Opsional)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Deskripsi Produk
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan manfaat dan isi paket produk digital..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold border ${
                  feedback.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-burgundy-grad shadow-md shadow-[#800020]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {submitting ? "Menyimpan Produk..." : "Simpan & Terbitkan Produk"}
              </span>
            </button>
          </form>
        </div>

        {/* Daftar Pesanan Masuk */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Daftar Pesanan Masuk
              </h2>
              <p className="text-xs text-gray-500">
                Riwayat transaksi pelanggan beserta status pembayaran & link akses produk
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#800020]/10 text-[#800020]">
              {orders.length} Pesanan
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-800">
                Belum Ada Pesanan Masuk
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Silakan lakukan simulasi pembelian produk dari halaman Etalase untuk melihat pesanan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => {
                const isPaid = order.status === "completed";
                return (
                  <div
                    key={order.id}
                    className="p-5 hover:bg-[#F9FAFB] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>COMPLETED (LUNAS)</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>PENDING</span>
                            </>
                          )}
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                          #{order.id.slice(0, 12)}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900">
                        {order.product?.title ||
                          order.product_title ||
                          "Produk Digital"}
                      </h3>

                      <p className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">
                          {order.customer_name}
                        </span>{" "}
                        • {order.customer_email} • WA: {order.customer_whatsapp}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-extrabold text-[#800020] block">
                          {formatRupiah(order.total_amount)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Kode Unik: +{order.unique_code}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => handleMarkOrderCompleted(order.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-burgundy-grad shadow-sm"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Set Lunas</span>
                          </button>
                        )}
                        <Link
                          href={`/order/${order.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <span>Detail</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daftar Katalog Produk Saat Ini */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Katalog Produk Digital di Etalase
            </h2>
            <p className="text-xs text-gray-500">
              Daftar seluruh produk yang tampil di halaman depan toko
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            Total {products.length} Item
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.cover_url}
                  alt={prod.title}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900">
                      {prod.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        prod.is_active !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {prod.is_active !== false ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {prod.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="font-bold text-[#800020]">
                      {formatRupiah(prod.price)}
                    </span>
                    <a
                      href={prod.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gray-500 hover:text-[#800020] underline"
                    >
                      <span>Cek Link Akses</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(prod)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#800020] bg-[#800020]/5 hover:bg-[#800020]/15 border border-[#800020]/20 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit Produk Digital */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-burgundy-grad px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                <h3 className="text-base font-bold">Edit Produk Digital</h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                aria-label="Tutup modal edit"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateProduct}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Link Akses / File Produk Digital{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={editFileUrl}
                    onChange={(e) => setEditFileUrl(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Gambar Cover
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={editCoverUrl}
                    onChange={(e) => setEditCoverUrl(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Deskripsi Produk
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-gray-200">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Tampilkan Produk di Etalase
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Jika dinonaktifkan, produk tidak akan muncul di halaman utama
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#800020] rounded cursor-pointer"
                />
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {editError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-burgundy-grad shadow-md shadow-[#800020]/20 hover:opacity-95 transition-all disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
