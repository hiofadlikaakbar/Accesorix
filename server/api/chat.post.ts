import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const userMessage = String(body.message || "").trim();

    // Semua produk untuk konteks AI
    const { data: allProducts } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        image_url,
        description,
        categories(name)
      `,
      )
      .limit(50);

    const productContext =
      allProducts
        ?.map(
          (p) =>
            `Produk: ${p.name}, Harga: Rp${p.price}, Deskripsi: ${p.description || "-"}`,
        )
        .join("\n") || "";

    const client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `
Kamu adalah AI Assistant toko aksesoris HP bernama Accesorix.

Jawab hanya berdasarkan produk yang tersedia.

${productContext}

Aturan:
- Jangan mengarang produk.
- Gunakan bahasa Indonesia santai.
- Jangan gunakan markdown seperti **, ##, atau bullet markdown.
- Jika ada produk cocok, rekomendasikan dengan ramah.
- Jika tidak ada produk cocok, beri tahu dengan jujur.
`,
        },
        {
          role: "user",
          content: userMessage,
        },
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

    // Cari produk berdasarkan kata yang diketik user
    const keywords = userMessage
      .toLowerCase()
      .replace("saya cari", "")
      .replace("cari", "")
      .replace("butuh", "")
      .replace("mau", "")
      .trim();

    const { data: recommendedProducts } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        image_url,
        description,
        categories(name)
      `,
      )
      .or(`name.ilike.%${keywords}%,description.ilike.%${keywords}%`)
      .limit(4);

    return {
      reply,
      products: recommendedProducts || [],
    };
  } catch (error) {
    console.error("CHATBOT ERROR:", error);

    return {
      reply: "Maaf, AI sedang mengalami gangguan.",
      products: [],
    };
  }
});
