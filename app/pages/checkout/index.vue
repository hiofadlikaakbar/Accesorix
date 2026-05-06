<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-5xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="mb-8">
        <p
          class="font-body text-xs text-ink-300 uppercase tracking-widest mb-2"
        >
          Belanja
        </p>
        <h1 class="font-display text-3xl lg:text-4xl text-ink">Checkout</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-ink-300"></i>
      </div>

      <!-- Empty — tidak ada item dipilih -->
      <div
        v-else-if="checkoutItems.length === 0"
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-16 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-ghost flex items-center justify-center mx-auto mb-4"
        >
          <i class="fa-solid fa-bag-shopping text-2xl text-ink-300"></i>
        </div>
        <h2 class="font-display text-2xl text-ink mb-2">Tidak Ada Item</h2>
        <p class="font-body text-sm text-ink-500 mb-6">
          Silakan pilih produk dari keranjang terlebih dahulu.
        </p>
        <NuxtLink
          to="/cart"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium hover:bg-ink-800 transition-all duration-200"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
          Kembali ke Keranjang
        </NuxtLink>
      </div>

      <!-- Checkout Form -->
      <div v-else class="grid lg:grid-cols-3 gap-8 items-start">
        <!-- Left — Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Step 1 — Alamat Pengiriman -->
          <div
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div
              class="px-6 py-4 border-b border-ghost-200 flex items-center gap-3"
            >
              <div
                class="w-7 h-7 rounded-full bg-ink flex items-center justify-center shrink-0"
              >
                <span class="font-body text-xs text-ghost font-medium">1</span>
              </div>
              <h2 class="font-display text-lg text-ink">Alamat Pengiriman</h2>
            </div>

            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- Nama Penerima -->
                <div class="space-y-1.5 col-span-2 md:col-span-1">
                  <label
                    class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                  >
                    Nama Penerima
                  </label>
                  <input
                    v-model="address.recipient_name"
                    type="text"
                    placeholder="Nama lengkap penerima"
                    class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
                  />
                </div>

                <!-- No. Telepon -->
                <div class="space-y-1.5 col-span-2 md:col-span-1">
                  <label
                    class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                  >
                    No. Telepon
                  </label>
                  <input
                    v-model="address.phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <!-- Alamat Lengkap -->
              <div class="space-y-1.5">
                <label
                  class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                >
                  Alamat Lengkap
                </label>
                <textarea
                  v-model="address.street"
                  rows="2"
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..."
                  class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200 resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Kota -->
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                    >Kota</label
                  >
                  <input
                    v-model="address.city"
                    type="text"
                    placeholder="Jakarta"
                    class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
                  />
                </div>

                <!-- Provinsi -->
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                    >Provinsi</label
                  >
                  <input
                    v-model="address.province"
                    type="text"
                    placeholder="DKI Jakarta"
                    class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
                  />
                </div>

                <!-- Kode Pos -->
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                    >Kode Pos</label
                  >
                  <input
                    v-model="address.postal_code"
                    type="text"
                    placeholder="12345"
                    class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
                  />
                </div>

                <!-- Label Alamat -->
                <div class="space-y-1.5">
                  <label
                    class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                  >
                    Label
                  </label>

                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="opt in [
                        { value: 'Rumah', icon: 'fa-house' },
                        { value: 'Kantor', icon: 'fa-building' },
                        { value: 'Kost', icon: 'fa-bed' },
                        { value: 'Lainnya', icon: 'fa-location-dot' },
                      ]"
                      :key="opt.value"
                      @click="address.label = opt.value"
                      class="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border-2 cursor-pointer transition-all duration-200"
                      :class="
                        address.label === opt.value
                          ? 'border-ink bg-ghost'
                          : 'border-ghost-200 hover:border-ghost-300'
                      "
                    >
                      <!-- Icon -->
                      <i
                        class="fa-solid text-sm"
                        :class="opt.icon"
                        :style="{
                          color:
                            address.label === opt.value ? '#111' : '#9ca3af',
                        }"
                      ></i>

                      <!-- Text -->
                      <span class="font-body text-xs text-ink">
                        {{ opt.value }}
                      </span>

                      <!-- Check -->
                      <i
                        v-if="address.label === opt.value"
                        class="fa-solid fa-check ml-auto text-[10px] text-ink"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Catatan -->
              <div class="space-y-1.5">
                <label
                  class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
                >
                  Catatan untuk Kurir
                  <span class="text-ink-300 normal-case">(opsional)</span>
                </label>
                <input
                  v-model="notes"
                  type="text"
                  placeholder="Contoh: Taroh di depan teras..."
                  class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <!-- Step 2 — Metode Pembayaran -->
          <div
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div
              class="px-6 py-4 border-b border-ghost-200 flex items-center gap-3"
            >
              <div
                class="w-7 h-7 rounded-full bg-ink flex items-center justify-center shrink-0"
              >
                <span class="font-body text-xs text-ghost font-medium">2</span>
              </div>
              <h2 class="font-display text-lg text-ink">Metode Pembayaran</h2>
            </div>

            <div class="p-6 space-y-3">
              <div v-for="bank in banks" :key="bank.id" class="relative">
                <!-- Hidden radio -->
                <input
                  type="radio"
                  :value="bank.id"
                  v-model="selectedBank"
                  class="absolute opacity-0 pointer-events-none"
                />

                <!-- Card -->
                <div
                  @click="selectedBank = bank.id"
                  class="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border-2 cursor-pointer transition-all duration-200"
                  :class="
                    selectedBank === bank.id
                      ? 'border-ink bg-ghost'
                      : 'border-ghost-200 hover:border-ghost-300'
                  "
                >
                  <!-- Circle -->
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                    :class="
                      selectedBank === bank.id
                        ? 'border-ink'
                        : 'border-ghost-300'
                    "
                  >
                    <i
                      v-if="selectedBank === bank.id"
                      class="fa-solid fa-check text-[10px] text-ink"
                    ></i>
                  </div>

                  <!-- Bank badge -->
                  <div
                    class="w-12 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                    :class="bank.bg"
                  >
                    <span
                      class="font-body text-xs font-bold"
                      :style="{ color: bank.color }"
                    >
                      {{ bank.code }}
                    </span>
                  </div>

                  <!-- Info -->
                  <div class="flex-1">
                    <p class="font-body text-sm font-medium text-ink">
                      {{ bank.name }}
                    </p>
                    <p class="font-body text-xs text-ink-300">
                      {{ bank.number }}
                    </p>
                  </div>

                  <!-- Selected label -->
                  <span
                    v-if="selectedBank === bank.id"
                    class="px-2 py-0.5 rounded-full bg-ink text-ghost font-body text-[10px]"
                  >
                    Dipilih
                  </span>
                </div>
              </div>

              <!-- Transfer Info -->
              <div
                v-if="selectedBank"
                class="mt-4 px-4 py-3 rounded-[var(--radius-md)] bg-amber-50 border border-amber-200"
              >
                <div class="flex items-start gap-2">
                  <i
                    class="fa-solid fa-circle-info text-amber-500 mt-0.5 text-xs"
                  ></i>
                  <p class="font-body text-xs text-amber-700 leading-relaxed">
                    Setelah order dibuat, lakukan transfer ke rekening di atas.
                    Order akan diproses setelah pembayaran dikonfirmasi oleh
                    admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right — Order Summary -->
        <div class="sticky top-24 space-y-4">
          <!-- Ringkasan Produk -->
          <div
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-ghost-200">
              <h2 class="font-display text-lg text-ink">Ringkasan Order</h2>
            </div>

            <!-- Item List -->
            <div class="divide-y divide-ghost-200">
              <div
                v-for="item in checkoutItems"
                :key="item.id"
                class="px-5 py-3 flex items-center gap-3"
              >
                <div
                  class="w-12 h-12 rounded-[var(--radius-md)] bg-ghost overflow-hidden shrink-0 border border-ghost-200"
                >
                  <img
                    v-if="item.products.image_url"
                    :src="item.products.image_url"
                    :alt="item.products.name"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <i class="fa-solid fa-image text-ink-300 text-sm"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="font-body text-xs font-medium text-ink truncate leading-tight"
                  >
                    {{ item.products.name }}
                  </p>
                  <p class="font-body text-[10px] text-ink-300 mt-0.5">
                    x{{ item.quantity }}
                  </p>
                </div>
                <p class="font-body text-xs font-medium text-ink shrink-0">
                  Rp
                  {{
                    (
                      Number(item.products.price) * item.quantity
                    ).toLocaleString("id-ID")
                  }}
                </p>
              </div>
            </div>

            <!-- Price -->
            <div class="px-5 py-4 space-y-3 border-t border-ghost-200">
              <div class="flex items-center justify-between">
                <span class="font-body text-sm text-ink-500">Subtotal</span>
                <span class="font-body text-sm text-ink"
                  >Rp {{ subtotal.toLocaleString("id-ID") }}</span
                >
              </div>
              <div class="flex items-center justify-between">
                <span class="font-body text-sm text-ink-500">Ongkos Kirim</span>
                <span
                  class="font-body text-sm"
                  :class="shippingCost === 0 ? 'text-success' : 'text-ink'"
                >
                  {{
                    shippingCost === 0
                      ? "GRATIS"
                      : `Rp ${shippingCost.toLocaleString("id-ID")}`
                  }}
                </span>
              </div>
              <div class="h-px bg-ghost-200"></div>
              <div class="flex items-center justify-between">
                <span class="font-body text-sm font-medium text-ink"
                  >Total</span
                >
                <span class="font-display text-xl text-ink"
                  >Rp {{ grandTotal.toLocaleString("id-ID") }}</span
                >
              </div>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="errorMsg"
            class="px-4 py-3 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-danger font-body text-xs flex items-start gap-2"
          >
            <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
            {{ errorMsg }}
          </div>

          <!-- Place Order Button -->
          <button
            @click="placeOrder"
            :disabled="orderLoading"
            class="w-full py-4 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium shadow-[var(--shadow-btn)] hover:bg-ink-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span
              v-if="orderLoading"
              class="inline-block w-4 h-4 border-2 border-ghost-300 border-t-ghost rounded-full animate-spin"
            ></span>
            <i v-else class="fa-solid fa-lock text-xs"></i>
            {{
              orderLoading
                ? "Memproses Order..."
                : `Buat Order — Rp ${grandTotal.toLocaleString("id-ID")}`
            }}
          </button>

          <div
            class="flex items-center justify-center gap-2 font-body text-xs text-ink-300"
          >
            <i class="fa-solid fa-shield-halved"></i>
            <span>Transaksi aman & terenkripsi</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "auth" });

