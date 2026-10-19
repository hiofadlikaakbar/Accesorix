import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";

// Keywords that signal admin-restricted inventory queries
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
  const config = useRuntimeConfig(event);

  // ── Supabase admin client (service role) for privileged DB ops ──────────
  const supabaseAdmin = createClient(
    config.supabaseUrl || process.env.SUPABASE_URL!,
    config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // ── Resolve caller identity from Authorization header ───────────────────
  const authHeader = getHeader(event, "authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  let userRole: "admin" | "customer" | "guest" = "guest";
  let userId: string | null = null;

  if (accessToken) {
    // Verify the JWT and get the user without trusting client-sent data
    const { data: { user }, error: authError } =
      await supabaseAdmin.auth.getUser(accessToken);

    if (!authError && user) {
      userId = user.id;
      // Look up role from profiles table (same pattern as AppNavbar.vue)
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      userRole =
        profile?.role === "admin"
          ? "admin"
          : "customer";
    }
  }

  const body = await readBody(event);

  try {
    const userMessage = String(body.message || "").trim();

    // ── Guard: block non-admins from restricted queries ──────────────────
    if (userRole !== "admin" && isAdminRestrictedQuery(userMessage)) {
      return {
        reply:
          "Maaf, saya tidak memiliki akses untuk informasi tersebut. Apakah ada pertanyaan lain seputar produk atau website Accesorix?",
        products: [],
      };
    }

    // ── Fetch product catalogue (always needed) ───────────────────────────
    const { data: allProducts } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        image_url,
        description,
        stock,
        categories(name)
      `,
      )
      .limit(100);

    // ── Build context based on role ───────────────────────────────────────
    let productContext = "";
    let systemPrompt = "";

    if (userRole === "admin") {
      // Admin gets full context including stock levels
      productContext =
        allProducts
          ?.map(
            (p) =>
              `Produk: ${p.name} | Harga: Rp${p.price} | Stok: ${p.stock ?? "tidak diketahui"} unit | Deskripsi: ${p.description || "-"}`,
          )
          .join("\n") || "";

      const lowStockItems = (allProducts || []).filter(
        (p) => typeof p.stock === "number" && p.stock <= 5,
      );
      const lowStockContext =
        lowStockItems.length > 0
          ? `\nPeringatan Stok Rendah:\n${lowStockItems.map((p) => `- ${p.name}: ${p.stock} unit tersisa`).join("\n")}`
          : "\nSemua produk memiliki stok yang cukup.";

      systemPrompt = `
Kamu adalah AI Assistant internal toko aksesoris HP bernama Accesorix, berbicara dengan seorang ADMIN.

Kamu memiliki akses penuh ke data inventori dan dapat membantu admin dengan:
- Mengecek stok produk secara langsung
- Memberikan peringatan jika stok rendah atau habis
- Merekomendasikan produk mana yang perlu di-restock segera

Data Produk & Stok Saat Ini:
${productContext}
${lowStockContext}

Aturan:
- Gunakan bahasa Indonesia profesional namun tetap ramah.
- Jangan gunakan markdown seperti **, ##, atau bullet markdown.
- Jika stok suatu produk <= 5 atau habis, sarankan admin untuk segera melakukan restock.
- Jawab pertanyaan admin secara langsung dan informatif.
`.trim();
    } else {
      // Regular user / guest: no stock info, no admin data
      productContext =
        allProducts
          ?.map(
            (p) =>
              `Produk: ${p.name} | Harga: Rp${p.price} | Deskripsi: ${p.description || "-"}`,
          )
          .join("\n") || "";

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

    // ── Call Mistral ──────────────────────────────────────────────────────
    const client = new Mistral({
      apiKey: config.mistralApiKey || process.env.MISTRAL_API_KEY,
    });

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const rawReply =
      response.choices?.[0]?.message?.content ??
      "Maaf, saya tidak menemukan jawaban.";

    const reply = String(rawReply)
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/\*/g, "")
      .trim();

    // ── Product recommendations (only for non-admin queries) ──────────────
    let recommendedProducts: typeof allProducts = [];

    if (userRole !== "admin") {
      const keywords = userMessage
        .toLowerCase()
        .replace("saya cari", "")
        .replace("cari", "")
        .replace("butuh", "")
        .replace("mau", "")
        .trim();

      const { data: matched } = await supabaseAdmin
        .from("products")
        .select(
          `
          id,
          name,
          slug,
          price,
          image_url,
          description,
          stock,
          categories(name)
        `,
        )
        .or(`name.ilike.%${keywords}%,description.ilike.%${keywords}%`)
        .limit(4);

      recommendedProducts = matched || [];
    }

    return {
      reply,
      products: recommendedProducts,
      // Expose resolved role so the client can react if needed (non-sensitive)
      userRole,
    };
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    return {
      reply: "Maaf, AI sedang mengalami gangguan.",
      products: [],
      userRole,
    };
  }
});
