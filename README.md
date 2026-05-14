# Accesorix - Web Penjualan Aksesoris Handphone

Accesorix adalah aplikasi web berbasis e-commerce yang dibangun menggunakan Nuxt.js dan Tailwind CSS. Sistem ini dilengkapi dengan integrasi AI untuk memberikan rekomendasi produk secara otomatis.

---

## Teknologi Utama

- **Frontend**: Nuxt.js, Tailwind CSS  
- **AI Integration**: Mistral AI API
- **Environment**: Docker  
- **Deployment**: Git, SSH, Ngrok  

---

## Fitur Utama

- Menampilkan katalog produk aksesoris handphone  
- Sistem kategori dan detail produk  
- Keranjang belanja dan checkout  
- Panel admin untuk manajemen produk  
- Integrasi AI untuk rekomendasi dan deskripsi produk  

---

## 🔄 Alur Implementasi Sistem

### 1. Version Control & Repository
Project dikelola menggunakan Git dan disimpan pada GitHub untuk memudahkan kolaborasi serta deployment.

---

### 2. Containerization dengan Docker
Aplikasi dijalankan dalam container Docker untuk memastikan konsistensi environment.

Konfigurasi utama:
- Base image: Node.js 20  
- Instalasi OpenSSH untuk akses remote  
- Build aplikasi Nuxt  
- Expose port:
  - `3000` → aplikasi web  
  - `22` → SSH  

---

### 3. Integrasi AI (Mistral AI)
Sistem terintegrasi dengan Mistral AI API untuk:
- menghasilkan deskripsi produk otomatis  
- memberikan rekomendasi produk berdasarkan data input  

---

### 4. Akses Server via SSH
Server (container Docker) dapat diakses menggunakan SSH untuk:
- manajemen aplikasi  
- monitoring  
- update sistem  

Contoh akses:
```bash
ssh root@localhost -p 2222