const supabase = useSupabaseClient();
const router = useRouter();

const loading = ref(true);
const orderLoading = ref(false);
const errorMsg = ref("");
const checkoutItems = ref([]);
const selectedBank = ref("bca");
const notes = ref("");

const address = reactive({
  recipient_name: "",
  phone: "",
  street: "",
  city: "",
  province: "",
  postal_code: "",
  label: "Rumah",
});

const banks = [
  {
    id: "bca",
    name: "Bank BCA",
    code: "BCA",
    number: "1234567890 a/n Accesorix",
    bg: "bg-blue-50",
    color: "#1a73e8",
  },
  {
    id: "bni",
    name: "Bank BNI",
    code: "BNI",
    number: "0987654321 a/n Accesorix",
    bg: "bg-orange-50",
    color: "#f97316",
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    code: "MDR",
    number: "1122334455 a/n Accesorix",
    bg: "bg-yellow-50",
    color: "#ca8a04",
  },
];

const subtotal = computed(() =>
  checkoutItems.value.reduce(
    (sum, i) => sum + Number(i.products.price) * i.quantity,
    0,
  ),
);
const shippingCost = computed(() => (subtotal.value >= 150000 ? 0 : 15000));
const grandTotal = computed(() => subtotal.value + shippingCost.value);

