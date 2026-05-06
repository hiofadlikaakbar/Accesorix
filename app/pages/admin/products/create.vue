<template>
  <div class="min-h-screen bg-ghost">
    <div class="max-w-2xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink
          to="/admin/products"
          class="w-9 h-9 rounded-[var(--radius-sm)] border border-ghost-300 flex items-center justify-center text-ink-500 hover:text-ink hover:border-ink transition-all duration-200"
        >
          <i class="fa-solid fa-arrow-left text-xs"></i>
        </NuxtLink>
        <div>
          <p
            class="font-body text-xs text-ink-300 uppercase tracking-widest mb-1"
          >
            Admin Panel
          </p>
          <h1 class="font-display text-2xl text-ink">Tambah Produk</h1>
        </div>
      </div>

      <!-- Success -->
      <div
        v-if="successMsg"
        class="mb-6 px-4 py-3 rounded-[var(--radius-md)] bg-green-50 border border-green-200 text-success text-sm font-body flex items-center gap-2"
      >
        <i class="fa-solid fa-circle-check"></i> {{ successMsg }}
      </div>

      <!-- Error -->
      <div
        v-if="errorMsg"
        class="mb-6 px-4 py-3 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-danger text-sm font-body flex items-center gap-2"
      >
        <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
      </div>

      <div
        class="bg-white rounded-[var(--radius-xl)] border border-ghost-200 shadow-[var(--shadow-soft)] p-8 space-y-6"
      >
        <!-- Upload Gambar -->
        <div class="space-y-2">
          <label
            class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
          >
            Foto Produk
          </label>
          <div
            class="relative border-2 border-dashed rounded-[var(--radius-lg)] transition-all duration-200 overflow-hidden"
            :class="
              imagePreview
                ? 'border-ink-300'
                : 'border-ghost-300 hover:border-ink-300'
            "
          >
            <!-- Preview -->
            <div v-if="imagePreview" class="relative aspect-video">
              <img :src="imagePreview" class="w-full h-full object-cover" />
              <button
                @click="clearImage"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-ink/70 backdrop-blur-sm text-white flex items-center justify-center hover:bg-ink transition-all duration-200"
              >
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <!-- Upload Area -->
            <div
              v-else
              class="aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer bg-ghost hover:bg-ghost-100 transition-colors duration-200"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div
                class="w-12 h-12 rounded-full bg-white border border-ghost-200 flex items-center justify-center shadow-[var(--shadow-soft)]"
              >
                <i class="fa-solid fa-cloud-arrow-up text-xl text-ink-300"></i>
              </div>
              <div class="text-center">
                <p class="font-body text-sm font-medium text-ink">
                  Klik atau drag & drop foto
                </p>
                <p class="font-body text-xs text-ink-300 mt-0.5">
                  PNG, JPG, WEBP — Maks. 2MB
                </p>
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            />
          </div>
        </div>

        <!-- Nama Produk -->
        <div class="space-y-1.5">
          <label
            class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >Nama Produk</label
          >
          <input
            v-model="form.name"
            type="text"
            placeholder="Contoh: Case iPhone 15 Pro Transparan"
            class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
          />
        </div>

        <!-- Slug -->
        <div class="space-y-1.5">
          <label
            class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >Slug</label
          >
          <input
            v-model="form.slug"
            type="text"
            placeholder="case-iphone-15-pro-transparan"
            class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
          />
          <p class="font-body text-xs text-ink-300">
            Auto-generate dari nama, bisa diedit manual.
          </p>
        </div>

        <!-- Kategori -->
        <div class="space-y-1.5">
          <label
            class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >Kategori</label
          >
          <select
            v-model="form.category_id"
            class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
          >
            <option value="" disabled>Pilih kategori...</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Deskripsi -->
        <div class="space-y-1.5">
          <label
            class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
            >Deskripsi</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Deskripsi singkat produk..."
            class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200 resize-none"
          ></textarea>
        </div>

        <!-- Harga & Stok -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
              >Harga (Rp)</label
            >
            <input
              v-model="form.price"
              type="number"
              placeholder="150000"
              min="0"
              class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="block text-xs font-body font-medium text-ink-700 uppercase tracking-widest"
              >Stok</label
            >
            <input
              v-model="form.stock"
              type="number"
              placeholder="100"
              min="0"
              class="w-full px-4 py-3 rounded-[var(--radius-md)] bg-ghost border border-ghost-300 text-ink font-body text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        <!-- Toggle -->
        <div class="flex flex-col gap-4 pt-2">
          <label class="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p class="font-body text-sm font-medium text-ink">Produk Baru</p>
              <p class="font-body text-xs text-ink-300">
                Ditampilkan di seksi AI Rekomendasi
              </p>
            </div>
            <div class="relative">
              <input type="checkbox" v-model="form.is_new" class="sr-only" />
              <div
                class="w-11 h-6 rounded-full transition-colors duration-200"
                :class="form.is_new ? 'bg-ink' : 'bg-ghost-300'"
              >
                <div
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  :class="form.is_new ? 'translate-x-5' : 'translate-x-0'"
                ></div>
              </div>
            </div>
          </label>

          <label class="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p class="font-body text-sm font-medium text-ink">
                Produk Unggulan
              </p>
              <p class="font-body text-xs text-ink-300">
                Ditampilkan di seksi Produk Unggulan
              </p>
            </div>
            <div class="relative">
              <input
                type="checkbox"
                v-model="form.is_featured"
                class="sr-only"
              />
              <div
                class="w-11 h-6 rounded-full transition-colors duration-200"
                :class="form.is_featured ? 'bg-ink' : 'bg-ghost-300'"
              >
                <div
                  class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  :class="form.is_featured ? 'translate-x-5' : 'translate-x-0'"
                ></div>
              </div>
            </div>
          </label>
        </div>

        <!-- Submit -->
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="w-full py-3.5 rounded-[var(--radius-md)] bg-ink text-ghost font-body font-medium text-sm shadow-[var(--shadow-btn)] hover:bg-ink-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span
            v-if="loading"
            class="inline-block w-4 h-4 border-2 border-ghost-300 border-t-ghost rounded-full animate-spin"
          ></span>
          {{ loading ? "Menyimpan..." : "Simpan Produk" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: "admin", layout: false });

