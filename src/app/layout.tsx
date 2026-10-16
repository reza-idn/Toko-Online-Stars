import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, LayoutDashboard, ShoppingBag, ShieldCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaryaDigital — Etalase Produk Digital Eksklusif",
  description:
    "Platform jual produk digital Single-Tenant modern dengan pengiriman akses instan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-900 selection:bg-[#800020] selection:text-white">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-burgundy-grad flex items-center justify-center text-white shadow-md shadow-[#800020]/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-gray-900">
                  Karya<span className="text-[#800020]">Digital</span>
                </span>
                <span className="block text-[11px] text-gray-500 font-medium -mt-0.5">
                  Official Digital Storefront
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-[#800020] hover:bg-[#800020]/5 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Etalase</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white bg-burgundy-grad shadow-sm hover:shadow-md transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-[#FFFFFF] border-t border-gray-200/80 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#800020]"></span>
              <span className="font-semibold text-gray-800">KaryaDigital</span>
              <span>— Single-Tenant Digital Product Store</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#800020]" />
              <span>Akses Instan 24/7 • Pembayaran Transfer Bank Syariah Indonesia (BSI)</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
