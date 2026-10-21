# Portal Kedinasan RI — Panduan Edukasi Studi & Karier ASN

Website media literasi edukasi independen mengenai perguruan tinggi kedinasan di Indonesia, dirancang khusus untuk siswa SMA, MA, dan SMK yang ingin mengenal jalur ikatan dinas, persyaratan seleksi, alur penerimaan terpadu BKN, dan prospek karier sebagai Aparatur Sipil Negara (ASN).

Dibangun dengan pendekatan desain **editorial, tegas, dan tepercaya** setara website universitas atau lembaga institusi modern, tanpa ketergantungan framework berat.

---

## 🏛️ Karakteristik Desain & Teknologi

- **Tech Stack**: HTML5 Semantik, CSS3 Murni (CSS Variables, Flexbox, CSS Grid), JavaScript Modern (ES6+).
- **Palet Warna Terbatas (Maksimal 3 Warna Utama)**:
  - **Biru Tua Pekat** (`#0B1F3A` / `#061224`): Warna utama institusi, melambangkan ketegasan, wibawa, dan stabilitas birokrasi negara.
  - **Emas Hangat** (`#C9A227`): Aksen hairline, nomor tahapan (`01`, `02`), penanda tombol, dan garis pemisah.
  - **Putih Tulang & Abu Hangat** (`#FAF8F3`, `#F4EFE6`, `#FFFFFF`): Latar belakang berkontras tinggi dan ramah di mata.
- **Tipografi Google Fonts**:
  - Heading: *Playfair Display* (Serif berkarakter institusional dan berani).
  - Body Text: *Plus Jakarta Sans* (Sans-serif modern, bersih, dan sangat mudah dibaca pada berbagai ukuran layar).
- **Ikonografi & Visual**: Ikon SVG inline yang presisi dan konsisten (stroke 2px), bukan emoji kasual.
- **Aksesibilitas & Kecepatan**: Memenuhi pedoman WCAG AA (kontras warna tinggi, navigasi keyboard lengkap, `aria-*` attributes, dan mendukung `prefers-reduced-motion`).

---

## 📁 Struktur Direktori

```text
website bk/
├── index.html            # Halaman Beranda (Hero asimetris, pilar kedinasan, keunggulan vs pertimbangan)
├── daftar-sekolah.html   # Direktori 15 Sekolah (Filter bidang, pencarian langsung, modal dialog detail)
├── persyaratan.html      # Persyaratan Umum & Khusus (Standar fisik, berkas digital, accordion instansi, tabel)
├── jalur-karier.html     # Prospek Karier & Penempatan (Timeline vertikal, pola ikatan dinas, kepangkatan ASN)
├── pendaftaran.html      # Alur Pendaftaran Terpadu (Stepper 7 langkah, materi SKD CAT BKN, direktori portal resmi)
├── tentang.html          # Identitas Kelompok & Proyek ([NAMA KELOMPOK], disclaimer hukum, formulir masukan)
├── css/
│   └── main.css          # Desain sistem, CSS variables, tipografi, komponen, responsive media queries
├── js/
│   ├── main.js           # Navigasi mobile, header sticky, scroll reveal, accordion, back-to-top
│   └── sekolah.js        # Fetch data/sekolah.json, search debounce, category filter, accessible modal
├── data/
│   └── sekolah.json      # Database 15 perguruan tinggi kedinasan terverifikasi
└── README.md             # Panduan pengoperasian lokal dan dokumentasi struktur data
```

---

## 🚀 Cara Menjalankan Secara Lokal

Karena website memuat data institusi secara dinamis dari file `data/sekolah.json` menggunakan API `fetch()`, halaman web sebaiknya dibuka melalui web server lokal agar terhindar dari pembatasan keamanan browser (CORS policy pada protokol `file://`).

Pilihlah salah satu cara termudah berikut:

### Opsi 1: Menggunakan Python (Tersedia Bawaan di Kebanyakan Sistem)
Buka terminal / PowerShell di folder proyek ini, lalu jalankan:

```bash
# Untuk Python 3
python -m http.server 8000
```

Buka peramban (browser) Anda dan akses:
👉 `http://localhost:8000`

---

### Opsi 2: Menggunakan Node.js (npx serve / http-server)
Jika Anda memiliki Node.js terpasang di komputer:

```bash
# Menjalankan server instan tanpa instalasi global
npx serve .
# atau
npx http-server -p 8000
```

Lalu buka alamat URL yang ditampilkan di terminal (misalnya `http://localhost:3000` atau `http://localhost:8000`).

---

