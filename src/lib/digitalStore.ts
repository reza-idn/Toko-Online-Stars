import { supabase } from "./supabaseClient";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  cover_url: string;
  file_url: string;
  category?: string;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  product_title?: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  unique_code: number;
  total_amount: number;
  status: "pending" | "completed" | string;
  created_at: string;
  product?: Product | null;
}

const LOCAL_PRODUCTS_KEY = "digistore_fallback_products_v1";
const LOCAL_ORDERS_KEY = "digistore_fallback_orders_v1";

export const INITIAL_SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    title: "Panduan Lengkap Full-Stack Next.js 15 & Supabase (E-Book PDF)",
    description:
      "E-Book komprehensif 280+ halaman membahas arsitektur aplikasi web modern menggunakan Next.js App Router, Tailwind CSS, dan Supabase dari nol hingga produksi.",
    price: 149000,
    cover_url:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
    file_url:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    category: "E-Book Premium",
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "prod-102",
    title: "UI Kit & Design System SaaS Modern (Figma + Tailwind)",
    description:
      "Koleksi 120+ komponen antarmuka siap pakai dengan tema minimalis elegan, responsif untuk mobile & desktop, lengkap dengan kode React dan konfigurasi Tailwind.",
    price: 199000,
    cover_url:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
    file_url: "https://drive.google.com/drive/u/0/my-drive",
    category: "Design & UI Kit",
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "prod-103",
    title: "Notion Second Brain & Freelance OS Template",
    description:
      "Template produktivitas all-in-one untuk mengelola proyek klien, invoice otomatis, tracker keuangan, serta manajemen jadwal konten kreator digital.",
    price: 89000,
    cover_url:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80",
    file_url: "https://www.notion.so/templates",
    category: "Template Produktivitas",
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "prod-104",
    title: "Source Code Starter Kit Toko Digital & Payment Gateway",
    description:
      "Boilerplate siap pakai untuk membangun toko produk digital instan dengan fitur keranjang, kupon diskon, manajemen lisensi, dan dashboard analitik.",
    price: 249000,
    cover_url:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    file_url: "https://github.com/vercel/next.js",
    category: "Source Code",
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Normalizer agar tetap kompatibel apabila user membuat kolom dengan nama sedikit berbeda di Supabase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProduct(row: any): Product {
  return {
    id: String(row.id),
    title: row.title ?? row.name ?? row.judul ?? "Produk Digital",
    description:
      row.description ??
      row.deskripsi ??
      "Produk digital eksklusif siap unduh dan akses instan setelah pembayaran terverifikasi.",
    price: Number(row.price ?? row.harga ?? 0),
    cover_url:
      row.cover_url ||
      row.image_url ||
      row.thumbnail_url ||
      row.cover ||
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    file_url:
      row.file_url ||
      row.download_url ||
      row.access_url ||
      row.link ||
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    category: row.category ?? row.kategori ?? "Produk Digital",
    is_active:
      row.is_active !== undefined
        ? Boolean(row.is_active)
        : row.active !== undefined
        ? Boolean(row.active)
        : true,
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeOrder(row: any, productsMap?: Map<string, Product>): Order {
  const productId = String(row.product_id ?? "");
  const nestedProduct = row.products ? normalizeProduct(row.products) : productsMap?.get(productId) || null;
  const totalAmount = Number(
    row.total_amount ?? row.amount ?? row.total_price ?? nestedProduct?.price ?? 0
  );
  const uniqueCode = Number(
    row.unique_code ?? row.kode_unik ?? (totalAmount > 0 ? totalAmount % 1000 : 123)
  );

  return {
    id: String(row.id),
    product_id: productId,
    product_title:
      row.product_title ?? nestedProduct?.title ?? "Produk Digital Pilihan",
    customer_name:
      row.customer_name ?? row.buyer_name ?? row.name ?? row.full_name ?? "Pelanggan",
    customer_email:
      row.customer_email ?? row.buyer_email ?? row.email ?? "-",
    customer_whatsapp:
      row.customer_whatsapp ??
      row.customer_phone ??
      row.whatsapp ??
      row.phone ??
      "-",
    unique_code: uniqueCode,
    total_amount: totalAmount,
    status: row.status ?? "pending",
    created_at: row.created_at ?? new Date().toISOString(),
    product: nestedProduct,
  };
}

function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_PRODUCTS;
  try {
    const raw = window.localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      window.localStorage.setItem(
        LOCAL_PRODUCTS_KEY,
        JSON.stringify(INITIAL_SAMPLE_PRODUCTS)
      );
      return INITIAL_SAMPLE_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : INITIAL_SAMPLE_PRODUCTS;
  } catch {
    return INITIAL_SAMPLE_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // ignore storage errors
  }
}

function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore storage errors
  }
}

