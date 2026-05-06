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

    <div class="w-full max-w-md lg:max-w-xl">
      <!-- Logo / Brand -->
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-block">
          <span
            class="font-display text-3xl lg:text-5xl text-ink tracking-tight"
            >Accesorix</span
          >
        </NuxtLink>
        <p class="mt-2 text-sm lg:text-lg text-ink-500 font-body">
          Buat akun baru kamu
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

        <!-- Success Alert -->
        <div
          v-if="successMsg"
          class="mb-6 px-4 py-3 rounded-md bg-green-50 border border-green-200 text-success text-sm font-body flex items-center gap-2"
        >
          <i class="fa-solid fa-check"></i> {{ successMsg }}
        </div>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <!-- Full Name -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >
              Nama Lengkap
            </label>
            <input
              v-model="form.fullName"
              type="text"
              placeholder="Nama..."
              required
              class="w-full px-4 py-3 rounded-md bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >
              Email
            </label>
            <input
              v-model="form.email"
              type="email..."
              placeholder="kamu@email.com"
              required
              class="w-full px-4 py-3 rounded-md bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>

          <!-- Phone -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >
              No. Telepon
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              class="w-full px-4 py-3 rounded-md bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 karakter"
                required
                minlength="8"
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

          <!-- Confirm Password -->
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >
              Konfirmasi Password
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Ulangi password"
              required
              class="w-full px-4 py-3 rounded-md bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
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
            {{ loading ? "Memproses..." : "Buat Akun" }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-ghost-200"></div>
          <span class="text-xs text-ink-300 font-body">sudah punya akun?</span>
          <div class="flex-1 h-px bg-ghost-200"></div>
        </div>

        <!-- Go to Signin -->
        <NuxtLink
          to="/auth/signin"
          class="block w-full py-3 rounded-md border border-ink-100 text-ink font-body font-medium text-sm text-center hover:border-ink hover:bg-ghost transition-all duration-200"
        >
          Masuk Sekarang
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

const form = reactive({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const showPassword = ref(false);

async function handleSignup() {
  errorMsg.value = "";
  successMsg.value = "";

  if (form.password !== form.confirmPassword) {
    errorMsg.value = "Password dan konfirmasi password tidak cocok.";
    return;
  }

  if (form.password.length < 8) {
    errorMsg.value = "Password minimal 8 karakter.";
    return;
  }

  loading.value = true;

  const { error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        full_name: form.fullName,
        phone: form.phone,
      },
    },
  });

  loading.value = false;

  if (error) {
    errorMsg.value = error.message;
  } else {
    successMsg.value = "Akun berhasil dibuat! Cek email kamu untuk verifikasi.";
    form.fullName = "";
    form.email = "";
    form.phone = "";
    form.password = "";
    form.confirmPassword = "";
  }
}
</script>
