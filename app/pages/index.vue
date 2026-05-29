<template>
  <div class="bg-ghost">
    <section
      class="relative max-w-6xl mx-auto px-6 pt-24 pb-16 lg:pt-20 lg:pb-24 min-h-screen lg:min-h-0 flex items-center"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Teks -->
        <div class="space-y-6 text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-ghost-200 shadow-(--shadow-soft)"
          >
            <span class="w-2 h-2 rounded-full bg-ink animate-pulse"></span>
            <span class="font-body text-xs text-ink-500 tracking-wide"
              >Aksesori Terbaru Sudah Hadir</span
            >
          </div>

          <h1
            class="font-display text-4xl lg:text-6xl text-ink leading-tight tracking-tight"
          >
            Lengkapi
            <span class="relative inline-block">
              Gadget
              <svg
                class="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M2 6 Q100 1 198 6"
                  stroke="#0f0f0f"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <br />Kamu
          </h1>

          <p class="font-body text-ink-500 text-base leading-relaxed max-w-sm">
            Temukan aksesori HP terbaik — dari case, charger, earphone, hingga
            pelindung layar. Semua dalam satu tempat.
          </p>

          <div class="flex items-center gap-3 pt-2">
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-ink text-ghost font-body text-sm font-medium shadow-(--shadow-btn) hover:bg-ink-800 active:scale-[0.98] transition-all duration-200"
            >
              <i class="fa-solid fa-arrow-right text-xs"></i>
              Lihat Semua Produk
            </NuxtLink>
            <NuxtLink
              to="/categories"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-ghost-300 text-ink font-body text-sm hover:border-ink hover:bg-white transition-all duration-200"
            >
              Kategori
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div
            class="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8 pt-4 border-t border-ghost-200"
          >
            <!-- Produk -->
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-ghost flex items-center justify-center"
              >
                <i class="fa-solid fa-box text-ink text-sm"></i>
              </div>
              <div>
                <p class="font-display text-2xl text-ink leading-none">100</p>
                <p class="font-body text-xs text-ink-300 mt-0.5">
                  Produk Tersedia
                </p>
              </div>
            </div>

            <div class="hidden lg:block w-px h-8 bg-ghost-200"></div>

            <!-- Pelanggan -->
            <div
              class="flex items-center justify-center lg:justify-start gap-3"
            >
              <div
                class="w-10 h-10 rounded-full bg-ghost flex items-center justify-center"
              >
                <i class="fa-solid fa-users text-ink text-sm"></i>
              </div>
              <div>
                <p class="font-display text-2xl text-ink leading-none">1000</p>
                <p class="font-body text-xs text-ink-300 mt-0.5">
                  Pelanggan Puas
                </p>
              </div>
            </div>

            <div class="w-px h-8 bg-ghost-200"></div>

            <!-- Rating -->
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-ghost flex items-center justify-center"
              >
                <i class="fa-solid fa-star text-ink text-sm"></i>
              </div>
              <div>
                <p class="font-display text-2xl text-ink leading-none">4.4</p>
                <p class="font-body text-xs text-ink-300 mt-0.5">Rating Toko</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Gambar Produk -->
        <div class="relative hidden lg:block">
          <!-- Background blob -->
          <div
            class="absolute inset-0 bg-white rounded-(--radius-xl) shadow-(--shadow-card)"
          ></div>

          <!-- Grid gambar produk dummy -->
          <div class="relative p-8 grid grid-cols-2 gap-4">
            <div
              v-for="(item, i) in heroProducts"
              :key="i"
              class="group bg-ghost rounded-(--radius-lg) p-5 flex flex-col items-center gap-3 hover:bg-white hover:shadow-(--shadow-soft) transition-all duration-300 cursor-pointer"
              :class="i === 1 ? 'mt-6' : i === 3 ? '-mt-6' : ''"
            >
              <div
                class="w-16 h-16 rounded-md flex items-center justify-center"
                :class="item.bg"
              >
                <i
                  :class="item.icon"
                  class="text-2xl"
                  :style="{ color: item.color }"
                ></i>
              </div>
              <div class="text-center">
                <p class="font-body text-xs font-medium text-ink">
                  {{ item.name }}
                </p>
                <p class="font-body text-xs text-ink-300 mt-0.5">
                  {{ item.price }}
                </p>
              </div>
            </div>
          </div>

          <!-- Badge floating -->
          <div
            class="absolute -top-4 -right-4 bg-ink text-ghost px-4 py-2 rounded-full shadow-(--shadow-btn)"
          >
            <p class="font-body text-xs font-medium">✦ New Arrival</p>
          </div>
          <div
            class="absolute -bottom-4 -left-4 bg-white border border-ghost-200 px-4 py-2.5 rounded-md shadow-(--shadow-card) flex items-center gap-2.5"
          >
            <div
              class="w-8 h-8 rounded-full bg-ink flex items-center justify-center"
            >
              <i class="fa-solid fa-bolt text-ghost text-xs"></i>
            </div>
            <div>
              <p class="font-body text-xs font-medium text-ink">
                AI Rekomendasi
              </p>
              <p class="font-body text-[10px] text-ink-300">
                Dipilihkan untukmu
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== KATEGORI ===== -->
    <section class="max-w-6xl mx-auto px-6 py-12">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
          >
            Jelajahi
          </p>
          <h2 class="font-display text-2xl lg:text-3xl text-ink">Kategori</h2>
        </div>
        <NuxtLink
          to="/categories"
          class="hidden md:flex items-center gap-2 font-body text-sm text-ink-500 hover:text-ink transition-colors"
        >
          Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/categories/${cat.slug}`"
          class="group bg-white rounded-(--radius-lg) p-4 flex flex-col items-center gap-3 border border-ghost-200 hover:border-ink hover:shadow-(--shadow-soft) transition-all duration-200 cursor-pointer"
        >
          <div
            class="w-12 h-12 rounded-md flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            :class="cat.bg"
          >
            <i
              :class="cat.icon"
              class="text-xl"
              :style="{ color: cat.color }"
            ></i>
          </div>
          <p
            class="font-body text-xs font-medium text-ink text-center leading-tight"
          >
            {{ cat.name }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- ===== AI REKOMENDASI — PRODUK BARU ===== -->
    <section class="max-w-6xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink mb-3"
          >
            <i
              class="fa-solid fa-wand-magic-sparkles text-ghost text-[10px]"
            ></i>
            <span
              class="font-body text-[10px] text-ghost tracking-wide uppercase"
              >AI Rekomendasi</span
            >
          </div>
          <h2 class="font-display text-2xl lg:text-3xl text-ink">
            Produk Baru Untukmu
          </h2>
        </div>
        <NuxtLink
          to="/products?filter=new"
          class="hidden md:flex items-center gap-2 font-body text-sm text-ink-500 hover:text-ink transition-colors"
        >
          Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
        </NuxtLink>
      </div>

      <!-- AI Reason Banner -->
      <div
        class="mb-6 px-5 py-4 rounded-(--radius-lg) bg-white border border-ghost-200 shadow-(--shadow-soft) flex items-start gap-4"
      >
        <div
          class="w-9 h-9 rounded-sm bg-ink flex items-center justify-center shrink-0 mt-0.5"
        >
          <i class="fa-solid fa-robot text-ghost text-sm"></i>
        </div>
        <div>
          <p class="font-body text-sm font-medium text-ink mb-0.5">
            Mengapa produk ini direkomendasikan?
          </p>
          <p class="font-body text-xs text-ink-500 leading-relaxed">
            {{ aiReason }}
          </p>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="product in newProducts"
          :key="product.id"
          class="group bg-white rounded-(--radius-lg) border border-ghost-200 overflow-hidden hover:shadow-(--shadow-card) hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <!-- Image -->

          <div
            class="relative aspect-square flex items-center justify-center overflow-hidden"
            :class="product.image_url ? '' : 'p-6 bg-ghost'"
          >
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              :class="'bg-ghost w-full h-full flex items-center justify-center p-6'"
            >
              <i class="fa-solid fa-image text-4xl text-ink-300"></i>
            </div>
            <span
              class="absolute top-3 left-3 px-2 py-1 rounded-full bg-ink text-ghost font-body text-[10px] font-medium"
            >
              Baru
            </span>
          </div>

          <!-- Info -->
          <div class="p-4 space-y-2.5">
            <div>
              <p
                class="font-body text-[10px] text-ink-300 uppercase tracking-wider mb-1"
              >
                {{ product.category }}
              </p>
              <p
                class="font-body text-sm font-medium text-ink leading-tight line-clamp-2"
              >
                {{ product.name }}
              </p>
            </div>
            <div class="flex items-center justify-between">
              <p class="font-display text-base text-ink">{{ product.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- ===== PRODUK UNGGULAN ===== -->
    <section class="max-w-6xl mx-auto px-6 py-12">
      <div class="flex items-end justify-between mb-8">
        <div>
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
          >
            Pilihan Terbaik
          </p>
          <h2 class="font-display text-2xl lg:text-3xl text-ink">
            Produk Unggulan
          </h2>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="flex items-center gap-4 p-4 bg-white rounded-(--radius-lg) border border-ghost-200 hover:shadow-(--shadow-soft) transition-all duration-200"
        >
          <div
            class="w-14 h-14 rounded-(--radius-md) overflow-hidden shrink-0 border border-ghost-200 bg-ghost"
          >
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div class="w-full h-full flex items-center justify-center" v-else>
              <i class="fa-solid fa-image text-ink-300"></i>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-body text-sm font-medium text-ink truncate">
              {{ product.name }}
            </p>
            <p class="font-body text-xs text-ink-300 mt-0.5">
              {{ product.categories?.name }}
            </p>
          </div>

          <!-- Harga -->
          <div class="text-right">
            <p class="font-display text-sm text-ink">
              Rp {{ Number(product.price).toLocaleString("id-ID") }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- ===== BANNER CTA ===== -->
    <section class="max-w-6xl mx-auto px-6 py-12">
      <div
        class="relative bg-ink rounded-(--radius-xl) px-8 py-12 lg:px-16 overflow-hidden"
      >
        <!-- Decorative circles -->
        <div
          class="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10"
        ></div>
        <div
          class="absolute -bottom-20 -left-10 w-72 h-72 rounded-full border border-white/5"
        ></div>
        <div
          class="absolute top-8 right-32 w-24 h-24 rounded-full bg-white/5"
        ></div>

        <div
          class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div class="space-y-3">
            <p
              class="font-body text-xs text-white/50 uppercase tracking-widest"
            >
              Penawaran Spesial
            </p>
            <h2
              class="font-display text-2xl lg:text-4xl text-white leading-tight"
            >
              Gratis Ongkir<br />untuk Semua Order.
            </h2>
            <p class="font-body text-sm text-white/60 max-w-sm leading-relaxed">
              Belanja minimal Rp150.000 dan nikmati gratis ongkir ke seluruh
              Indonesia. Berlaku hari ini saja!
            </p>
          </div>
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0"
          >
            <NuxtLink
              to="/products"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-white text-ink font-body text-sm font-medium hover:bg-ghost active:scale-[0.98] transition-all duration-200"
            >
              <i class="fa-solid fa-bag-shopping text-xs"></i>
              Belanja Sekarang
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="border-t border-ghost-200 mt-8">
      <div
        class="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-sm bg-ink flex items-center justify-center"
          >
            <i class="fa-solid fa-bolt text-ghost text-[10px]"></i>
          </div>
          <span class="font-display text-base text-ink">accesorix</span>
        </div>
        <p class="font-body text-xs text-ink-300">
          © 2025 Accesorix. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <a
            href="#"
            class="font-body text-xs text-ink-300 hover:text-ink transition-colors"
            >Privasi</a
          >
          <a
            href="#"
            class="font-body text-xs text-ink-300 hover:text-ink transition-colors"
            >Syarat</a
          >
          <a
            href="#"
            class="font-body text-xs text-ink-300 hover:text-ink transition-colors"
            >Kontak</a
          >
        </div>
      </div>
    </footer>
  </div>
  <AppChatbot />
</template>

<script setup>
import AppChatbot from "../components/AppChatBot.vue";
const supabase = useSupabaseClient();

const heroProducts = [
  {
    name: "Case iPhone 15",
    price: "Rp 89.000",
    icon: "fa-solid fa-mobile-screen",
    bg: "bg-blue-50",
    color: "#3b82f6",
  },
  {
    name: "Charger 65W",
    price: "Rp 199.000",
    icon: "fa-solid fa-plug",
    bg: "bg-amber-50",
    color: "#f59e0b",
  },
  {
    name: "TWS Earbuds",
    price: "Rp 349.000",
    icon: "fa-solid fa-headphones",
    bg: "bg-purple-50",
    color: "#8b5cf6",
  },
  {
    name: "Power Bank",
    price: "Rp 279.000",
    icon: "fa-solid fa-battery-full",
    bg: "bg-green-50",
    color: "#10b981",
  },
];

const catStyleMap = {
  "case-cover": {
    icon: "fa-solid fa-mobile-screen",
    bg: "bg-blue-50",
    color: "#3b82f6",
  },
  "charger-kabel": {
    icon: "fa-solid fa-plug",
    bg: "bg-amber-50",
    color: "#f59e0b",
  },
  "earphone-headset": {
    icon: "fa-solid fa-headphones",
    bg: "bg-purple-50",
    color: "#8b5cf6",
  },
  "power-bank": {
    icon: "fa-solid fa-battery-full",
    bg: "bg-green-50",
    color: "#10b981",
  },
  "pelindung-layar": {
    icon: "fa-solid fa-shield",
    bg: "bg-red-50",
    color: "#ef4444",
  },
  "holder-stand": {
    icon: "fa-solid fa-tablet-screen-button",
    bg: "bg-pink-50",
    color: "#ec4899",
  },
};

const categories = ref([]);
const newProducts = ref([]);
const featuredProducts = ref([]);
const aiReason = ref("Memuat rekomendasi...");

async function fetchData() {
  // Fetch categories
  const { data: cats } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  categories.value = (cats || []).map((c) => ({
    ...c,
    ...(catStyleMap[c.slug] || {
      icon: "fa-solid fa-tag",
      bg: "bg-ghost",
      color: "#555",
    }),
  }));

  // Fetch produk baru (is_new = true)
  const { data: newProds } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(4);
  newProducts.value = newProds || [];

  // Fetch produk featured
  const { data: featured } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);
  featuredProducts.value = featured || [];

  aiReason.value =
    "Berdasarkan produk yang baru ditambahkan minggu ini, berikut aksesori terbaru yang paling banyak diminati.";
}

onMounted(fetchData);
</script>
