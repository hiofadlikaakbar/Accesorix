<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-6xl mx-auto px-6 py-10">
      <!-- Loading -->
      <div v-if="loading" class="animate-pulse space-y-8">
        <div class="h-4 bg-white rounded w-48"></div>
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 bg-white rounded-[var(--radius-lg)]"></div>
          <div class="space-y-2">
            <div class="h-8 bg-white rounded w-48"></div>
            <div class="h-3 bg-white rounded w-24"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="i in 8"
            :key="i"
            class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 overflow-hidden"
          >
            <div class="aspect-square bg-ghost"></div>
            <div class="p-4 space-y-2">
              <div class="h-3 bg-ghost rounded w-1/3"></div>
              <div class="h-4 bg-ghost rounded w-3/4"></div>
              <div class="h-4 bg-ghost rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else-if="!category" class="py-20 text-center">
        <div
          class="w-16 h-16 rounded-full bg-white border border-ghost-200 flex items-center justify-center mx-auto mb-4"
        >
          <i class="fa-solid fa-folder-open text-2xl text-ink-300"></i>
        </div>
        <h1 class="font-display text-2xl text-ink mb-2">
          Kategori Tidak Ditemukan
        </h1>
        <p class="font-body text-sm text-ink-500 mb-6">
          Kategori yang kamu cari tidak ada.
        </p>
        <NuxtLink
          to="/categories"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium hover:bg-ink-800 transition-all duration-200"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
          Semua Kategori
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Breadcrumb -->
        <div
          class="flex items-center gap-2 mb-8 font-body text-xs text-ink-300"
        >
          <NuxtLink to="/" class="hover:text-ink transition-colors"
            >Beranda</NuxtLink
          >
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <NuxtLink to="/categories" class="hover:text-ink transition-colors"
            >Kategori</NuxtLink
          >
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <span class="text-ink">{{ category.name }}</span>
        </div>

        <!-- Category Header -->
        <div
          class="flex items-center gap-5 mb-10 bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] p-6"
        >
          <div
            class="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0"
            :class="style.bg"
          >
            <i
              :class="style.icon"
              class="text-3xl"
              :style="{ color: style.color }"
            ></i>
          </div>
          <div class="flex-1">
            <h1 class="font-display text-2xl lg:text-3xl text-ink">
              {{ category.name }}
            </h1>
            <p class="font-body text-xs text-ink-300 mt-1">
              {{ products.length }} produk tersedia
            </p>
          </div>
          <NuxtLink
            to="/categories"
            class="hidden md:flex items-center gap-2 font-body text-xs text-ink-500 hover:text-ink transition-colors"
          >
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            Semua Kategori
          </NuxtLink>
        </div>

        <!-- Sort Bar -->
        <div class="flex items-center justify-between gap-4 mb-6">
          <p class="font-body text-xs text-ink-300">
            Menampilkan
            <span class="text-ink font-medium">{{
              sortedProducts.length
            }}</span>
            produk
          </p>
          <select
            v-model="sortBy"
            class="px-4 py-2 rounded-[var(--radius-md)] bg-white border border-ghost-300 text-ink font-body text-xs focus:outline-none focus:border-ink transition-all duration-200"
          >
            <option value="created_at_desc">Terbaru</option>
            <option value="price_asc">Harga: Termurah</option>
            <option value="price_desc">Harga: Termahal</option>
            <option value="name_asc">Nama: A–Z</option>
          </select>
        </div>

        <!-- Empty -->
        <div
          v-if="sortedProducts.length === 0"
          class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-16 text-center"
        >
          <div
            class="w-16 h-16 rounded-full bg-ghost flex items-center justify-center mx-auto mb-4"
          >
            <i class="fa-solid fa-box-open text-2xl text-ink-300"></i>
          </div>
          <p class="font-body text-sm font-medium text-ink mb-1">
            Belum ada produk
          </p>
          <p class="font-body text-xs text-ink-300">
            Produk di kategori ini belum tersedia.
          </p>
        </div>

        <!-- Product Grid -->
        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <NuxtLink
            v-for="product in sortedProducts"
            :key="product.id"
            :to="`/products/${product.slug}`"
            class="group bg-white rounded-[var(--radius-lg)] border border-ghost-200 overflow-hidden hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
          >
            <!-- Gambar -->
            <div class="relative aspect-square overflow-hidden bg-ghost">
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <i class="fa-solid fa-image text-3xl text-ink-300"></i>
              </div>
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span
                  v-if="product.is_new"
                  class="px-2 py-0.5 rounded-full bg-ink text-ghost font-body text-[10px] font-medium"
                >
                  Baru
                </span>
                <span
                  v-if="product.is_featured"
                  class="px-2 py-0.5 rounded-full bg-white border border-ghost-300 text-ink font-body text-[10px] shadow-[var(--shadow-soft)]"
                >
                  Unggulan
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-4 space-y-2">
              <p
                class="font-body text-sm font-medium text-ink leading-tight line-clamp-2 group-hover:text-ink-700 transition-colors"
              >
                {{ product.name }}
              </p>
              <div class="flex items-center justify-between pt-1">
                <p class="font-display text-base text-ink">
                  Rp {{ Number(product.price).toLocaleString("id-ID") }}
                </p>
                <p class="font-body text-[10px] text-ink-300">
                  Stok {{ product.stock }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const route = useRoute();

const category = ref(null);
const products = ref([]);
const loading = ref(true);
const sortBy = ref("created_at_desc");

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

const style = computed(() => {
  return (
    catStyleMap[route.params.slug] || {
      icon: "fa-solid fa-tag",
      bg: "bg-ghost",
      color: "#555555",
    }
  );
});

const sortedProducts = computed(() => {
  const result = [...products.value];
  switch (sortBy.value) {
    case "price_asc":
      return result.sort((a, b) => a.price - b.price);
    case "price_desc":
      return result.sort((a, b) => b.price - a.price);
    case "name_asc":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return result.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
  }
});

async function fetchData() {
  loading.value = true;

  const { data: catData } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", route.params.slug)
    .single();

  category.value = catData;

  if (catData) {
    const { data: prodData } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", catData.id)
      .order("created_at", { ascending: false });
    products.value = prodData || [];
  }

  loading.value = false;
}

onMounted(fetchData);
</script>
