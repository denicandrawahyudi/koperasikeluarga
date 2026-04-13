# Catatan Keuangan Keluarga

Aplikasi web React yang ringan untuk pencatatan keuangan pribadi atau keluarga. Seluruh antarmuka memakai bahasa Indonesia, dirancang sederhana, mudah dipakai oleh orang tua, dan siap untuk pola deploy frontend statis di GitHub Pages dengan backend ringan Google Apps Script.

## Ringkasan konsep sistem

Sistem memisahkan frontend dan penyimpanan data:

- Frontend: React + Vite + React Router dengan `HashRouter`.
- Backend ringan: Google Apps Script Web App.
- Database utama: Google Spreadsheet.
- Seluruh kredensial sensitif tetap di sisi Google Apps Script, bukan di frontend.

## Daftar fitur lengkap

- Login sederhana.
- Dashboard ringkas.
- Modul transaksi dengan tambah, ubah, hapus, dan pencarian.
- Modul hutang dan piutang.
- Modul anggaran.
- Laporan dan rekap dengan filter harian, bulanan, tahunan, kustom, serta export Excel dan PDF.
- Kategori.
- Pengaturan.
- Bantuan.
- Mode sederhana untuk orang tua.
- Loading, error, dan empty state berbahasa Indonesia.

## Struktur menu

- Login
- Dashboard
- Transaksi
- Tambah Transaksi
- Hutang
- Piutang
- Anggaran
- Laporan
- Rekap
- Kategori
- Pengaturan
- Bantuan

## Struktur Google Spreadsheet

### Sheet `Pengguna`

`id_pengguna`, `nama`, `nomor_hp`, `email`, `pin`, `tanggal_daftar`, `status`, `role`

### Sheet `Transaksi`

`id_transaksi`, `tanggal`, `jenis_transaksi`, `kategori`, `subkategori`, `nominal`, `metode_pembayaran`, `deskripsi`, `catatan`, `lampiran_bukti`, `tag`, `dibuat_oleh`, `waktu_input`, `status_data`

### Sheet `Hutang`

`id_hutang`, `tanggal`, `nama_pemberi_hutang`, `nominal`, `tanggal_jatuh_tempo`, `status`, `keterangan`, `sisa_hutang`, `dibuat_oleh`

### Sheet `Piutang`

`id_piutang`, `tanggal`, `nama_peminjam`, `nominal`, `tanggal_jatuh_tempo`, `status`, `keterangan`, `sisa_piutang`, `dibuat_oleh`

### Sheet `Kategori`

`id_kategori`, `nama_kategori`, `jenis`, `ikon`, `warna`, `status`

### Sheet `Anggaran`

`id_anggaran`, `periode`, `kategori`, `batas_anggaran`, `terpakai`, `sisa`, `dibuat_oleh`

### Sheet `Pengaturan`

`nama_aplikasi`, `logo`, `warna_tema`, `format_tanggal`, `mata_uang`, `pengingat_jatuh_tempo`, `mode_sederhana_default`

## User flow

1. Pengguna login dengan nomor HP/email dan PIN.
2. Dashboard menampilkan kondisi keuangan ringkas.
3. Pengguna menambah pemasukan atau pengeluaran.
4. Frontend mengirim data ke Google Apps Script.
5. Google Apps Script menulis data ke Google Spreadsheet.
6. Pengguna melihat laporan, hutang, piutang, dan anggaran.

## Wireframe/deskripsi UI tiap halaman

- `Login`: kartu besar, 2 input utama, tombol masuk besar.
- `Dashboard`: kartu ringkasan, tombol cepat, grafik sederhana, transaksi terbaru, pengingat jatuh tempo.
- `Transaksi`: pencarian cepat dan tabel yang nyaman di mobile.
- `Tambah Transaksi`: form singkat dengan fokus pada bidang wajib.
- `Hutang/Piutang`: tabel sederhana dengan status.
- `Anggaran`: daftar batas pengeluaran per kategori.
- `Laporan/Rekap`: grafik ringkas dan tabel total.
- `Kategori`, `Pengaturan`, `Bantuan`: tampilan sederhana dan mudah dibaca.

## Arsitektur sistem