### Opsi 3: Menggunakan Ekstensi VS Code "Live Server"
1. Buka folder proyek di **Visual Studio Code**.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey).
3. Klik kanan pada file `index.html` dan pilih **"Open with Live Server"**.

---

## ✏️ Cara Mengedit & Menambah Data di `data/sekolah.json`

Data seluruh sekolah kedinasan tersimpan rapi dalam format JSON pada berkas `data/sekolah.json`. Anda dapat menambah institusi baru atau memperbarui informasi yang sudah ada tanpa perlu mengubah kode HTML!

### Skema Struktur Objek Sekolah

Setiap entri sekolah di dalam array `data/sekolah.json` memiliki format data berikut:

```json
{
  "id": "singkatan-unik",
  "nama": "Nama Resmi Lengkap Perguruan Tinggi",
  "singkatan": "Singkatan / Akronim Populer",
  "kementerian": "Kementerian atau Lembaga Pemerintah Induk",
  "bidang": "kategori_bidang",
  "bidang_label": "Label Kategori yang Ditampilkan",
  "lokasi": "Kota/Kabupaten, Provinsi",
  "website": "https://domain-resmi.ac.id",
  "portal_pendaftaran": "https://portal-penerimaan.ac.id",
  "deskripsi_singkat": "Ringkasan profil 1-2 kalimat untuk kartu depan.",
  "deskripsi_lengkap": "Penjelasan mendalam mengenai sejarah, misi, dan karakteristik kampus untuk modal pop-up.",
  "prodi": [
    { "jenjang": "D-III", "nama": "Nama Program Studi 1" },
    { "jenjang": "D-IV", "nama": "Nama Program Studi 2" }
  ],
  "penempatan_instansi": [
    "Unit Kerja / Direktorat Jenderal Penempatan 1",
    "Instansi Penempatan 2"
  ],
  "contoh_jabatan": [
    "Nama Jabatan Karier Awal 1",
    "Nama Jabatan Karier Awal 2"
  ],
  "ikatan_dinas": true,
  "biaya_pendidikan": "Gratis (ditanggung negara)",
  "keterangan_ikatan_dinas": "Penjelasan status ikatan dinas dan masa pengabdian.",
  "persyaratan_khusus": "Syarat kesehatan, tinggi badan, atau nilai khusus.",
  "catatan": "Peringatan bahwa kuota dan jadwal pendaftaran dapat berubah tiap tahun.",
  "tags": ["kata-kunci1", "kata-kunci2", "bidang-studi"]
}
```

### Kategori Bidang yang Didukung pada Filter:
- `keuangan`: Keuangan Negara (contoh: PKN STAN)
- `pemerintahan`: Kepamongprajaan (contoh: IPDN)
- `statistik`: Sains Data & Statistika (contoh: Polstat STIS)
- `meteorologi`: Cuaca, Iklim, Geofisika (contoh: STMKG)
- `hukum`: Imigrasi & Pemasyarakatan (contoh: Poltekim & Poltekip)
- `siber`: Siber & Sandi Negara (contoh: Poltek SSN)
- `transportasi`: Perhubungan Darat, Laut, dan Udara (contoh: PTDI-STTD, STIP, PIP, Poltekbang, Poltrada)

---

## 👥 Pengisian Identitas Kelompok Pembelajaran

Pada berkas `tentang.html`, terdapat placeholder yang dapat diubah sesuai data kelompok tugas sekolah:

- `[NAMA KELOMPOK]` → Ganti dengan nama kelompok Anda.
- `[NAMA ANGGOTA 1]` → Ganti dengan nama siswa 1 beserta perannya.
- `[NAMA ANGGOTA 2]` → Ganti dengan nama siswa 2 beserta perannya.
- `[NAMA ANGGOTA 3]` → Ganti dengan nama siswa 3 beserta perannya.
- `[KELAS/SEKOLAH]` → Ganti dengan kelas dan nama sekolah (contoh: *Kelas XII MIPA 2, SMAN 1 Jakarta*).
- `[MATA PELAJARAN]` → Ganti dengan mata pelajaran (contoh: *Bimbingan Konseling (BK) / Informatika*).

---

## ⚖️ Penyangkalan Hukum (Disclaimer)

Website ini merupakan **media literasi edukasi independen non-komersial** yang dikembangkan untuk tujuan pembelajaran siswa. Website ini **BUKAN** situs resmi pemerintah Republik Indonesia, Badan Kepegawaian Negara (BKN), maupun perguruan tinggi kedinasan yang disebutkan di dalamnya. Pendaftaran resmi seleksi kedinasan hanya dilakukan melalui portal resmi SSCASN BKN di [https://dikdin.bkn.go.id](https://dikdin.bkn.go.id).
