<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-6xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="mb-8">
        <p
          class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
        >
          Toko
        </p>
        <h1 class="font-display text-3xl lg:text-4xl text-ink">Semua Produk</h1>
      </div>

      <!-- Filter & Search Bar -->
      <div
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] p-4 mb-8"
      >
        <div class="flex flex-col lg:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <i
              class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 text-sm"
            ></i>
            <input
              v-model="search"
              type="text"
              placeholder="Cari produk..."
              class="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>

          <!-- Filter Kategori -->
          <select
            v-model="selectedCategory"
            class="px-4 py-2.5 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm focus:outline-none focus:border-ink focus:bg-white transition-all duration-200 lg:w-48"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <!-- Sort -->
          <select
            v-model="sortBy"
            class="px-4 py-2.5 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm focus:outline-none focus:border-ink focus:bg-white transition-all duration-200 lg:w-48"
          >
            <option value="created_at_desc">Terbaru</option>
            <option value="created_at_asc">Terlama</option>
            <option value="price_asc">Harga: Termurah</option>
            <option value="price_desc">Harga: Termahal</option>
            <option value="name_asc">Nama: A–Z</option>
            <option value="name_desc">Nama: Z–A</option>
          </select>

          <!-- Reset -->
          <button
            v-if="search || selectedCategory || sortBy !== 'created_at_desc'"
            @click="resetFilter"
            class="px-4 py-2.5 rounded-[var(--radius-md)] border border-ghost-300 font-body text-sm text-ink-500 hover:text-ink hover:border-ink transition-all duration-200 shrink-0"
          >
            <i class="fa-solid fa-xmark mr-1.5"></i> Reset
          </button>
        </div>

        <!-- Active Filter Tags -->
        <div
          v-if="selectedCategory"
          class="flex items-center gap-2 mt-3 pt-3 border-t border-ghost-200"
        >
          <span class="font-body text-xs text-ink-300">Filter aktif:</span>
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink text-ghost font-body text-xs"
          >
            {{ categories.find((c) => c.id === selectedCategory)?.name }}
            <button @click="selectedCategory = ''" class="hover:opacity-70">
              <i class="fa-solid fa-xmark text-[10px]"></i>
            </button>
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 overflow-hidden animate-pulse"
        >
          <div class="aspect-square bg-ghost"></div>
          <div class="p-4 space-y-2">
            <div class="h-3 bg-ghost rounded w-1/3"></div>
            <div class="h-4 bg-ghost rounded w-3/4"></div>
            <div class="h-4 bg-ghost rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredProducts.length === 0"
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-16 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-ghost flex items-center justify-center mx-auto mb-4"
        >
          <i class="fa-solid fa-box-open text-2xl text-ink-300"></i>
        </div>
        <p class="font-body text-sm font-medium text-ink mb-1">
          Produk tidak ditemukan
        </p>
        <p class="font-body text-xs text-ink-300">
          Coba ubah filter atau kata kunci pencarian
        </p>
      </div>

      <!-- Product Grid -->
      <template v-else>
        <p class="font-body text-xs text-ink-300 mb-4">
          Menampilkan
          <span class="text-ink font-medium">{{
            filteredProducts.length
          }}</span>
          produk
        </p>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="product in filteredProducts"
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

              <!-- Badge -->
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span
                  v-if="product.is_new"
                  class="px-2 py-0.5 rounded-full bg-ink text-ghost font-body text-[10px] font-medium"
                >
                  Baru
                </span>
                <span
                  v-if="product.is_featured"
                  class="px-2 py-0.5 rounded-full bg-white border border-ghost-300 text-ink font-body text-[10px] font-medium shadow-[var(--shadow-soft)]"
                >
                  Unggulan
                </span>
              </div>

              <!-- Quick Add -->
              <button
                @click.prevent="addToCart(product)"
                class="absolute bottom-3 right-3 w-8 h-8 rounded-[var(--radius-sm)] bg-ink text-ghost flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-ink-800 shadow-[var(--shadow-btn)]"
              >
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>

            <!-- Info -->
            <div class="p-4 space-y-2">
              <p
                class="font-body text-[10px] text-ink-300 uppercase tracking-wider"
              >
                {{ product.categories?.name || "—" }}
              </p>
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

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const search = ref("");
const selectedCategory = ref(route.query.category || "");
const sortBy = ref("created_at_desc");

// Handle ?filter=new dan ?filter=featured dari homepage
onMounted(async () => {
  if (route.query.filter === "new") sortBy.value = "created_at_desc";
  if (route.query.filter === "featured") selectedCategory.value = "";
  await Promise.all([fetchProducts(), fetchCategories()]);
});

async function fetchProducts() {
  loading.value = true;
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  products.value = data || [];
  loading.value = false;
}

async function fetchCategories() {
  const { data } = await supabase.from("categories").select("*").order("name");
  categories.value = data || [];
}

// Filter + Search + Sort — dilakukan di client side
const filteredProducts = computed(() => {
  let result = [...products.value];

  // Filter khusus dari homepage
  if (route.query.filter === "new") {
    result = result.filter((p) => p.is_new);
  }
  if (route.query.filter === "featured") {
    result = result.filter((p) => p.is_featured);
  }

  // Filter kategori
  if (selectedCategory.value) {
    result = result.filter((p) => p.category_id === selectedCategory.value);
  }

  // Search
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.categories?.name?.toLowerCase().includes(q),
    );
  }

  // Sort
  switch (sortBy.value) {
    case "created_at_asc":
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name_asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name_desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return result;
});

function resetFilter() {
  search.value = "";
  selectedCategory.value = "";
  sortBy.value = "created_at_desc";
}

function addToCart(product) {
  // Akan disambungkan ke cart nanti
  console.log("Add to cart:", product.name);
}
</script>
