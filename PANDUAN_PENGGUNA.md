# Panduan Penggunaan & Kustomisasi Website
**SMP Citra Bangsa Bondowoso (Trabas Enviropreneurschool)**

Dokumen ini berisi petunjuk lengkap untuk mengedit fitur website, menghubungkan media sosial sekolah, dan menjalankan sistem sinkronisasi otomatis.

---

## 🚀 Halaman khusus Admin (CMS) - Edit Tanpa Sentuh Kode
Kabar baik! Saya telah membuatkan **Admin Panel (CMS)** khusus agar Anda dapat mengubah konten teks, angka statistik, visi-misi, serta menambah/menghapus postingan media sosial langsung melalui browser **tanpa perlu menyentuh kode pemrograman**.

*   **Tautan Akses**: Buka browser Anda di: **[http://localhost:3000/admin](http://localhost:3000/admin)**
*   **Kata Sandi (Passcode)**: `trabas123`

### Fitur di Admin Panel:
1.  **Identitas & Visi Misi**: Mengubah judul besar hero, slogan pembuka, kalimat visi, dan butir-butir misi sekolah.
2.  **Statistik Sekolah**: Mengubah jumlah siswa aktif, guru/staf, penghargaan, dan program lingkungan hidup.
3.  **Program Unggulan**: Mengubah judul dan penjelasan 3 program utama sekolah.
4.  **Kegiatan Sosmed**: Menambahkan postingan baru (Instagram, YouTube, TikTok, Facebook) dengan mengisi judul, deskripsi, tanggal, likes, serta link gambar/video. Juga tersedia daftar untuk menghapus postingan lama dari grid depan.

---

## 📁 Struktur Folder Proyek
Berikut adalah file utama yang dapat Anda edit:
*   `src/app/page.js`: Berisi semua konten halaman utama (Hero, Visi Misi, Kegiatan, Program, Form PPDB, dll.).
*   `src/app/globals.css`: Berisi variabel warna (hijau/emas), gaya tulisan (font), dan utilitas desain (seperti *glassmorphism*).
*   `src/components/Navbar.js`: Navigasi menu atas yang melayang (sticky) dan responsif mobile.
*   `src/components/Footer.js`: Bagian kaki halaman yang berisi kontak sekolah dan link sosial media.
*   `scripts/fetch-feeds.js`: Script sinkronisasi data media sosial (Instagram, TikTok, Facebook, YouTube).
*   `data/social-cache.json`: Database lokal yang menyimpan postingan terbaru media sosial hasil sinkronisasi.
*   `public/`: Folder aset gambar (logo, background, dll.).

---

## 🎨 1. Cara Mengedit Fitur & Desain Website

### A. Mengubah Warna Utama Sekolah
Website ini menggunakan skema warna **Enviropreneur (Hijau & Emas)**. Anda dapat menyesuaikan kode warnanya di file `src/app/globals.css`:
```css
@theme {
  --color-brand-green-dark: #022c22;  /* Hijau Gelap */
  --color-brand-green-mid: #059669;   /* Hijau Utama */
  --color-brand-green-light: #34d399; /* Hijau Terang */
  --color-brand-gold: #fbbf24;        /* Emas */
  --color-brand-gold-dark: #d97706;   /* Emas Gelap */
}
```

### B. Mengubah Informasi Text / Konten Halaman
Semua konten teks utama berada di file `src/app/page.js`. Anda dapat membukanya dan langsung mengubah kalimat atau angkanya. Contoh:
*   Untuk mengubah **Statistik Sekolah**, cari konstanta `STATS` atau ubah nilai counter di dalam `useEffect`.
*   Untuk mengubah **Visi & Misi**, cari bagian kontainer `<section id="visi-misi">` dan edit teksnya.
*   Untuk mengubah **Program Unggulan**, edit array `PROGRAMS`.

### C. Mengganti Logo & Gambar Hero
Ganti file gambar berikut di dalam folder `public/` dengan gambar baru Anda (pastikan nama file dan formatnya sama):
*   `public/logo.jpg`: Logo sekolah (format rasio 1:1 bulat).
*   `public/hero-bg.jpg`: Gambar latar belakang halaman depan (format rasio 16:9).

---

## 🌐 2. Cara Menghubungkan & Sinkronisasi Sosial Media

Sistem feed sosial media di website ini menggunakan script sinkronisasi mandiri yang membaca data terbaru dan menyimpannya di file cache lokal agar website memuat dengan sangat cepat dan terhindar dari pemblokiran *rate-limiting* (terutama dari Instagram & TikTok).

### A. Mengubah Username / Akun Media Sosial
Buka file `scripts/fetch-feeds.js` dan sesuaikan link akun resmi sekolah pada konstanta `FEEDS` di bagian atas:
```javascript
const FEEDS = {
  instagram: 'https://www.instagram.com/smpcitrabangsa.bws/',
  tiktok: 'https://www.tiktok.com/@smpcitrabangsa.bws',
  facebook: 'https://www.facebook.com/smpcitrangsa.bws',
  youtube: 'https://www.youtube.com/@trabasbondowoso'
};
```

### B. Mengisi Data Berita / Kegiatan Manual (Jika Diperlukan)
Jika media sosial sekolah sedang tidak aktif atau Anda ingin mempublikasikan berita secara manual, Anda dapat mengedit array `MOCK_FEEDS` di dalam `scripts/fetch-feeds.js` atau langsung mengubah file database cache di `data/social-cache.json`.

### C. Menjalankan Sinkronisasi Otomatis (Cron Job)
Untuk mengambil postingan terbaru dari media sosial secara berkala, Anda dapat membuat jadwal tugas otomatis (*cron job* di Linux atau *Task Scheduler* di Windows) untuk menjalankan perintah sinkronisasi ini setiap 6 jam sekali:
```bash
node scripts/fetch-feeds.js
```
Script ini akan:
1. Membaca aktivitas terbaru di YouTube/Instagram.
2. Memperbarui isi data di file `data/social-cache.json`.
3. Halaman website akan otomatis menampilkan data terbaru tersebut saat dimuat ulang.

### D. Opsional: Integrasi API Resmi
Jika di masa mendatang sekolah memiliki API Token resmi (seperti *Instagram Graph API* atau *YouTube Data API v3*), Anda dapat memperbarui fungsi `scrapeFeeds()` di dalam `scripts/fetch-feeds.js` untuk melakukan request menggunakan Axios dengan melampirkan token keamanan Anda.

---

## 💻 3. Cara Menjalankan Website Secara Lokal

Untuk menguji perubahan yang Anda buat, jalankan perintah berikut di terminal Anda:
1.  **Masuk ke folder proyek:**
    ```bash
    cd C:\Users\mur5y\.gemini\antigravity\scratch\smp-citra-bangsa-web
    ```
2.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
3.  Buka browser Anda dan akses **[http://localhost:3000](http://localhost:3000)**.
