"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function checkExistingAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.replace("/admin");
        return;
      }

      setCheckingSession(false);
    }

    checkExistingAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg("Mohon isi email dan password terlebih dahulu.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal harus terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes("email not confirmed")
          ) {
            setErrorMsg(
              "Email belum dikonfirmasi di Supabase Auth. Silakan cek inbox email Anda atau matikan fitur 'Confirm Email' di menu Authentication -> Providers -> Email pada dashboard Supabase."
            );
          } else if (
            error.message.toLowerCase().includes("invalid login credentials")
          ) {
            setErrorMsg(
              "Email atau password salah, atau akun belum terdaftar. Silakan pilih tab 'Daftar Admin Baru' terlebih dahulu."
            );
          } else {
            setErrorMsg(error.message);
          }
          setLoading(false);
          return;
        }

        if (data.session) {
          router.replace("/admin");
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          router.replace("/admin");
          return;
        }

        setSuccessMsg(
          "Registrasi berhasil dikirim ke Supabase Auth! Silakan login atau cek inbox email Anda jika verifikasi email diaktifkan."
        );
        setMode("login");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat menghubungi Supabase Auth.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#800020] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Etalase Toko</span>
        </Link>
      </div>

      <div className="bg-[#FFFFFF] rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden">
        {/* Header Burgundy */}
        <div className="bg-burgundy-grad px-6 py-7 text-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Supabase Authentication</span>
          </span>
          <h1 className="text-2xl font-extrabold">Portal Login Admin</h1>
          <p className="text-xs text-white/80 mt-1">
            Masuk menggunakan akun Supabase Auth untuk mengelola produk & pesanan
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-[#F9FAFB] border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === "login"
                ? "bg-[#FFFFFF] text-[#800020] shadow-sm border border-gray-200/80"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk (Login)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === "register"
                ? "bg-[#FFFFFF] text-[#800020] shadow-sm border border-gray-200/80"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Admin Baru</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Admin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@karyadigital.id"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-10 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 leading-relaxed">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 leading-relaxed">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-burgundy-grad shadow-md shadow-[#800020]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>
              {loading
                ? "Memproses Autentikasi..."
                : mode === "login"
                ? "Masuk ke Dashboard Admin"
                : "Daftarkan Akun Admin"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="px-6 py-3.5 bg-[#F9FAFB] border-t border-gray-200/80 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-4 h-4 text-[#800020]" />
          <span>Dilindungi oleh Supabase Auth (`supabase.auth`)</span>
        </div>
      </div>
    </div>
  );
}
