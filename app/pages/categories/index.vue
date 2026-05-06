<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-6xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="mb-10">
        <p
          class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
        >
          Jelajahi
        </p>
        <h1 class="font-display text-3xl lg:text-4xl text-ink">
          Semua Kategori
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-8 animate-pulse"
        >
          <div class="w-14 h-14 bg-ghost rounded-[var(--radius-lg)] mb-4"></div>
          <div class="h-4 bg-ghost rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-ghost rounded w-1/3"></div>
        </div>
      </div>

      <!-- Grid Kategori -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="group bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-8 hover:shadow-[var(--shadow-card)] hover:border-ink-100 hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Icon -->
          <div
            class="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
            :class="catStyle(cat.slug).bg"
          >
            <i
              :class="catStyle(cat.slug).icon"
              class="text-2xl"
              :style="{ color: catStyle(cat.slug).color }"
            ></i>
          </div>

          <!-- Info -->
          <div class="space-y-1.5">
            <h2
              class="font-display text-xl text-ink group-hover:text-ink-700 transition-colors"
            >
              {{ cat.name }}
            </h2>
            <p class="font-body text-xs text-ink-300">
              {{ productCounts[cat.id] || 0 }} produk
            </p>
          </div>

          <!-- Arrow -->
          <div
            class="mt-6 flex items-center gap-2 font-body text-xs text-ink-300 group-hover:text-ink transition-colors duration-200"
          >
            Lihat Produk
            <i
              class="fa-solid fa-arrow-right text-[10px] translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
            ></i>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

const categories = ref([]);
const productCounts = ref({});
const loading = ref(true);

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

function catStyle(slug) {
  return (
    catStyleMap[slug] || {
      icon: "fa-solid fa-tag",
      bg: "bg-ghost",
      color: "#555555",
    }
  );
}

async function fetchCategories() {
  loading.value = true;

  const { data } = await supabase.from("categories").select("*").order("name");

  categories.value = data || [];

  // Hitung jumlah produk per kategori
  await Promise.all(
    categories.value.map(async (cat) => {
      const { count } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("category_id", cat.id);
      productCounts.value[cat.id] = count || 0;
    }),
  );

  loading.value = false;
}

onMounted(fetchCategories);
</script>
