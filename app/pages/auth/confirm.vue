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
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-block">
          <span class="font-display text-3xl text-ink tracking-tight"
            >accesorix</span
          >
        </NuxtLink>
      </div>

      <div
        class="bg-white rounded-(--radius-xl) p-10 shadow-(--shadow-card) border border-ghost-200 text-center"
      >
        <!-- Loading -->
        <div v-if="status === 'loading'" class="space-y-4">
          <div
            class="w-16 h-16 rounded-full bg-ghost flex items-center justify-center mx-auto"
          >
            <i
              class="fa-solid fa-circle-notch fa-spin text-2xl text-ink-500"
            ></i>
          </div>
          <p class="font-body text-ink-500 text-sm">
            Memverifikasi email kamu...
          </p>
        </div>

        <!-- Success -->
        <div v-else-if="status === 'success'" class="space-y-5">
          <div
            class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto"
          >
            <i class="fa-solid fa-circle-check text-3xl text-success"></i>
          </div>
          <div>
            <h1 class="font-display text-2xl text-ink mb-2">
              Email Terkonfirmasi!
            </h1>
            <p class="font-body text-ink-500 text-sm leading-relaxed">
              Selamat! Akun kamu sudah aktif dan siap digunakan.
            </p>
          </div>
          <div class="px-4 py-3 rounded-md bg-ghost border border-ghost-200">
            <p class="text-xs font-body text-ink-500">
              Otomatis masuk dalam
              <span class="font-medium text-ink">{{ countdown }} detik</span>
            </p>
          </div>
          <NuxtLink
            to="/auth/signin"
            class="block w-full py-3.5 rounded-md bg-ink text-ghost font-body font-medium text-sm tracking-wide shadow-(--shadow-btn) hover:bg-ink-800 transition-all duration-200"
          >
            Masuk Sekarang
          </NuxtLink>
        </div>

        <!-- Error -->
        <div v-else-if="status === 'error'" class="space-y-5">
          <div
            class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto"
          >
            <i class="fa-solid fa-circle-xmark text-3xl text-danger"></i>
          </div>
          <div>
            <h1 class="font-display text-2xl text-ink mb-2">
              Link Tidak Valid
            </h1>
            <p class="font-body text-ink-500 text-sm leading-relaxed">
              Link konfirmasi sudah kedaluwarsa atau tidak valid.<br />Silakan
              daftar ulang atau minta kirim ulang email verifikasi.
            </p>
          </div>
          <NuxtLink
            to="/auth/signup"
            class="block w-full py-3.5 rounded-md bg-ink text-ghost font-body font-medium text-sm tracking-wide shadow-(--shadow-btn) hover:bg-ink-800 transition-all duration-200"
          >
            Daftar Ulang
          </NuxtLink>
          <NuxtLink
            to="/auth/signin"
            class="block w-full py-3 rounded-md border border-ink-100 text-ink font-body font-medium text-sm text-center hover:border-ink hover:bg-ghost transition-all duration-200"
          >
            Sudah Punya Akun? Masuk
          </NuxtLink>
        </div>
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
const route = useRoute();

const status = ref("loading");
const countdown = ref(5);

onMounted(async () => {
  const tokenHash = route.query.token_hash;
  const type = route.query.type;
  const errorCode = route.query.error_code;

  // Ada error dari Supabase
  if (errorCode) {
    status.value = "error";
    return;
  }

  // PKCE flow — pakai token_hash dari query param
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type,
    });

    if (error) {
      console.error("Verify OTP error:", error.message);
      status.value = "error";
      return;
    }

    status.value = "success";
    startCountdown();
    return;
  }

  status.value = "error";
});

function startCountdown() {
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      router.push("/");
    }
  }, 1000);
}
</script>
