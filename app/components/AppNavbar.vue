<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="
      scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-(--shadow-soft) border-b border-ghost-200'
        : 'bg-ghost'
    "
  >
    <nav
      class="max-w-full mx-auto px-5 lg:px-20 h-16 flex items-center justify-between gap-6"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div
          class="w-8 h-8 rounded-sm bg-ink flex items-center justify-center shadow-(--shadow-btn) group-hover:scale-105 transition-transform duration-200"
        >
          <i class="fa-solid fa-bolt text-ghost text-xs"></i>
        </div>

        <span class="font-display text-xl text-ink tracking-tight">
          accesorix
        </span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <div class="hidden lg:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost-100 transition-all duration-200"
          active-class="text-ink bg-ghost-100 font-medium"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-3">
        <!-- Cart -->
        <NuxtLink
          to="/cart"
          class="hidden lg:flex relative w-9 h-9 items-center justify-center rounded-sm text-ink-500 hover:text-ink hover:bg-ghost-100 transition-all duration-200"
        >
          <i class="fa-solid fa-bag-shopping text-sm"></i>

          <span
            v-if="cartCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ink text-ghost text-[10px] font-body font-medium rounded-full flex items-center justify-center"
          >
            {{ cartCount > 9 ? "9+" : cartCount }}
          </span>
        </NuxtLink>

        <!-- Guest -->
        <template v-if="!user">
          <NuxtLink
            to="/auth/signin"
            class="hidden lg:block px-4 py-2 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost-100 transition-all duration-200"
          >
            Masuk
          </NuxtLink>

          <NuxtLink
            to="/auth/signup"
            class="hidden lg:block px-4 py-2 rounded-sm bg-ink text-ghost font-body text-sm font-medium shadow-(--shadow-btn) hover:bg-ink-800 active:scale-95 transition-all duration-200"
          >
            Daftar
          </NuxtLink>
        </template>

        <!-- Logged In -->
        <template v-else>
          <div class="hidden lg:block relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2.5 px-3 py-2 rounded-sm hover:bg-ghost-100 transition-all duration-200"
            >
              <div
                class="w-7 h-7 rounded-full bg-ink flex items-center justify-center"
              >
                <span class="text-ghost text-xs font-body font-medium">
                  {{ userInitial }}
                </span>
              </div>

              <span
                class="font-body text-sm text-ink font-medium max-w-30 truncate"
              >
                {{ userName }}
              </span>

              <i
                class="fa-solid fa-chevron-down text-ink-300 text-xs transition-transform duration-200"
                :class="dropdownOpen ? 'rotate-180' : ''"
              ></i>
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-full mt-2 w-52 bg-white rounded-(--radius-lg) shadow-(--shadow-card) border border-ghost-200 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-ghost-200">
                  <p class="font-body text-xs text-ink-300 mb-0.5">
                    Masuk sebagai
                  </p>

                  <p class="font-body text-sm text-ink font-medium truncate">
                    {{ userName }}
                  </p>
                </div>

                <div class="p-1.5">
                  <NuxtLink
                    to="/cart"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200"
                  >
                    <i class="fa-solid fa-box w-4 text-center"></i>
                    Pesanan Saya
                  </NuxtLink>

                  <!-- Dashboard Admin -->
                  <NuxtLink
                    v-if="isAdmin"
                    to="/admin/products"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200"
                  >
                    <i class="fa-solid fa-chart-line w-4 text-center"></i>
                    Dashboard
                  </NuxtLink>
                </div>

                <div class="p-1.5 border-t border-ghost-200">
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-danger hover:bg-red-50 transition-all duration-200"
                  >
                    <i
                      class="fa-solid fa-arrow-right-from-bracket w-4 text-center"
                    ></i>

                    Keluar
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>

        <!-- Mobile Button -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden w-9 h-9 flex items-center justify-center rounded-sm text-ink-500 hover:text-ink hover:bg-ghost-100 transition-all duration-200"
        >
          <i
            :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"
            class="text-sm"
          ></i>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="lg:hidden bg-white border-t border-ghost-200 shadow-(--shadow-soft)"
      >
        <div class="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
          <!-- Links -->
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="mobileOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200"
            active-class="text-ink bg-ghost font-medium"
          >
            <i :class="link.icon" class="w-4 text-center text-ink-300"></i>
            {{ link.label }}
          </NuxtLink>

          <!-- Dashboard Mobile -->
          <NuxtLink
            v-if="isAdmin"
            to="/admin/products"
            @click="mobileOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200"
          >
            <i class="fa-solid fa-chart-line w-4 text-center text-ink-300"></i>
            Dashboard
          </NuxtLink>

          <div class="h-px bg-ghost-200 my-1"></div>

          <!-- Guest -->
          <template v-if="!user">
            <NuxtLink
              to="/auth/signin"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-ink-500 hover:text-ink hover:bg-ghost transition-all duration-200"
            >
              <i
                class="fa-solid fa-arrow-right-to-bracket w-4 text-center text-ink-300"
              ></i>

              Masuk
            </NuxtLink>
          </template>

          <!-- User -->
          <template v-else>
            <button
              @click="handleLogout"
              class="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-danger hover:bg-red-50 transition-all duration-200 w-full"
            >
              <i
                class="fa-solid fa-arrow-right-from-bracket w-4 text-center"
              ></i>

              Keluar
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const scrolled = ref(false);
const dropdownOpen = ref(false);
const mobileOpen = ref(false);
const dropdownRef = ref(null);
const cartCount = ref(0);

const isAdmin = ref(false);

// cek admin
watch(
  () => user.value,
  async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    console.log(currentUser);

    if (!currentUser) {
      isAdmin.value = false;
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    console.log("PROFILE:", data);
    console.log("ERROR:", error);

    isAdmin.value = data?.role === "admin";
  },
  { immediate: true },
);

const navLinks = computed(() => {
  const links = [
    {
      to: "/",
      label: "Beranda",
      icon: "fa-solid fa-house",
    },
    {
      to: "/products",
      label: "Produk",
      icon: "fa-solid fa-box",
    },
    {
      to: "/categories",
      label: "Kategori",
      icon: "fa-solid fa-layer-group",
    },
  ];

  if (isAdmin.value) {
    links.push({
      to: "/admin/products",
      label: "Dashboard",
      icon: "fa-solid fa-chart-line",
    });
  }

  return links;
});

const userName = computed(() => {
  return (
    user.value?.user_metadata?.full_name ||
    user.value?.email?.split("@")[0] ||
    "User"
  );
});

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase();
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("click", handleClickOutside);
});

function handleScroll() {
  scrolled.value = window.scrollY > 10;
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

async function handleLogout() {
  dropdownOpen.value = false;
  mobileOpen.value = false;

  await supabase.auth.signOut();

  router.push("/auth/signin");
}
</script>
