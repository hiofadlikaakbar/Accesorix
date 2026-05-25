<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-5xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-1"
          >
            Admin Panel
          </p>

          <h1 class="font-display text-3xl text-ink">Manajemen Produk</h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- Back Home -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] border border-ghost-300 text-ink font-body text-sm font-medium hover:bg-ghost transition-all duration-200"
          >
            <i class="fa-solid fa-arrow-left text-xs"></i>
            Kembali
          </NuxtLink>

          <!-- Tambah Produk -->
          <NuxtLink
            to="/admin/products/create"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium shadow-[var(--shadow-btn)] hover:bg-ink-800 transition-all duration-200"
          >
            <i class="fa-solid fa-plus text-xs"></i>
            Tambah Produk
          </NuxtLink>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div
          class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 p-5 shadow-[var(--shadow-soft)]"
        >
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
          >
            Total Produk
          </p>
          <p class="font-display text-3xl text-ink">{{ products.length }}</p>
        </div>
        <div
          class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 p-5 shadow-[var(--shadow-soft)]"
        >
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
          >
            Produk Baru
          </p>
          <p class="font-display text-3xl text-ink">
            {{ products.filter((p) => p.is_new).length }}
          </p>
        </div>
        <div
          class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 p-5 shadow-[var(--shadow-soft)]"
        >
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
          >
            Unggulan
          </p>
          <p class="font-display text-3xl text-ink">
            {{ products.filter((p) => p.is_featured).length }}
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-ink-300"></i>
      </div>

      <!-- Empty -->
      <div
        v-else-if="products.length === 0"
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-16 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-ghost flex items-center justify-center mx-auto mb-4"
        >
          <i class="fa-solid fa-box-open text-2xl text-ink-300"></i>
        </div>
        <p class="font-body text-sm text-ink-500 mb-4">
          Belum ada produk. Yuk tambahkan!
        </p>
        <NuxtLink
          to="/admin/products/create"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium hover:bg-ink-800 transition-all duration-200"
        >
          <i class="fa-solid fa-plus text-xs"></i>
          Tambah Produk Pertama
        </NuxtLink>
      </div>

      <!-- Product List -->
      <div
        v-else
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 overflow-hidden shadow-[var(--shadow-soft)]"
      >
        <div class="divide-y divide-ghost-200">
          <div
            v-for="product in products"
            :key="product.id"
            class="flex items-center gap-4 px-5 py-4 hover:bg-ghost transition-colors duration-150"
          >
            <!-- Gambar -->
            <div
              class="w-14 h-14 rounded-[var(--radius-md)] bg-ghost overflow-hidden shrink-0 border border-ghost-200"
            >
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <i class="fa-solid fa-image text-ink-300"></i>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="font-body text-sm font-medium text-ink truncate">
                  {{ product.name }}
                </p>
                <span
                  v-if="product.is_new"
                  class="shrink-0 px-2 py-0.5 rounded-full bg-ink text-ghost font-body text-[10px]"
                  >Baru</span
                >
                <span
                  v-if="product.is_featured"
                  class="shrink-0 px-2 py-0.5 rounded-full bg-ghost border border-ghost-300 text-ink font-body text-[10px]"
                  >Unggulan</span
                >
              </div>
              <p class="font-body text-xs text-ink-300">
                {{ product.categories?.name || "Tanpa Kategori" }} · Stok:
                {{ product.stock }} · Rp
                {{ Number(product.price).toLocaleString("id-ID") }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 shrink-0">
              <NuxtLink
                :to="`/admin/products/edit/${product.id}`"
                class="w-8 h-8 rounded-[var(--radius-sm)] border border-ghost-300 flex items-center justify-center text-ink-500 hover:text-ink hover:border-ink transition-all duration-200"
              >
                <i class="fa-solid fa-pen text-xs"></i>
              </NuxtLink>
              <button
                @click="confirmDelete(product)"
                class="w-8 h-8 rounded-[var(--radius-sm)] border border-ghost-300 flex items-center justify-center text-ink-500 hover:text-danger hover:border-danger transition-all duration-200"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="deleteTarget"
          class="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          @click.self="deleteTarget = null"
        >
          <div
            class="bg-white rounded-[var(--radius-xl)] p-8 w-full max-w-sm shadow-[var(--shadow-card)]"
          >
            <div
              class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"
            >
              <i class="fa-solid fa-trash text-danger"></i>
            </div>
            <h3 class="font-display text-xl text-ink text-center mb-2">
              Hapus Produk?
            </h3>
            <p
              class="font-body text-sm text-ink-500 text-center mb-6 leading-relaxed"
            >
              Produk
              <span class="font-medium text-ink">{{ deleteTarget?.name }}</span>
              akan dihapus permanen.
            </p>
            <div class="flex gap-3">
              <button
                @click="deleteTarget = null"
                class="flex-1 py-2.5 rounded-[var(--radius-md)] border border-ghost-300 font-body text-sm text-ink hover:bg-ghost transition-all duration-200"
              >
                Batal
              </button>
              <button
                @click="handleDelete"
                :disabled="deleteLoading"
                class="flex-1 py-2.5 rounded-[var(--radius-md)] bg-danger text-white font-body text-sm font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span
                  v-if="deleteLoading"
                  class="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                {{ deleteLoading ? "Menghapus..." : "Hapus" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "admin", layout: false });

const supabase = useSupabaseClient();

const products = ref([]);
const loading = ref(true);
const deleteTarget = ref(null);
const deleteLoading = ref(false);

async function fetchProducts() {
  loading.value = true;
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  products.value = data || [];
  loading.value = false;
}

function confirmDelete(product) {
  deleteTarget.value = product;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;

  // Hapus gambar dari storage kalau ada
  if (deleteTarget.value.image_url) {
    const path = deleteTarget.value.image_url.split("/products/")[1];
    if (path) {
      await supabase.storage.from("products").remove([path]);
    }
  }

  await supabase.from("products").delete().eq("id", deleteTarget.value.id);
  deleteLoading.value = false;
  deleteTarget.value = null;
  await fetchProducts();
}

onMounted(fetchProducts);
</script>
