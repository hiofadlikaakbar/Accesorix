<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-6xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="mb-8">
        <p
          class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
        >
          Belanja
        </p>
        <h1 class="font-display text-3xl lg:text-4xl text-ink">
          Keranjang Saya
        </h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-5 flex gap-5 animate-pulse"
          >
            <div
              class="w-24 h-24 bg-ghost rounded-[var(--radius-lg)] shrink-0"
            ></div>
            <div class="flex-1 space-y-3 py-1">
              <div class="h-4 bg-ghost rounded w-3/4"></div>
              <div class="h-3 bg-ghost rounded w-1/4"></div>
              <div class="h-4 bg-ghost rounded w-1/3"></div>
            </div>
          </div>
        </div>
        <div
          class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-6 h-64 animate-pulse"
        ></div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="cartItems.length === 0"
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-16 text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-ghost flex items-center justify-center mx-auto mb-5"
        >
          <i class="fa-solid fa-bag-shopping text-3xl text-ink-300"></i>
        </div>
        <h2 class="font-display text-2xl text-ink mb-2">Keranjang Kosong</h2>
        <p
          class="font-body text-sm text-ink-500 mb-8 max-w-xs mx-auto leading-relaxed"
        >
          Belum ada produk di keranjangmu. Yuk mulai belanja!
        </p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium shadow-[var(--shadow-btn)] hover:bg-ink-800 transition-all duration-200"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
          Mulai Belanja
        </NuxtLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid lg:grid-cols-3 gap-8 items-start">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Select All -->
          <div
            class="flex items-center justify-between bg-white rounded-[var(--radius-lg)] border border-ghost-200 px-5 py-3 shadow-[var(--shadow-soft)]"
          >
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative">
                <input type="checkbox" class="sr-only" v-model="selectAll" />
                <div
                  class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                  :class="
                    selectAll
                      ? 'bg-ink border-ink'
                      : 'border-ghost-300 bg-white'
                  "
                >
                  <i
                    v-if="selectAll"
                    class="fa-solid fa-check text-ghost text-[10px]"
                  ></i>
                </div>
              </div>
              <span class="font-body text-sm text-ink"
                >Pilih Semua ({{ cartItems.length }} item)</span
              >
            </label>
            <button
              v-if="selectedIds.length > 0"
              @click="deleteSelected"
              class="font-body text-xs text-danger hover:opacity-70 transition-opacity flex items-center gap-1.5"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
              Hapus ({{ selectedIds.length }})
            </button>
          </div>

          <!-- Item List -->
          <div class="space-y-3">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="bg-white rounded-[var(--radius-xl)] border transition-all duration-200"
              :class="
                selectedIds.includes(item.id)
                  ? 'border-ink shadow-[var(--shadow-soft)]'
                  : 'border-ghost-200'
              "
            >
              <div class="p-5 flex gap-4 items-start">
                <!-- Checkbox -->
                <div class="pt-1 shrink-0">
                  <div
                    class="relative cursor-pointer"
                    @click="toggleSelect(item.id)"
                  >
                    <div
                      class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                      :class="
                        selectedIds.includes(item.id)
                          ? 'bg-ink border-ink'
                          : 'border-ghost-300 bg-white'
                      "
                    >
                      <i
                        v-if="selectedIds.includes(item.id)"
                        class="fa-solid fa-check text-ghost text-[10px]"
                      ></i>
                    </div>
                  </div>
                </div>

                <!-- Gambar -->
                <NuxtLink
                  :to="`/products/${item.products.slug}`"
                  class="w-24 h-24 rounded-[var(--radius-lg)] bg-ghost overflow-hidden shrink-0 border border-ghost-200"
                >
                  <img
                    v-if="item.products.image_url"
                    :src="item.products.image_url"
                    :alt="item.products.name"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <i class="fa-solid fa-image text-xl text-ink-300"></i>
                  </div>
                </NuxtLink>

                <!-- Info -->
                <div class="flex-1 min-w-0 space-y-2">
                  <div>
                    <p
                      class="font-body text-[10px] text-ink-300 uppercase tracking-wider mb-0.5"
                    >
                      {{ item.products.categories?.name }}
                    </p>
                    <NuxtLink
                      :to="`/products/${item.products.slug}`"
                      class="font-body text-sm font-medium text-ink leading-tight hover:text-ink-700 transition-colors line-clamp-2"
                    >
                      {{ item.products.name }}
                    </NuxtLink>
                  </div>

                  <p class="font-display text-base text-ink">
                    Rp {{ Number(item.products.price).toLocaleString("id-ID") }}
                  </p>

                  <!-- Quantity & Delete -->
                  <div class="flex items-center justify-between pt-1">
                    <div
                      class="inline-flex items-center border border-ghost-300 rounded-[var(--radius-md)] overflow-hidden bg-white"
                    >
                      <button
                        @click="updateQty(item, item.quantity - 1)"
                        :disabled="item.quantity <= 1 || item.updating"
                        class="w-9 h-9 flex items-center justify-center text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200 disabled:opacity-30"
                      >
                        <i class="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span
                        class="w-10 text-center font-body text-sm font-medium text-ink"
                      >
                        <i
                          v-if="item.updating"
                          class="fa-solid fa-circle-notch fa-spin text-ink-300 text-xs"
                        ></i>
                        <span v-else>{{ item.quantity }}</span>
                      </span>
                      <button
                        @click="updateQty(item, item.quantity + 1)"
                        :disabled="
                          item.quantity >= item.products.stock || item.updating
                        "
                        class="w-9 h-9 flex items-center justify-center text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200 disabled:opacity-30"
                      >
                        <i class="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>

                    <button
                      @click="deleteItem(item.id)"
                      class="w-9 h-9 rounded-[var(--radius-sm)] border border-ghost-300 flex items-center justify-center text-ink-300 hover:text-danger hover:border-danger transition-all duration-200"
                    >
                      <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Subtotal per item -->
              <div
                class="px-5 py-3 border-t border-ghost-200 flex items-center justify-between bg-ghost rounded-b-[var(--radius-xl)]"
              >
                <span class="font-body text-xs text-ink-300">Subtotal</span>
                <span class="font-display text-sm text-ink">
                  Rp
                  {{
                    (
                      Number(item.products.price) * item.quantity
                    ).toLocaleString("id-ID")
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="sticky top-24 space-y-4">
          <div
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div class="px-6 py-5 border-b border-ghost-200">
              <h2 class="font-display text-xl text-ink">Ringkasan Order</h2>
            </div>

            <div class="px-6 py-5 space-y-4">
              <!-- Selected items info -->
              <div
                class="px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-200"
              >
                <p class="font-body text-xs text-ink-500">
                  <span class="font-medium text-ink">{{
                    selectedIds.length
                  }}</span>
                  dari
                  <span class="font-medium text-ink">{{
                    cartItems.length
                  }}</span>
                  item dipilih
                </p>
              </div>

              <!-- Price breakdown -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-body text-sm text-ink-500">Subtotal</span>
                  <span class="font-body text-sm text-ink">
                    Rp {{ selectedSubtotal.toLocaleString("id-ID") }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-body text-sm text-ink-500"
                    >Ongkos Kirim</span
                  >
                  <span
                    class="font-body text-sm"
                    :class="
                      selectedSubtotal >= 150000 ? 'text-success' : 'text-ink'
                    "
                  >
                    {{ selectedSubtotal >= 150000 ? "GRATIS" : "Rp 15.000" }}
                  </span>
                </div>

                <!-- Free shipping progress -->
                <div
                  v-if="selectedSubtotal < 150000 && selectedSubtotal > 0"
                  class="space-y-1.5"
                >
                  <div
                    class="w-full h-1.5 bg-ghost rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-ink rounded-full transition-all duration-500"
                      :style="{
                        width: `${(selectedSubtotal / 150000) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <p class="font-body text-[10px] text-ink-300">
                    Tambah Rp
                    {{ (150000 - selectedSubtotal).toLocaleString("id-ID") }}
                    lagi untuk gratis ongkir
                  </p>
                </div>
              </div>

              <div class="h-px bg-ghost-200"></div>

              <!-- Total -->
              <div class="flex items-center justify-between">
                <span class="font-body text-sm font-medium text-ink"
                  >Total</span
                >
                <span class="font-display text-xl text-ink">
                  Rp {{ grandTotal.toLocaleString("id-ID") }}
                </span>
              </div>

              <!-- Checkout Button -->
              <button
                @click="goCheckout"
                :disabled="selectedIds.length === 0"
                class="w-full py-3.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium shadow-[var(--shadow-btn)] hover:bg-ink-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-lock text-xs"></i>
                Checkout ({{ selectedIds.length }} item)
              </button>

              <NuxtLink
                to="/products"
                class="block w-full py-3 rounded-[var(--radius-md)] border border-ghost-300 text-ink font-body text-sm text-center hover:border-ink hover:bg-ghost transition-all duration-200"
              >
                Lanjut Belanja
              </NuxtLink>
            </div>
          </div>

          <!-- Info -->
          <div
            class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 px-5 py-4 space-y-2.5"
          >
            <div class="flex items-center gap-3 font-body text-xs text-ink-300">
              <i class="fa-solid fa-truck w-4 text-center"></i>
              <span>Gratis ongkir min. Rp150.000</span>
            </div>
            <div class="flex items-center gap-3 font-body text-xs text-ink-300">
              <i class="fa-solid fa-shield-halved w-4 text-center"></i>
              <span>Garansi uang kembali 7 hari</span>
            </div>
            <div class="flex items-center gap-3 font-body text-xs text-ink-300">
              <i class="fa-solid fa-lock w-4 text-center"></i>
              <span>Transaksi aman & terenkripsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "auth" });

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const cartItems = ref([]);
const loading = ref(true);
const selectedIds = ref([]);

// Select all toggle
const selectAll = computed({
  get: () =>
    selectedIds.value.length === cartItems.value.length &&
    cartItems.value.length > 0,
  set: (val) => {
    selectedIds.value = val ? cartItems.value.map((i) => i.id) : [];
  },
});

// Subtotal item yang dipilih saja
const selectedSubtotal = computed(() => {
  return cartItems.value
    .filter((i) => selectedIds.value.includes(i.id))
    .reduce((sum, i) => sum + Number(i.products.price) * i.quantity, 0);
});

const shippingCost = computed(() => {
  if (selectedIds.value.length === 0) return 0;
  return selectedSubtotal.value >= 150000 ? 0 : 15000;
});

const grandTotal = computed(() => selectedSubtotal.value + shippingCost.value);
async function fetchCart() {
  loading.value = true;

  // Pakai getSession langsung biar tidak undefined
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    loading.value = false;
    return;
  }

  const { data } = await supabase
    .from("cart_items")
    .select(
      "*, products(id, name, slug, price, stock, image_url, categories(name))",
    )
    .eq("user_id", session.user.id)
    .order("added_at", { ascending: false });

  cartItems.value = (data || []).map((i) => ({ ...i, updating: false }));
  selectedIds.value = cartItems.value.map((i) => i.id);
  loading.value = false;
}

function toggleSelect(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((i) => i !== id);
  } else {
    selectedIds.value.push(id);
  }
}

async function updateQty(item, newQty) {
  if (newQty < 1 || newQty > item.products.stock) return;
  item.updating = true;
  await supabase
    .from("cart_items")
    .update({ quantity: newQty })
    .eq("id", item.id);
  item.quantity = newQty;
  item.updating = false;
}

async function deleteItem(id) {
  await supabase.from("cart_items").delete().eq("id", id);
  cartItems.value = cartItems.value.filter((i) => i.id !== id);
  selectedIds.value = selectedIds.value.filter((i) => i !== id);
}

async function deleteSelected() {
  await supabase.from("cart_items").delete().in("id", selectedIds.value);
  cartItems.value = cartItems.value.filter(
    (i) => !selectedIds.value.includes(i.id),
  );
  selectedIds.value = [];
}

function goCheckout() {
  if (selectedIds.value.length === 0) return;
  // Kirim selected item ids ke checkout via sessionStorage
  sessionStorage.setItem("checkout_ids", JSON.stringify(selectedIds.value));
  router.push("/checkout");
}

onMounted(fetchCart);
</script>
