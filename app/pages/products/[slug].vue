<template>
  <div class="min-h-screen bg-ghost">
    <!-- Loading -->
    <div v-if="loading" class="max-w-6xl mx-auto px-6 py-10">
      <div class="grid lg:grid-cols-2 gap-12 animate-pulse">
        <div
          class="aspect-square bg-white rounded-[var(--radius-xl)] border border-ghost-200"
        ></div>
        <div class="space-y-4 py-4">
          <div class="h-3 bg-ghost rounded w-1/4"></div>
          <div class="h-8 bg-ghost rounded w-3/4"></div>
          <div class="h-4 bg-ghost rounded w-1/2"></div>
          <div class="h-4 bg-ghost rounded w-2/3"></div>
          <div class="h-12 bg-ghost rounded w-full mt-8"></div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!product" class="max-w-6xl mx-auto px-6 py-20 text-center">
      <div
        class="w-16 h-16 rounded-full bg-white border border-ghost-200 flex items-center justify-center mx-auto mb-4"
      >
        <i class="fa-solid fa-box-open text-2xl text-ink-300"></i>
      </div>
      <h1 class="font-display text-2xl text-ink mb-2">
        Produk Tidak Ditemukan
      </h1>
      <p class="font-body text-sm text-ink-500 mb-6">
        Produk yang kamu cari tidak ada atau sudah dihapus.
      </p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium hover:bg-ink-800 transition-all duration-200"
      >
        <i class="fa-solid fa-arrow-left text-xs"></i>
        Kembali ke Produk
      </NuxtLink>
    </div>

    <!-- Product Detail -->
    <template v-else>
      <div class="max-w-6xl mx-auto px-6 py-10">
        <!-- Breadcrumb -->
        <div
          class="flex items-center gap-2 mb-8 font-body text-xs text-ink-300"
        >
          <NuxtLink to="/" class="hover:text-ink transition-colors"
            >Beranda</NuxtLink
          >
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <NuxtLink to="/products" class="hover:text-ink transition-colors"
            >Produk</NuxtLink
          >
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <NuxtLink
            v-if="product.categories"
            :to="`/categories/${product.categories.slug}`"
            class="hover:text-ink transition-colors"
          >
            {{ product.categories.name }}
          </NuxtLink>
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
          <span class="text-ink truncate max-w-[200px]">{{
            product.name
          }}</span>
        </div>

        <!-- Main Content -->
        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <!-- Gambar -->
          <div class="sticky top-24">
            <div
              class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden aspect-square flex items-center justify-center"
            >
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center gap-3">
                <i class="fa-solid fa-image text-5xl text-ink-300"></i>
                <p class="font-body text-xs text-ink-300">Tidak ada foto</p>
              </div>
            </div>

            <!-- Badge -->
            <div class="flex items-center gap-2 mt-4">
              <span
                v-if="product.is_new"
                class="px-3 py-1 rounded-full bg-ink text-ghost font-body text-xs font-medium"
              >
                ✦ Produk Baru
              </span>
              <span
                v-if="product.is_featured"
                class="px-3 py-1 rounded-full bg-white border border-ghost-300 text-ink font-body text-xs font-medium shadow-[var(--shadow-soft)]"
              >
                ★ Unggulan
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="space-y-6">
            <!-- Kategori + Nama -->
            <div>
              <NuxtLink
                v-if="product.categories"
                :to="`/categories/${product.categories.slug}`"
                class="inline-block font-body text-xs text-ink-300 uppercase tracking-widest mb-3 hover:text-ink transition-colors"
              >
                {{ product.categories.name }}
              </NuxtLink>
              <h1
                class="font-display text-3xl lg:text-4xl text-ink leading-tight"
              >
                {{ product.name }}
              </h1>
            </div>

            <!-- Harga -->
            <div class="flex items-end gap-3">
              <p class="font-display text-4xl text-ink">
                Rp {{ Number(product.price).toLocaleString("id-ID") }}
              </p>
            </div>

            <!-- Stok -->
            <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
              :class="
                product.stock > 10
                  ? 'bg-green-50 border-green-200 text-success'
                  : product.stock > 0
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-red-50 border-red-200 text-danger'
              "
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="
                  product.stock > 10
                    ? 'bg-success'
                    : product.stock > 0
                      ? 'bg-amber-500'
                      : 'bg-danger'
                "
              >
              </span>
              <span class="font-body text-xs font-medium">
                {{
                  product.stock > 10
                    ? `Stok tersedia (${product.stock})`
                    : product.stock > 0
                      ? `Stok terbatas (${product.stock} tersisa)`
                      : "Stok habis"
                }}
              </span>
            </div>

            <!-- Deskripsi -->
            <div v-if="product.description" class="space-y-2">
              <p
                class="font-body text-xs text-ink-300 uppercase tracking-widest"
              >
                Deskripsi
              </p>
              <p class="font-body text-sm text-ink-500 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Divider -->
            <div class="h-px bg-ghost-200"></div>

            <!-- Quantity + Add to Cart -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <p
                  class="font-body text-xs text-ink-300 uppercase tracking-widest"
                >
                  Jumlah
                </p>
                <div
                  class="inline-flex items-center border border-ghost-300 rounded-[var(--radius-md)] overflow-hidden bg-white"
                >
                  <button
                    @click="decreaseQty"
                    class="w-11 h-11 flex items-center justify-center text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200 disabled:opacity-30"
                    :disabled="qty <= 1"
                  >
                    <i class="fa-solid fa-minus text-xs"></i>
                  </button>
                  <span
                    class="w-12 text-center font-body text-sm font-medium text-ink"
                    >{{ qty }}</span
                  >
                  <button
                    @click="increaseQty"
                    class="w-11 h-11 flex items-center justify-center text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200 disabled:opacity-30"
                    :disabled="qty >= product.stock"
                  >
                    <i class="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Total -->
              <div
                class="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-200"
              >
                <span class="font-body text-sm text-ink-500">Total</span>
                <span class="font-display text-lg text-ink">
                  Rp {{ (Number(product.price) * qty).toLocaleString("id-ID") }}
                </span>
              </div>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="addToCart"
                  :disabled="product.stock === 0 || cartLoading"
                  class="flex-1 py-3.5 rounded-[var(--radius-md)] border border-ink text-ink font-body text-sm font-medium hover:bg-ghost active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span
                    v-if="cartLoading"
                    class="inline-block w-4 h-4 border-2 border-ink-300 border-t-ink rounded-full animate-spin"
                  ></span>
                  <i v-else class="fa-solid fa-bag-shopping text-xs"></i>
                  {{ cartLoading ? "Menambahkan..." : "Tambah ke Keranjang" }}
                </button>
                <button
                  @click="buyNow"
                  :disabled="product.stock === 0"
                  class="flex-1 py-3.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium shadow-[var(--shadow-btn)] hover:bg-ink-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-bolt text-xs"></i>
                  Beli Sekarang
                </button>
              </div>

              <!-- Added to cart notif -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="cartSuccess"
                  class="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-green-50 border border-green-200 text-success font-body text-sm"
                >
                  <i class="fa-solid fa-circle-check"></i>
                  Produk berhasil ditambahkan ke keranjang!
                </div>
              </Transition>
            </div>

            <!-- Meta info -->
            <div class="pt-2 space-y-2 border-t border-ghost-200">
              <div
                class="flex items-center gap-3 font-body text-xs text-ink-300"
              >
                <i class="fa-solid fa-truck w-4 text-center"></i>
                <span>Gratis ongkir min. pembelian Rp150.000</span>
              </div>
              <div
                class="flex items-center gap-3 font-body text-xs text-ink-300"
              >
                <i class="fa-solid fa-shield-halved w-4 text-center"></i>
                <span>Garansi uang kembali 7 hari</span>
              </div>
              <div
                class="flex items-center gap-3 font-body text-xs text-ink-300"
              >
                <i class="fa-solid fa-rotate-left w-4 text-center"></i>
                <span>Pengembalian mudah & gratis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="relatedProducts.length > 0" class="mt-16">
          <div class="mb-6">
            <p
              class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
            >
              Mungkin Kamu Suka
            </p>
            <h2 class="font-display text-2xl text-ink">Produk Serupa</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <NuxtLink
              v-for="related in relatedProducts"
              :key="related.id"
              :to="`/products/${related.slug}`"
              class="group bg-white rounded-[var(--radius-lg)] border border-ghost-200 overflow-hidden hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all duration-300"
            >
              <div class="aspect-square bg-ghost overflow-hidden">
                <img
                  v-if="related.image_url"
                  :src="related.image_url"
                  :alt="related.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fa-solid fa-image text-2xl text-ink-300"></i>
                </div>
              </div>
              <div class="p-4 space-y-1.5">
                <p
                  class="font-body text-[10px] text-ink-300 uppercase tracking-wider"
                >
                  {{ related.categories?.name }}
                </p>
                <p
                  class="font-body text-sm font-medium text-ink line-clamp-2 leading-tight"
                >
                  {{ related.name }}
                </p>
                <p class="font-display text-base text-ink">
                  Rp {{ Number(related.price).toLocaleString("id-ID") }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const route = useRoute();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const qty = ref(1);
const cartLoading = ref(false);
const cartSuccess = ref(false);

async function fetchProduct() {
  loading.value = true;
  const { data } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("slug", route.params.slug)
    .single();

  product.value = data;
  loading.value = false;

  if (data?.categories?.id) {
    fetchRelated(data.categories.id, data.id);
  }
}

async function fetchRelated(categoryId, currentId) {
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", categoryId)
    .neq("id", currentId)
    .limit(4);
  relatedProducts.value = data || [];
}

function decreaseQty() {
  if (qty.value > 1) qty.value--;
}

function increaseQty() {
  if (qty.value < product.value.stock) qty.value++;
}

async function addToCart() {
  // Pastikan session sudah ready
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return router.push("/auth/signin");
  if (product.value.stock === 0) return;

  cartLoading.value = true;
  cartSuccess.value = false;

  try {
    const userId = session.user.id;

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", product.value.id)
      .maybeSingle();

    if (existing) {
      const newQty = Math.min(
        existing.quantity + qty.value,
        product.value.stock,
      );
      await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: product.value.id,
        quantity: qty.value,
      });
    }

    // Kurangi stok
    await supabase
      .from("products")
      .update({ stock: product.value.stock - qty.value })
      .eq("id", product.value.id);

    product.value.stock -= qty.value;

    cartSuccess.value = true;
    setTimeout(() => (cartSuccess.value = false), 3000);
  } catch (err) {
    console.error("Cart error:", err);
  } finally {
    cartLoading.value = false;
  }
}

async function buyNow() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return router.push("/auth/signin");
  await addToCart();
  router.push("/cart");
}

onMounted(fetchProduct);
</script>