async function fetchCheckoutItems() {
  loading.value = true;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return router.push("/auth/signin");

  // Ambil selected ids dari sessionStorage
  const ids = JSON.parse(sessionStorage.getItem("checkout_ids") || "[]");

  if (ids.length === 0) {
    loading.value = false;
    return;
  }

  const { data } = await supabase
    .from("cart_items")
    .select("*, products(id, name, slug, price, stock, image_url)")
    .in("id", ids)
    .eq("user_id", session.user.id);

  checkoutItems.value = data || [];

  // Pre-fill nama & telepon dari profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", session.user.id)
    .single();

  if (profile) {
    address.recipient_name = profile.full_name || "";
    address.phone = profile.phone || "";
  }

  loading.value = false;
}

async function placeOrder() {
  errorMsg.value = "";

  // Validasi alamat
  if (
    !address.recipient_name ||
    !address.phone ||
    !address.street ||
    !address.city ||
    !address.province ||
    !address.postal_code
  ) {
    errorMsg.value = "Lengkapi semua field alamat pengiriman.";
    return;
  }

  if (!selectedBank.value) {
    errorMsg.value = "Pilih metode pembayaran terlebih dahulu.";
    return;
  }

  orderLoading.value = true;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return router.push("/auth/signin");

    // 1. Simpan alamat
    const { data: savedAddress, error: addrError } = await supabase
      .from("addresses")
      .insert({
        user_id: session.user.id,
        label: address.label,
        recipient_name: address.recipient_name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        province: address.province,
        postal_code: address.postal_code,
        is_default: true,
      })
      .select()
      .single();

    if (addrError) throw addrError;

    // 2. Buat order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: session.user.id,
        address_id: savedAddress.id,
        status: "pending",
        total_price: grandTotal.value,
        payment_method: selectedBank.value,
        payment_status: "unpaid",
        notes: notes.value || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Buat order items
    const orderItems = checkoutItems.value.map((item) => ({
      order_id: order.id,
      product_id: item.products.id,
      quantity: item.quantity,
      unit_price: Number(item.products.price),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4. Hapus item dari cart
    const cartIds = checkoutItems.value.map((i) => i.id);
    await supabase.from("cart_items").delete().in("id", cartIds);

    // 5. Clear session checkout
    sessionStorage.removeItem("checkout_ids");

    // 6. Simpan order ID untuk trigger banner sukses
    sessionStorage.setItem("new_order_id", order.id);

    // 7. Redirect ke halaman detail order
    router.push(`/orders/${order.id}`);
  } catch (err) {
    console.error("Order error:", err);
    errorMsg.value = err.message || "Terjadi kesalahan. Coba lagi.";
  } finally {
    orderLoading.value = false;
  }
}
onMounted(fetchCheckoutItems);
</script>
