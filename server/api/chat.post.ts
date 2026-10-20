import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// Helper to abort or reject operations after a specified timeout
function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  errorMessage = "Request timed out",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([
    Promise.resolve(promise).finally(() => clearTimeout(timer)),
    timeoutPromise,
  ]);
}

// Keywords that signal admin restricted inventory queries
const ADMIN_RESTRICTED_KEYWORDS = [
  "stok",
  "stock",
  "inventori",
  "inventory",
  "kehabisan",
  "restock",
  "jumlah produk",
  "sisa produk",
  "gudang",
  "warehouse",
  "berapa unit",
  "unit tersisa",
  "manajemen",
  "laporan penjualan",
  "data penjualan",
];

function isAdminRestrictedQuery(message: string): boolean {
  const lower = message.toLowerCase();
  return ADMIN_RESTRICTED_KEYWORDS.some((kw) => lower.includes(kw));
}

export default defineEventHandler(async (event) => {
  console.time("chat-handler");
  console.log("[1] Start handling request");

  let userRole: "admin" | "customer" | "guest" = "guest";

  try {
    const config = useRuntimeConfig(event);

    const supabaseAdmin = createClient(
      config.supabaseUrl || process.env.SUPABASE_URL!,
      config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const authHeader = getHeader(event, "authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (accessToken) {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabaseAdmin.auth.getUser(accessToken);

        if (!authError && user) {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          userRole = profile?.role === "admin" ? "admin" : "customer";
        }
      } catch (authErr) {
        console.warn("Auth check warning:", authErr);
      }
    }

    const body = await readBody(event);
    const userMessage = String(body?.message || "").trim();

    if (!userMessage) {
      return {
        reply: "Halo! Ada yang bisa saya bantu terkait produk Accesorix?",
        products: [],
        userRole,
      };
    }

    // Guard block non-admins from restricted queries
    if (userRole !== "admin" && isAdminRestrictedQuery(userMessage)) {
      return {
        reply:
          "Maaf, saya tidak memiliki akses untuk informasi tersebut. Apakah ada pertanyaan lain seputar produk atau website Accesorix?",
        products: [],
        userRole,
      };
    }

    // Fetch product catalogue - optimized: only select necessary columns
    console.log("[2] Fetching Supabase products...");
    const { data: productsData, error: productsError } = await withTimeout(
      supabaseAdmin
        .from("products")
        .select("name, price, stock, description")
        .limit(100),
      8000,
      "Supabase products fetch timed out after 8s",
    );

    if (productsError) {
      throw productsError;
    }

    const products = productsData || [];
    console.log("[3] Products fetched successfully:", products?.length);

    // Format real-time stock summary from database
    let productsStockList = "";
    if (products.length === 0) {
      productsStockList =
        "Tidak ada data produk di database (0 unit / STOK HABIS)";
    } else {
      productsStockList = products
        .map((p) => {
          const stock = Number(p.stock ?? 0);
          if (stock <= 0) {
            return `- ${p.name}: 0 unit (STOK HABIS)`;
          }
          return `- ${p.name}: ${stock} unit`;
        })
        .join("\n");
    }

    const productsSummary = `DATA STOK REALTIME DARI DATABASE SUPABASE:\n${productsStockList}`;

    // Build context based on role
    let productContext = "";
    let systemPrompt = "";

    if (userRole === "admin") {
      systemPrompt =
        `SYSTEM INSTRUCTION: You are Accesorix AI. Below is the EXACT real-time stock inventory fetched directly from the database:
---
${productsSummary}
---
CRITICAL RULE: Rely strictly and 100% ONLY on the inventory list above. Do NOT assume or invent any stock numbers. If a product has 0 stock or the list shows out of stock, explicitly inform the admin that the item is OUT OF STOCK / KOSONG and needs restocking immediately.

Aturan Tambahan:
- Gunakan bahasa Indonesia profesional dan ramah.
- Jangan gunakan markdown seperti **, ##, atau bullet markdown.
- Jawab pertanyaan admin secara jujur dan akurat berdasarkan data inventori di atas.`.trim();
    } else {
      // Regular user / guest: no stock info, no admin data
      productContext =
        products
          .map((p) => {
            const desc = p.description
              ? String(p.description).replace(/\s+/g, " ").slice(0, 300).trim()
              : "-";
            return `Produk: ${p.name} | Harga: Rp${Number(p.price || 0).toLocaleString("id-ID")} | Deskripsi: ${desc}`;
          })
          .join("\n") || "Belum ada produk yang tersedia.";

      const roleContext =
        userRole === "customer"
          ? "Pengguna ini sudah login sebagai pelanggan terdaftar."
          : "Pengguna ini adalah pengunjung (belum login).";

      systemPrompt = `
Kamu adalah AI Assistant toko aksesoris HP bernama Accesorix.
${roleContext}

Jawab hanya berdasarkan produk yang tersedia dan informasi umum tentang website Accesorix.

${productContext}

Aturan:
- Jangan mengarang produk.
- Gunakan bahasa Indonesia santai.
- Jangan gunakan markdown seperti **, ##, atau bullet markdown.
- Jika ada produk cocok, rekomendasikan dengan ramah.
- Jika tidak ada produk cocok, beri tahu dengan jujur.
- JANGAN menjawab pertanyaan tentang stok internal, data inventori, laporan penjualan, atau informasi backend toko. Untuk pertanyaan semacam itu, tolak dengan sopan.
`.trim();
    }

    // Call Google Gemini API
    console.log("[4] Sending prompt to Gemini API...");

    const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server");
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `${systemPrompt}\n\nPertanyaan pengguna: ${userMessage}`,
      }),
      15000,
      "Gemini API request timed out after 15s",
    );

    console.log("[5] Gemini response received!");

    const rawReply = response.text ?? "Maaf, saya tidak menemukan jawaban.";

    const reply = String(rawReply)
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/\*/g, "")
      .trim();

    // Product recommendations (only for non-admin queries)
    let recommendedProducts: any[] = [];

    if (userRole !== "admin") {
      try {
        const keywords = userMessage
          .toLowerCase()
          .replace(/[^\w\s]/gi, " ")
          .replace(/\b(saya|cari|butuh|mau|tolong|ada|apakah|bisa|rekomendasi)\b/gi, "")
          .trim();

        if (keywords.length >= 2) {
          const { data: matched } = await supabaseAdmin
            .from("products")
            .select("id, name, slug, price, image_url, stock")
            .or(`name.ilike.%${keywords}%,description.ilike.%${keywords}%`)
            .limit(4);

          recommendedProducts = matched || [];
        }
      } catch (recErr) {
        console.warn("Product recommendation error (non-fatal):", recErr);
      }
    }

    return {
      reply,
      products: recommendedProducts,
      userRole,
    };
  } catch (err: any) {
    console.error("CHATBOT ERROR:", err);

    return {
      error: "Terjadi kesalahan pada server AI.",
      reply: "Maaf, AI sedang mengalami gangguan atau waktu tunggu habis. Silakan coba sesaat lagi.",
      products: [],
      userRole,
    };
  } finally {
    console.timeEnd("chat-handler");
  }
});
