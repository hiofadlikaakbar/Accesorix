<template>
  <div class="fixed bottom-5 right-5 z-50">
    <!-- Chat Box -->
    <transition name="fade">
      <div
        v-if="open"
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

          <button @click="open = false">
            <i class="fa-solid fa-xmark"></i>
          </button>
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
            <div
              :class="
                msg.role === 'user'
                  ? 'bg-ink text-white'
                  : 'bg-white border border-ghost-200 text-ink'
              "
              class="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm"
            >
              {{ msg.content }}
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
      @click="open = !open"
      class="w-16 h-16 rounded-full bg-ink text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-all"
    >
      <i class="fa-solid fa-robot text-xl"></i>
    </button>
  </div>
</template>

<script setup>
const open = ref(false);
const input = ref("");
const loading = ref(false);

const messages = ref([
  {
    role: "assistant",
    content:
      "Halo 👋 Saya AI Assistant Accesorix. Bisa bantu cari headset, charger, atau aksesoris HP lainnya.",
  },
]);

const chatContainer = ref(null);

async function sendMessage() {
  if (!input.value.trim()) return;

  const userMessage = input.value;

  messages.value.push({
    role: "user",
    content: userMessage,
  });

  input.value = "";
  loading.value = true;

  try {
    const res = await $fetch("/api/chat", {
      method: "POST",
      body: {
        message: userMessage,
      },
    });

    messages.value.push({
      role: "assistant",
      content: res.reply,
    });
  } catch (err) {
    messages.value.push({
      role: "assistant",
      content: "Terjadi kesalahan.",
    });
  }

  loading.value = false;

  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
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