```text
Frontend React SPA
  -> routes
  -> layouts
  -> pages
  -> components
  -> hooks
  -> services
  -> utils
  -> constants

React Frontend
  -> HTTP GET/POST
Google Apps Script Web App
  -> validasi request
  -> baca/tulis Spreadsheet
Google Spreadsheet
```

## Struktur folder React

```text
src/
  assets/
  components/
  constants/
  hooks/
  layouts/
  pages/
  routes/
  services/
  styles/
  utils/
```

## Desain API Google Apps Script

- `GET ?path=dashboard/summary`
- `GET ?path=transactions`
- `POST { path: "transactions/create", ...payload }`
- `POST { path: "transactions/update", ...payload }`
- `POST { path: "transactions/delete", id_transaksi }`
- `GET ?path=debts`
- `GET ?path=receivables`
- `POST { path: "debts/update-status", id_hutang, status }`
- `POST { path: "receivables/update-status", id_piutang, status }`
- `GET ?path=categories`
- `GET ?path=reports`
- `GET ?path=reports&periode=bulanan&bulan=2026-04`
- `GET ?path=reports&periode=harian&tanggal_mulai=2026-04-13&tanggal_selesai=2026-04-13`
- `GET ?path=reports&periode=tahunan&tahun=2026`
- `GET ?path=settings`

## Validasi dan aturan bisnis

- PIN minimal 4 angka.
- Nominal transaksi harus lebih besar dari 0.
- Kategori wajib diisi.
- Jenis transaksi wajib diisi.
- Hapus transaksi disarankan memakai soft delete.
- Sisa hutang/piutang tidak boleh minus.
- Status `Lunas` otomatis bila sisa 0.
- Export Excel menggunakan `xlsx`.
- Export PDF menggunakan `jspdf` dan `jspdf-autotable`.

## Contoh implementasi kode awal

- Frontend utama ada di [src/App.jsx](/D:/PROJECT%20PENCATATAN%20KEUANGAN/src/App.jsx:1)
- Routing ada di [src/routes/AppRoutes.jsx](/D:/PROJECT%20PENCATATAN%20KEUANGAN/src/routes/AppRoutes.jsx:1)
- Service API ada di [src/services/apiClient.js](/D:/PROJECT%20PENCATATAN%20KEUANGAN/src/services/apiClient.js:1)
- Dummy data ada di [src/services/dummyData.js](/D:/PROJECT%20PENCATATAN%20KEUANGAN/src/services/dummyData.js:1)
- Apps Script ada di [google-apps-script/Code.gs](/D:/PROJECT%20PENCATATAN%20KEUANGAN/google-apps-script/Code.gs:1)

## Role user

- `Admin keluarga`
- `Anggota`

## Rekomendasi teknologi

- React + Vite
- React Router
- CSS ringan
- Google Apps Script
- Google Spreadsheet

## Panduan deploy ke GitHub Pages

1. Ganti `base` di `vite.config.js` sesuai nama repository GitHub.
2. Salin `.env.example` menjadi `.env`.
3. Isi `VITE_GAS_WEB_APP_URL` dengan URL Web App Google Apps Script.
4. Jalankan `npm install`.
5. Jalankan `npm run build`.
6. Jalankan `npm run deploy`.
7. Aktifkan GitHub Pages dari branch `gh-pages`.

## Panduan deploy Google Apps Script

1. Buat Spreadsheet baru.
2. Buat sheet sesuai struktur data.
3. Buka `Extensions > Apps Script`.
4. Tempel isi file `google-apps-script/Code.gs`.
5. Isi `SPREADSHEET_ID`.
6. Deploy sebagai `Web app`.
7. Salin URL hasil deploy.
8. Tempel URL itu ke `VITE_GAS_WEB_APP_URL`.

## Menghubungkan frontend React ke URL Web App

- `VITE_USE_DUMMY_DATA=true` untuk demo lokal.
- `VITE_USE_DUMMY_DATA=false` untuk mode API asli.
- URL Web App dibaca dari environment variable, bukan ditulis langsung di komponen.

## Catatan

- File ini memberi fondasi lengkap dan scalable.
- Fitur edit, hapus, export PDF/Excel, upload bukti, transaksi berulang, backup, dan multi-user lebih detail dapat dilanjutkan di tahap berikutnya tanpa perlu ubah arsitektur dasar.
