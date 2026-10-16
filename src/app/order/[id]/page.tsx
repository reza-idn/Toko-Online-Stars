"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ArrowLeft,
  Zap,
  ShieldCheck,
  FileText,
  User,
  Mail,
  Phone,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import {
  Order,
  fetchOrderById,
  updateOrderStatusById,
  formatRupiah,
} from "@/lib/digitalStore";

const BSI_ACCOUNT_NUMBER = "7198 4520 88";
const BSI_ACCOUNT_HOLDER = "PT Karya Digital Nusantara";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    loadOrder(orderId);
  }, [orderId]);

  async function loadOrder(id: string) {
    setLoading(true);
    const data = await fetchOrderById(id);
    setOrder(data);
    setLoading(false);
  }

  async function handleSimulatePaid() {
    if (!order) return;
    setUpdating(true);
    const updated = await updateOrderStatusById(order.id, "completed");
    if (updated) {
      setOrder({ ...order, ...updated, product: order.product || updated.product });
    } else {
      setOrder({ ...order, status: "completed" });
    }
    setUpdating(false);
  }

  function handleDownloadReceiptAndAccess() {
    if (!order) return;
    const accessUrl =
      order.product?.file_url ||
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    const content = [
      "==============================================================",
      "         BUKTI PEMBELIAN & AKSES PRODUK DIGITAL RESMI         ",
      "                         KARYADIGITAL                         ",
      "==============================================================",
      "",
      `ID Pesanan       : ${order.id}`,
      `Status Pembayaran: LUNAS (COMPLETED)`,
      `Tanggal Transaksi: ${new Date(order.created_at).toLocaleString("id-ID")}`,
      "",
      "--- DATA PEMBELI ---",
      `Nama Lengkap     : ${order.customer_name}`,
      `Email            : ${order.customer_email}`,
      `WhatsApp         : ${order.customer_whatsapp}`,
      "",
      "--- PRODUK DIGITAL ---",
      `Nama Produk      : ${order.product?.title || order.product_title}`,
      `Total Dibayar    : ${formatRupiah(order.total_amount)} (Kode Unik: ${order.unique_code})`,
      `Link Akses Utama : ${accessUrl}`,
      "",
      "Terima kasih telah berbelanja di KaryaDigital!",
      "==============================================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Akses-Produk-${order.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyAccessLink(link: string) {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#FFFFFF] rounded-3xl border border-gray-200 p-8 shadow-sm animate-pulse space-y-6">
          <div className="h-16 w-16 bg-gray-200 rounded-2xl mx-auto" />
          <div className="h-7 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-[#FFFFFF] rounded-3xl border border-gray-200 p-10 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Pesanan Tidak Ditemukan
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            ID Pesanan <code className="px-1.5 py-0.5 bg-gray-100 rounded">{orderId}</code> tidak ditemukan dalam sistem.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-burgundy-grad shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Etalase</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = order.status === "completed";
  const productTitle =
    order.product?.title || order.product_title || "Produk Digital Eksklusif";
  const productDesc =
    order.product?.description ||
    "Produk digital siap unduh dan digunakan langsung.";
  const productCover =
    order.product?.cover_url ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80";
  const fileUrl =
    order.product?.file_url ||
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#800020] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Etalase Produk</span>
        </Link>
      </div>

      {/* Main Order Card */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-gray-200/90 shadow-lg overflow-hidden">
        {/* Top Status Header */}
        <div
          className={
            isCompleted
              ? "bg-burgundy-grad px-6 sm:px-8 py-8 text-white text-center"
              : "bg-amber-600 px-6 sm:px-8 py-8 text-white text-center"
          }
        >
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-inner">
            {isCompleted ? (
              <CheckCircle2 className="w-9 h-9 text-white" />
            ) : (
              <Clock className="w-9 h-9 text-white" />
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {isCompleted ? "Pembayaran Lunas (Completed)" : "Menunggu Pembayaran (Pending)"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            {isCompleted
              ? "Terima Kasih! Pesanan Anda Sudah Lunas"
              : "Menunggu Konfirmasi Pembayaran"}
          </h1>
          <p className="text-sm text-white/85 mt-1.5 max-w-lg mx-auto">
            {isCompleted
              ? "Produk digital Anda telah aktif. Silakan unduh file atau buka link akses produk di bawah ini."
              : "Silakan selesaikan transfer ke rekening BSI sesuai nominal kode unik atau klik tombol Simulasi Bayar Lunas untuk demo."}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Jika Sudah Lunas: Box Akses & Download Produk Digital */}
          {isCompleted ? (
            <div className="rounded-2xl bg-[#F9FAFB] border-2 border-[#800020]/20 p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productCover}
                  alt={productTitle}
                  className="w-full sm:w-24 h-36 sm:h-24 rounded-xl object-cover border border-gray-200 shrink-0"
                />
                <div className="flex-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#800020] bg-[#800020]/10 px-2.5 py-0.5 rounded-full">
                    Akses Produk Terbuka
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">
                    {productTitle}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {productDesc}
                  </p>
                </div>
              </div>

              {/* Link Akses Preview */}
              <div className="bg-[#FFFFFF] rounded-xl border border-gray-200 px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="truncate text-xs text-gray-600">
                  <span className="font-semibold text-gray-800 mr-1.5">
                    Link Akses:
                  </span>
                  <span className="font-mono text-[#800020]">{fileUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyAccessLink(fileUrl)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tombol Unduh File & Buka Link Akses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-burgundy-grad shadow-md shadow-[#800020]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File / Buka Akses Produk</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadReceiptAndAccess}
                  className="py-3.5 px-5 rounded-xl font-bold text-sm text-[#800020] bg-[#FFFFFF] hover:bg-[#800020]/5 border border-[#800020]/30 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Unduh Bukti & Lisensi (.txt)</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Link unduhan aktif permanen untuk akun email Anda
                </span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#800020] hover:underline"
                >
                  <span>Tab Baru</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            /* Jika Masih Pending: Instruksi Transfer + Tombol Simulasi Bayar Lunas */
            <div className="rounded-2xl bg-[#F9FAFB] border border-amber-300 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                    Instruksi Pembayaran Transfer BSI
                  </span>
                  <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                    BSI {BSI_ACCOUNT_NUMBER}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      (a.n. {BSI_ACCOUNT_HOLDER})
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">
                    Total Nominal + Kode Unik
                  </span>
                  <span className="text-lg font-extrabold text-[#800020]">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={updating}
                onClick={handleSimulatePaid}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-burgundy-grad shadow-lg shadow-[#800020]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Zap className="w-4 h-4" />
                <span>
                  {updating
                    ? "Memverifikasi Pembayaran..."
                    : "Simulasi Bayar Lunas Sekarang (Buka Link Download)"}
                </span>
              </button>
            </div>
          )}

          {/* Ringkasan Informasi Pesanan */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Rincian Transaksi & Data Pembeli
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F9FAFB] rounded-2xl p-4 border border-gray-200/80 text-sm">
              <div className="space-y-2.5">
                <div>
                  <span className="text-xs text-gray-400 block">ID Pesanan</span>
                  <span className="font-mono text-xs font-semibold text-gray-800">
                    {order.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 block">
                      Nama Pembeli
                    </span>
                    <span className="font-semibold text-gray-900">
                      {order.customer_name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 block">Email</span>
                    <span className="font-medium text-gray-800">
                      {order.customer_email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 block">
                      Nomor WhatsApp
                    </span>
                    <span className="font-medium text-gray-800">
                      {order.customer_whatsapp}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">
                    Kode Unik Transfer (3 Digit)
                  </span>
                  <span className="font-bold text-[#800020]">
                    +{order.unique_code}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">
                    Total Pembayaran
                  </span>
                  <span className="text-base font-extrabold text-gray-900">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
