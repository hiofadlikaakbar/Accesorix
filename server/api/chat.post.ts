import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // ambil produk dari database
    const { data: products } = await supabase
      .from("products")
      .select("name, price, description")
      .limit(20);

    const productContext = products
      ?.map(
        (p) =>
          `Produk: ${p.name}, Harga: Rp${p.price}, Deskripsi: ${p.description}`,
      )
      .join("\n");

    const client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `
Kamu adalah AI assistant toko aksesoris HP bernama Accesorix.

Jawab HANYA berdasarkan data produk berikut:

${productContext}

Tugas:
- rekomendasikan produk dari database
- jangan mengarang produk
- gunakan bahasa santai modern
- bantu user memilih barang
          `,
        },
        {
          role: "user",
          content: body.message,
        },
      ],
    });

    return {
      reply:
        response.choices?.[0]?.message?.content ||
        "AI tidak memberikan jawaban.",
    };
  } catch (err) {
    console.error(err);

    return {
      reply: "Maaf, AI sedang mengalami gangguan.",
    };
  }
});