export async function fetchProducts(onlyActive = false): Promise<{
  products: Product[];
  isFallback: boolean;
  errorMessage?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const local = getLocalProducts();
      return {
        products: onlyActive ? local.filter((p) => p.is_active) : local,
        isFallback: true,
        errorMessage: error.message,
      };
    }

    const normalized = (data || []).map(normalizeProduct);
    return {
      products: onlyActive
        ? normalized.filter((p) => p.is_active)
        : normalized,
      isFallback: false,
    };
  } catch (err) {
    const local = getLocalProducts();
    return {
      products: onlyActive ? local.filter((p) => p.is_active) : local,
      isFallback: true,
      errorMessage: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function addProduct(input: {
  title: string;
  description: string;
  price: number;
  cover_url: string;
  file_url: string;
  category?: string;
}): Promise<{ product: Product; isFallback: boolean }> {
  const defaultCover =
    input.cover_url.trim() ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80";

  // Coba insert ke Supabase dengan payload lengkap
  const fullPayload = {
    title: input.title.trim(),
    description:
      input.description.trim() ||
      "Produk digital eksklusif siap unduh dan akses instan.",
    price: Number(input.price),
    cover_url: defaultCover,
    file_url: input.file_url.trim(),
    category: input.category?.trim() || "Produk Digital",
    is_active: true,
  };

  const { data, error } = await supabase
    .from("products")
    .insert([fullPayload])
    .select("*")
    .single();

  if (!error && data) {
    return { product: normalizeProduct(data), isFallback: false };
  }

  // Jika tabel ada tapi kolom opsional seperti category belum ada, coba payload minimal
  if (error && error.code === "PGRST204") {
    const minimalPayload = {
      title: input.title.trim(),
      description:
        input.description.trim() ||
        "Produk digital eksklusif siap unduh dan akses instan.",
      price: Number(input.price),
      cover_url: defaultCover,
      file_url: input.file_url.trim(),
      is_active: true,
    };
    const retry = await supabase
      .from("products")
      .insert([minimalPayload])
      .select("*")
      .single();

    if (!retry.error && retry.data) {
      return { product: normalizeProduct(retry.data), isFallback: false };
    }
  }

  // Fallback ke localStorage jika tabel Supabase belum dibuat
  const newProduct: Product = {
    id: `local-${Date.now()}`,
    title: fullPayload.title,
    description: fullPayload.description,
    price: fullPayload.price,
    cover_url: fullPayload.cover_url,
    file_url: fullPayload.file_url,
    category: fullPayload.category,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  const current = getLocalProducts();
  saveLocalProducts([newProduct, ...current]);
  return { product: newProduct, isFallback: true };
}

export async function updateProduct(
  id: string,
  input: {
    title: string;
    description: string;
    price: number;
    cover_url: string;
    file_url: string;
    category?: string;
    is_active?: boolean;
  }
): Promise<{ product: Product; isFallback: boolean }> {
  const defaultCover =
    input.cover_url.trim() ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80";

  const fullPayload = {
    title: input.title.trim(),
    description:
      input.description.trim() ||
      "Produk digital eksklusif siap unduh dan akses instan.",
    price: Number(input.price),
    cover_url: defaultCover,
    file_url: input.file_url.trim(),
    category: input.category?.trim() || "Produk Digital",
    is_active: input.is_active !== undefined ? input.is_active : true,
  };

  if (!id.startsWith("local-") && !id.startsWith("prod-")) {
    const { data, error } = await supabase
      .from("products")
      .update(fullPayload)
      .eq("id", id)
      .select("*")
      .single();

    if (!error && data) {
      return { product: normalizeProduct(data), isFallback: false };
    }

    if (error && error.code === "PGRST204") {
      const minimalPayload = {
        title: fullPayload.title,
        description: fullPayload.description,
        price: fullPayload.price,
        cover_url: fullPayload.cover_url,
        file_url: fullPayload.file_url,
        is_active: fullPayload.is_active,
      };
      const retry = await supabase
        .from("products")
        .update(minimalPayload)
        .eq("id", id)
        .select("*")
        .single();

      if (!retry.error && retry.data) {
        return { product: normalizeProduct(retry.data), isFallback: false };
      }
    }
  }

  const current = getLocalProducts();
  const updatedProduct: Product = {
    id,
    title: fullPayload.title,
    description: fullPayload.description,
    price: fullPayload.price,
    cover_url: fullPayload.cover_url,
    file_url: fullPayload.file_url,
    category: fullPayload.category,
    is_active: fullPayload.is_active,
    created_at:
      current.find((p) => p.id === id)?.created_at || new Date().toISOString(),
  };

  saveLocalProducts(
    current.map((p) => (p.id === id ? updatedProduct : p))
  );
  return { product: updatedProduct, isFallback: true };
}

export async function removeProduct(id: string): Promise<void> {
  if (!id.startsWith("local-") && !id.startsWith("prod-")) {
    await supabase.from("products").delete().eq("id", id);
  }
  const current = getLocalProducts();
  saveLocalProducts(current.filter((p) => p.id !== id));
}

export async function createOrderRecord(input: {
  product: Product;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  unique_code: number;
  total_amount: number;
  status: "pending" | "completed";
}): Promise<{ order: Order; isFallback: boolean }> {
  const isUuidProduct =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input.product.id
    );

  // 1. Coba simpan ke tabel orders di Supabase
  if (isUuidProduct || !input.product.id.startsWith("prod-")) {
    const fullOrderPayload: Record<string, unknown> = {
      product_id: input.product.id,
      product_title: input.product.title,
      customer_name: input.customer_name.trim(),
      customer_email: input.customer_email.trim(),
      customer_whatsapp: input.customer_whatsapp.trim(),
      unique_code: input.unique_code,
      total_amount: input.total_amount,
      status: input.status,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([fullOrderPayload])
      .select("*")
      .single();

    if (!error && data) {
      const order = normalizeOrder(data);
      order.product = input.product;
      // Simpan salinan lokal untuk jaminan akses cepat di halaman /order/[id]
      const localOrders = getLocalOrders();
      saveLocalOrders([order, ...localOrders.filter((o) => o.id !== order.id)]);
      return { order, isFallback: false };
    }

    // Jika ada kolom tambahan (misal product_title atau unique_code) yang tidak ada di skema kustom user
    if (error && error.code === "PGRST204") {
      const minimalOrderPayload = {
        product_id: input.product.id,
        customer_name: input.customer_name.trim(),
        customer_email: input.customer_email.trim(),
        customer_whatsapp: input.customer_whatsapp.trim(),
        total_amount: input.total_amount,
        status: input.status,
      };
      const retry = await supabase
        .from("orders")
        .insert([minimalOrderPayload])
        .select("*")
        .single();

      if (!retry.error && retry.data) {
        const order = normalizeOrder(retry.data);
        order.product = input.product;
        order.unique_code = input.unique_code;
        const localOrders = getLocalOrders();
        saveLocalOrders([order, ...localOrders.filter((o) => o.id !== order.id)]);
        return { order, isFallback: false };
      }
    }
  }

  // 2. Fallback ke localStorage jika tabel Supabase belum di-setup
  const fallbackOrder: Order = {
    id: `ord-${Date.now().toString(36)}-${Math.floor(100 + Math.random() * 900)}`,
    product_id: input.product.id,
    product_title: input.product.title,
    customer_name: input.customer_name.trim(),
    customer_email: input.customer_email.trim(),
    customer_whatsapp: input.customer_whatsapp.trim(),
    unique_code: input.unique_code,
    total_amount: input.total_amount,
    status: input.status,
    created_at: new Date().toISOString(),
    product: input.product,
  };

  const localOrders = getLocalOrders();
  saveLocalOrders([fallbackOrder, ...localOrders]);
  return { order: fallbackOrder, isFallback: true };
}

export async function updateOrderStatusById(
  orderId: string,
  status: "pending" | "completed"
): Promise<Order | null> {
  // Update di Supabase jika memungkinkan
  if (!orderId.startsWith("ord-")) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("*")
      .single();

    if (!error && data) {
      const updated = normalizeOrder(data);
      const localOrders = getLocalOrders();
      const existing = localOrders.find((o) => o.id === orderId);
      if (existing?.product) {
        updated.product = existing.product;
      }
      saveLocalOrders([
        updated,
        ...localOrders.filter((o) => o.id !== orderId),
      ]);
      return updated;
    }
  }

  // Update di localStorage
  const localOrders = getLocalOrders();
  const idx = localOrders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    localOrders[idx] = { ...localOrders[idx], status };
    saveLocalOrders(localOrders);
    return localOrders[idx];
  }
  return null;
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const { products } = await fetchProducts(false);
  const productsMap = new Map(products.map((p) => [p.id, p]));

  if (!orderId.startsWith("ord-")) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!error && data) {
      const normalized = normalizeOrder(data, productsMap);
      if (!normalized.product) {
        const localMatch = getLocalOrders().find((o) => o.id === orderId);
        if (localMatch?.product) normalized.product = localMatch.product;
      }
      return normalized;
    }
  }

  const localOrders = getLocalOrders();
  const found = localOrders.find((o) => o.id === orderId);
  if (found) {
    if (!found.product && found.product_id) {
      found.product = productsMap.get(found.product_id) || null;
    }
    return found;
  }
  return null;
}

export async function fetchOrders(): Promise<{
  orders: Order[];
  isFallback: boolean;
}> {
  const { products } = await fetchProducts(false);
  const productsMap = new Map(products.map((p) => [p.id, p]));

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { orders: getLocalOrders(), isFallback: true };
    }

    const supaOrders = (data || []).map((row) =>
      normalizeOrder(row, productsMap)
    );
    return { orders: supaOrders, isFallback: false };
  } catch {
    return { orders: getLocalOrders(), isFallback: true };
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
