<template>
  <div class="fixed bottom-5 right-5 z-50">
    <!-- Chat Box -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="w-[350px] h-[500px] bg-white border border-ghost-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4"
      >
        <!-- Header -->
        <div
          class="bg-ink text-white px-5 py-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <i class="fa-solid fa-robot text-sm"></i>
            </div>
            <div>
              <p class="font-medium text-sm">Accesorix AI</p>
              <p class="text-[11px] text-white/60">Online</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="messages.length > 1"
              @click="clearChat"
              title="Bersihkan Percakapan"
              class="text-white/60 hover:text-white transition-colors p-1 text-xs"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <button
              @click="isOpen = false"
              class="text-white/60 hover:text-white transition-colors p-1"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#fafafa]"
        >
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="
              msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            "
          >
            <div class="max-w-[85%]">
              <!-- Bubble -->
              <div
                :class="
                  msg.role === 'user'
                    ? 'bg-ink text-white'
                    : 'bg-white border border-ghost-200 text-ink'
                "
                class="px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm"
              >
                {{ msg.content }}
              </div>

              <!-- Product Cards -->
              <div v-if="msg.products?.length" class="mt-3 space-y-2">
                <div
                  v-for="product in msg.products"
                  :key="product.id"
                  class="bg-white border border-ghost-200 rounded-2xl p-3 flex gap-3 shadow-sm"
                >
                  <!-- Image -->
                  <img
                    v-if="product.image_url"
                    :src="product.image_url"
                    :alt="product.name"
                    class="w-16 h-16 rounded-xl object-cover"
                  />

                  <div
                    v-else
                    class="w-16 h-16 rounded-xl bg-ghost flex items-center justify-center"
                  >
                    <i class="fa-solid fa-image text-ink-300"></i>
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-ink">
                      {{ product.name }}
                    </p>

                    <p class="text-xs text-ink-400 mt-1">
                      {{ product.categories?.name }}
                    </p>

                    <p class="text-xs text-ink-500 mt-1 line-clamp-2">
                      {{ product.description }}
                    </p>

                    <p class="text-sm font-semibold text-ink mt-2">
                      Rp {{ Number(product.price).toLocaleString("id-ID") }}
                    </p>

                    <NuxtLink
                      :to="`/products/${product.slug}`"
                      class="inline-flex items-center gap-1 text-xs text-ink mt-2 hover:underline"
                    >
                      Lihat Detail
                      <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="flex justify-start">
            <div
              class="bg-white border border-ghost-200 px-4 py-3 rounded-2xl text-sm"
            >
              Mengetik...
            </div>
          </div>
        </div>

        <!-- Input -->
        <form
          @submit.prevent="sendMessage"
          class="p-4 border-t border-ghost-200 bg-white"
        >
          <div class="flex items-center gap-2">
            <input
              v-model="input"
              type="text"
              placeholder="Tanyakan produk..."
              class="flex-1 px-4 py-3 rounded-2xl border border-ghost-200 outline-none text-sm"
            />

            <button
              type="submit"
              class="w-11 h-11 rounded-full bg-ink text-white flex items-center justify-center"
            >
              <i class="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </form>
      </div>
    </transition>

    <!-- Floating Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-16 h-16 rounded-full bg-ink text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-all"
    >
      <i class="fa-solid fa-robot text-xl"></i>
    </button>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

const DEFAULT_WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Halo 👋 Saya AI Assistant Accesorix. Bisa bantu cari headset, charger, atau aksesoris HP lainnya.",
};

// Global reactive states across pages
const isOpen = useState("chatbot_is_open", () => false);
const messages = useState("chatbot_messages", () => [DEFAULT_WELCOME_MESSAGE]);

const input = ref("");
const loading = ref(false);
const chatContainer = ref(null);

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

// Hydrate from localStorage on client-side
onMounted(() => {
  if (import.meta.client) {
    try {
      const savedMessages = localStorage.getItem("accesorix_chat_messages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          messages.value = parsed;
        }
      }

      const savedOpen = localStorage.getItem("accesorix_chat_open");
      if (savedOpen !== null) {
        isOpen.value = savedOpen === "true";
      }
    } catch (e) {
      console.warn("Failed to load chat history from localStorage", e);
    }
  }

  if (isOpen.value) {
    scrollToBottom();
  }
});

// Sync messages to localStorage
watch(
  messages,
  (newMessages) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          "accesorix_chat_messages",
          JSON.stringify(newMessages),
        );
      } catch (e) {
        console.warn("Failed to save chat messages to localStorage", e);
      }
    }
  },
  { deep: true },
);

// Sync open/close state to localStorage
watch(isOpen, (newVal) => {
  if (import.meta.client) {
    try {
      localStorage.setItem("accesorix_chat_open", String(newVal));
    } catch (e) {
      console.warn("Failed to save chat open state to localStorage", e);
    }
  }
  if (newVal) {
    scrollToBottom();
  }
});

function clearChat() {
  messages.value = [DEFAULT_WELCOME_MESSAGE];
  if (import.meta.client) {
    try {
      localStorage.setItem(
        "accesorix_chat_messages",
        JSON.stringify(messages.value),
      );
    } catch (e) {
      console.warn("Failed to clear chat storage", e);
    }
  }
}

async function sendMessage() {
  if (!input.value.trim()) return;

  const userMessage = input.value;

  messages.value.push({
    role: "user",
    content: userMessage,
  });

  input.value = "";
  loading.value = true;
  scrollToBottom();

  try {
    // Get the active session token to forward to the server for role resolution
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token ?? null;

    const res = await $fetch("/api/chat", {
      method: "POST",
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
      body: {
        message: userMessage,
      },
    });

    messages.value.push({
      role: "assistant",
      content: res.reply || res.error || "Terjadi kesalahan.",
      products: res.products || [],
    });
  } catch (err) {
    messages.value.push({
      role: "assistant",
      content: "Terjadi kesalahan.",
    });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

