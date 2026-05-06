<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-3xl mx-auto px-6 py-10">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-ink-300"></i>
      </div>

      <!-- Not Found -->
      <div
        v-else-if="!order"
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 p-16 text-center"
      >
        <div
          class="w-16 h-16 rounded-full bg-ghost flex items-center justify-center mx-auto mb-4"
        >
          <i class="fa-solid fa-box-open text-2xl text-ink-300"></i>
        </div>
        <h1 class="font-display text-2xl text-ink mb-2">
          Order Tidak Ditemukan
        </h1>
        <p class="font-body text-sm text-ink-500 mb-6">
          Order yang kamu cari tidak ada.
        </p>
        <NuxtLink
          to="/orders"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm font-medium hover:bg-ink-800 transition-all duration-200"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
          Semua Order
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Success Banner — hanya muncul kalau baru dari checkout -->
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="isNewOrder"
            class="mb-6 bg-green-50 border border-green-200 rounded-[var(--radius-xl)] p-6 flex items-start gap-4"
          >
            <div
              class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0"
            >
              <i class="fa-solid fa-circle-check text-success text-lg"></i>
            </div>
            <div>
              <p class="font-display text-lg text-ink mb-1">
                Order Berhasil Dibuat! 🎉
              </p>
              <p class="font-body text-sm text-ink-500 leading-relaxed">
                Segera lakukan pembayaran sesuai instruksi di bawah. Order akan
                diproses setelah pembayaran dikonfirmasi.
              </p>
            </div>
          </div>
        </Transition>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <p
              class="font-body text-xs text-ink-300 uppercase tracking-widest mb-1"
            >
              Detail Order
            </p>
            <h1 class="font-display text-2xl text-ink">
              #{{ order.id.split("-")[0].toUpperCase() }}
            </h1>
          </div>
          <span
            class="px-3 py-1.5 rounded-full font-body text-xs font-medium"
            :class="statusStyle(order.status).class"
          >
            <i :class="statusStyle(order.status).icon" class="mr-1.5"></i>
            {{ statusStyle(order.status).label }}
          </span>
        </div>

        <!-- Timeline Status -->
        <div
          class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] p-6 mb-6"
        >
          <div class="flex items-center justify-between relative">
            <div
              class="absolute left-0 right-0 top-4 h-0.5 bg-ghost-200 -z-0"
            ></div>
            <div
              class="absolute left-0 top-4 h-0.5 bg-ink -z-0 transition-all duration-700"
              :style="{ width: timelineWidth }"
            ></div>

            <div
              v-for="(step, i) in statusSteps"
              :key="i"
              class="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                :class="
                  step.reached ? 'bg-ink' : 'bg-white border-2 border-ghost-300'
                "
              >
                <i
                  :class="step.icon"
                  class="text-xs"
                  :style="{
                    color: step.reached
                      ? 'var(--color-ghost)'
                      : 'var(--color-ink-300)',
                  }"
                ></i>
              </div>
              <p
                class="font-body text-[10px] text-center"
                :class="step.reached ? 'text-ink font-medium' : 'text-ink-300'"
              >
                {{ step.label }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <!-- Info Pembayaran -->
          <div
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-ghost-200">
              <h2 class="font-display text-base text-ink">
                Informasi Pembayaran
              </h2>
            </div>
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-body text-xs text-ink-300">Status</span>
                <span
                  class="px-2.5 py-1 rounded-full font-body text-xs font-medium"
                  :class="
                    order.payment_status === 'paid'
                      ? 'bg-green-50 text-success'
                      : 'bg-amber-50 text-amber-700'
                  "
                >
                  {{
                    order.payment_status === "paid" ? "Lunas" : "Belum Dibayar"
                  }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-body text-xs text-ink-300">Metode</span>
                <span
                  class="font-body text-xs font-medium text-ink uppercase"
                  >{{ order.payment_method }}</span
                >
              </div>
              <div class="h-px bg-ghost-200"></div>

              <!-- Bank Detail -->
              <div v-if="order.payment_status === 'unpaid'" class="space-y-3">
                <p class="font-body text-xs text-ink-300">Transfer ke:</p>
                <div
                  class="px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-200"
                >
                  <p class="font-body text-xs text-ink-300 mb-1">
                    {{ bankInfo?.name }}
                  </p>
                  <p class="font-display text-lg text-ink">
                    {{ bankInfo?.number }}
                  </p>
                  <p class="font-body text-xs text-ink-300 mt-0.5">
                    {{ bankInfo?.account }}
                  </p>
                </div>
                <div class="px-4 py-3 rounded-[var(--radius-md)] bg-ink">
                  <p class="font-body text-xs text-ghost/60 mb-1">
                    Jumlah Transfer
                  </p>
                  <p class="font-display text-xl text-ghost">
                    Rp {{ Number(order.total_price).toLocaleString("id-ID") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Alamat Pengiriman -->
          <div
            class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-ghost-200">
              <h2 class="font-display text-base text-ink">Alamat Pengiriman</h2>
            </div>
            <div class="p-5 space-y-2" v-if="order.addresses">
              <div
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ghost border border-ghost-200 mb-2"
              >
                <i
                  class="fa-solid fa-location-dot text-ink-300 text-[10px]"
                ></i>
                <span class="font-body text-[10px] text-ink-500">{{
                  order.addresses.label
                }}</span>
              </div>
              <p class="font-body text-sm font-medium text-ink">
                {{ order.addresses.recipient_name }}
              </p>
              <p class="font-body text-xs text-ink-500">
                {{ order.addresses.phone }}
              </p>
              <p class="font-body text-xs text-ink-500 leading-relaxed">
                {{ order.addresses.street }}, {{ order.addresses.city }},
                {{ order.addresses.province }} {{ order.addresses.postal_code }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div
          class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] overflow-hidden mb-6"
        >
          <div class="px-5 py-4 border-b border-ghost-200">
            <h2 class="font-display text-base text-ink">Produk Dipesan</h2>
          </div>
          <div class="divide-y divide-ghost-200">
            <div
              v-for="item in order.order_items"
              :key="item.id"
              class="flex items-center gap-4 px-5 py-4"
            >
              <div
                class="w-14 h-14 rounded-[var(--radius-md)] bg-ghost overflow-hidden shrink-0 border border-ghost-200"
              >
                <img
                  v-if="item.products?.image_url"
                  :src="item.products.image_url"
                  :alt="item.products?.name"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fa-solid fa-image text-ink-300"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-body text-sm font-medium text-ink truncate">
                  {{ item.products?.name }}
                </p>
                <p class="font-body text-xs text-ink-300 mt-0.5">
                  Rp {{ Number(item.unit_price).toLocaleString("id-ID") }} ×
                  {{ item.quantity }}
                </p>
              </div>
              <p class="font-display text-base text-ink shrink-0">
                Rp
                {{
                  (Number(item.unit_price) * item.quantity).toLocaleString(
                    "id-ID",
                  )
                }}
              </p>
            </div>
          </div>

          <!-- Total -->
          <div class="px-5 py-4 border-t border-ghost-200 bg-ghost space-y-2">
            <div
              class="flex items-center justify-between font-body text-sm text-ink-500"
            >
              <span>Subtotal</span>
              <span>Rp {{ subtotal.toLocaleString("id-ID") }}</span>
            </div>
            <div
              class="flex items-center justify-between font-body text-sm text-ink-500"
            >
              <span>Ongkos Kirim</span>
              <span :class="shippingCost === 0 ? 'text-success' : ''">
                {{
                  shippingCost === 0
                    ? "GRATIS"
                    : `Rp ${shippingCost.toLocaleString("id-ID")}`
                }}
              </span>
            </div>
            <div
              class="flex items-center justify-between font-display text-lg text-ink pt-1 border-t border-ghost-200"
            >
              <span>Total</span>
              <span
                >Rp
                {{ Number(order.total_price).toLocaleString("id-ID") }}</span
              >
            </div>
          </div>
        </div>

        <!-- Catatan -->
        <div
          v-if="order.notes"
          class="bg-white rounded-[var(--radius-lg)] border border-ghost-200 px-5 py-4 mb-6 flex items-start gap-3"
        >
          <i class="fa-solid fa-note-sticky text-ink-300 mt-0.5"></i>
          <div>
            <p class="font-body text-xs text-ink-300 mb-1">
              Catatan untuk Kurir
            </p>
            <p class="font-body text-sm text-ink">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/orders"
            class="flex-1 py-3 rounded-[var(--radius-md)] border border-ghost-300 text-ink font-body text-sm text-center hover:border-ink hover:bg-white transition-all duration-200"
          >
            <i class="fa-solid fa-list mr-2 text-xs"></i>
            Semua Order
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="flex-1 py-3 rounded-[var(--radius-md)] bg-ink text-ghost font-body text-sm text-center font-medium hover:bg-ink-800 transition-all duration-200"
          >
            <i class="fa-solid fa-bag-shopping mr-2 text-xs"></i>
            Belanja Lagi
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "auth" });

const supabase = useSupabaseClient();
const route = useRoute();

const order = ref(null);
const loading = ref(true);
const isNewOrder = ref(false);

const bankDetails = {
  bca: { name: "Bank BCA", number: "1234567890", account: "a/n Accesorix" },
  bni: { name: "Bank BNI", number: "0987654321", account: "a/n Accesorix" },
  mandiri: {
    name: "Bank Mandiri",
    number: "1122334455",
    account: "a/n Accesorix",
  },
};

const bankInfo = computed(
  () => bankDetails[order.value?.payment_method] || null,
);

const subtotal = computed(() => {
  if (!order.value?.order_items) return 0;
  return order.value.order_items.reduce(
    (sum, i) => sum + Number(i.unit_price) * i.quantity,
    0,
  );
});

const shippingCost = computed(() => {
  return Number(order.value?.total_price) - subtotal.value;
});

const statusSteps = computed(() => {
  const current = order.value?.status;
  const steps = [
    { label: "Order Dibuat", icon: "fa-solid fa-file-lines", key: "pending" },
    { label: "Diproses", icon: "fa-solid fa-gear", key: "processing" },
    { label: "Dikirim", icon: "fa-solid fa-truck", key: "shipped" },
    { label: "Selesai", icon: "fa-solid fa-circle-check", key: "delivered" },
  ];
  const order_map = ["pending", "processing", "shipped", "delivered"];
  const currentIndex = order_map.indexOf(current);
  return steps.map((s, i) => ({ ...s, reached: i <= currentIndex }));
});

const timelineWidth = computed(() => {
  const current = order.value?.status;
  const map = {
    pending: "0%",
    processing: "33%",
    shipped: "66%",
    delivered: "100%",
  };
  return map[current] || "0%";
});

function statusStyle(status) {
  const map = {
    pending: {
      label: "Menunggu Pembayaran",
      icon: "fa-solid fa-clock",
      class: "bg-amber-50 text-amber-700",
    },
    processing: {
      label: "Diproses",
      icon: "fa-solid fa-gear",
      class: "bg-blue-50 text-blue-700",
    },
    shipped: {
      label: "Dikirim",
      icon: "fa-solid fa-truck",
      class: "bg-purple-50 text-purple-700",
    },
    delivered: {
      label: "Selesai",
      icon: "fa-solid fa-circle-check",
      class: "bg-green-50 text-success",
    },
    cancelled: {
      label: "Dibatalkan",
      icon: "fa-solid fa-circle-xmark",
      class: "bg-red-50 text-danger",
    },
  };
  return map[status] || map.pending;
}

async function fetchOrder() {
  loading.value = true;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  const { data } = await supabase
    .from("orders")
    .select(
      `
      *,
      addresses(*),
      order_items(*, products(name, image_url))
    `,
    )
    .eq("id", route.params.id)
    .eq("user_id", session.user.id)
    .single();

  order.value = data;
  loading.value = false;

  // Cek apakah baru dari checkout
  const newOrderId = sessionStorage.getItem("new_order_id");
  if (newOrderId === route.params.id) {
    isNewOrder.value = true;
    sessionStorage.removeItem("new_order_id");
  }
}

onMounted(fetchOrder);
</script>
