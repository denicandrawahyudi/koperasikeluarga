# Desain Sistem Lengkap

## Prinsip desain untuk orang tua

- Teks besar dan mudah dibaca.
- Tombol besar, jarak antar elemen lega.
- Warna lembut dengan kontras cukup.
- Istilah dibuat sesederhana mungkin.
- Satu halaman fokus pada satu tugas utama.
- Konfirmasi penting seperti hapus data harus jelas.

## Fitur yang disiapkan pada fondasi ini

- Login sederhana.
- Dashboard ringkas.
- Daftar transaksi.
- Form tambah transaksi.
- Hutang, piutang, anggaran, laporan, kategori, pengaturan, dan bantuan.
- Service layer siap dihubungkan ke Google Apps Script.

## Rekomendasi fitur lanjutan

- Transaksi favorit untuk catatan rutin.
- Template transaksi bulanan.
- Pengingat otomatis melalui WhatsApp atau email dari Apps Script.
- Export PDF dan Excel.
- Import CSV.
- Riwayat cicilan hutang/piutang di sheet terpisah.
- Halaman cetak dengan gaya khusus `print.css`.

## Desain endpoint yang efisien

- `dashboard/summary`
- `transactions`
- `debts`
- `receivables`
- `categories`
- `budgets`
- `reports`
- `settings`

## Strategi performa

- Cache memori ringan di frontend selama 60 detik.
- Gunakan endpoint ringkasan terpisah.
- Hindari membaca semua sheet untuk setiap request bila data sudah besar.
- Simpan index kolom tetap di Apps Script agar proses mapping lebih cepat.
- Gunakan soft delete, bukan hapus baris langsung.