const supabase = useSupabaseClient();
const router = useRouter();

const categories = ref([]);
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const imagePreview = ref(null);
const imageFile = ref(null);
const fileInput = ref(null);

const form = reactive({
  name: "",
  slug: "",
  category_id: "",
  description: "",
  price: "",
  stock: "",
  is_new: true,
  is_featured: false,
});

// Auto generate slug dari nama
watch(
  () => form.name,
  (val) => {
    form.slug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  },
);

async function fetchCategories() {
  const { data } = await supabase.from("categories").select("*").order("name");
  categories.value = data || [];
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) processImage(file);
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) processImage(file);
}

function processImage(file) {
  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = "Ukuran gambar maksimal 2MB.";
    return;
  }
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
}

function clearImage() {
  imageFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function handleSubmit() {
  errorMsg.value = "";
  successMsg.value = "";

  if (
    !form.name ||
    !form.slug ||
    !form.category_id ||
    !form.price ||
    !form.stock
  ) {
    errorMsg.value = "Semua field wajib diisi kecuali deskripsi.";
    return;
  }

  loading.value = true;

  try {
    let image_url = null;

    // Upload gambar ke Supabase Storage
    if (imageFile.value) {
      const ext = imageFile.value.name.split(".").pop();
      const fileName = `${form.slug}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile.value, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    // Simpan produk ke database
    const { error: insertError } = await supabase.from("products").insert({
      name: form.name,
      slug: form.slug,
      category_id: form.category_id,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      is_new: form.is_new,
      is_featured: form.is_featured,
      image_url,
    });

    if (insertError) throw insertError;

    successMsg.value = "Produk berhasil disimpan!";
    setTimeout(() => router.push("/admin/products"), 1500);
  } catch (err) {
    errorMsg.value = err.message || "Terjadi kesalahan. Coba lagi.";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchCategories);
</script>
