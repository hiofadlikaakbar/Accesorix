<template>
  <div
    class="min-h-screen bg-ghost flex items-center justify-center px-4 py-12"
  >
    <div class="fixed inset-0 bg-ghost -z-10">
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="
          background-image: radial-gradient(
            circle,
            #0f0f0f 1px,
            transparent 1px
          );
          background-size: 28px 28px;
        "
      ></div>
    </div>

    <div class="w-full max-w-md">
      <!-- Logo / Brand -->
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-block">
          <span class="font-display text-3xl text-ink tracking-tight"
            >Accesorix</span
          >
        </NuxtLink>
        <p class="mt-2 text-sm text-ink-500 font-body">
          Selamat datang kembali
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-(--radius-xl) p-8 shadow-(--shadow-card) border border-ghost-200"
      >
        <!-- Error Alert -->
        <div
          v-if="errorMsg"
          class="mb-6 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-danger text-sm font-body flex items-center gap-2"
        >
          <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMsg }}
        </div>

        <form @submit.prevent="handleSignin" class="space-y-5">
          <!-- Email -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="kamu@email.com"
              required
              class="w-full px-4 py-3 rounded-md bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label
                class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
              >
                Password
              </label>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-xs text-ink-500 font-body hover:text-ink transition-colors"
              >
                Lupa password?
              </NuxtLink>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password kamu"
                required
                class="w-full px-4 py-3 pr-12 rounded-md bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink transition-colors"
              >
                <i
                  :class="
                    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "
                ></i>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full mt-2 py-3.5 rounded-md bg-ink text-ghost font-body font-medium text-sm tracking-wide shadow-(--shadow-btn) hover:bg-ink-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span
              v-if="loading"
              class="inline-block w-4 h-4 border-2 border-ghost-300 border-t-ghost rounded-full animate-spin"
            ></span>
            {{ loading ? "Memproses..." : "Masuk" }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-ghost-200"></div>
          <span class="text-xs text-ink-300 font-body">belum punya akun?</span>
          <div class="flex-1 h-px bg-ghost-200"></div>
        </div>

        <!-- Go to Signup -->
        <NuxtLink
          to="/auth/signup"
          class="block w-full py-3 rounded-md border border-ink-100 text-ink font-body font-medium text-sm text-center hover:border-ink hover:bg-ghost transition-all duration-200"
        >
          Daftar Sekarang
        </NuxtLink>
      </div>

      <p class="text-center text-xs text-ink-300 font-body mt-6">
        © 2025 Accesorix. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const supabase = useSupabaseClient();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const errorMsg = ref("");
const showPassword = ref(false);

async function handleSignin() {
  errorMsg.value = "";
  loading.value = true;

  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });

  loading.value = false;

  if (error) {
    errorMsg.value = "Email atau password salah.";
  } else {
    router.push("/");
  }
}
</script>
