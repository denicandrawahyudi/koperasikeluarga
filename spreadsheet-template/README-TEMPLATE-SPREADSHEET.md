# Template Google Spreadsheet

File dalam folder ini bisa langsung Anda impor ke Google Sheets.

## Urutan sheet yang disarankan

1. `01-Pengguna.csv` menjadi sheet `Pengguna`
2. `02-Transaksi.csv` menjadi sheet `Transaksi`
3. `03-Hutang.csv` menjadi sheet `Hutang`
4. `04-Piutang.csv` menjadi sheet `Piutang`
5. `05-Kategori.csv` menjadi sheet `Kategori`
6. `06-Anggaran.csv` menjadi sheet `Anggaran`
7. `07-Pengaturan.csv` menjadi sheet `Pengaturan`
8. `08-Riwayat_Aktivitas.csv` menjadi sheet `Riwayat_Aktivitas`
9. `09-Transaksi_Berulang.csv` menjadi sheet `Transaksi_Berulang`
10. `10-Catatan_Harian.csv` menjadi sheet `Catatan_Harian`

## Cara impor ke Google Sheets

1. Buat Google Spreadsheet baru.
2. Ubah nama sheet pertama menjadi `Pengguna`.
3. Pilih `File > Import > Upload`.
4. Unggah file CSV sesuai urutan di atas.
5. Saat impor, pilih `Replace current sheet` untuk sheet aktif, atau `Insert new sheet(s)` untuk sheet berikutnya.
6. Pastikan nama sheet hasil impor sama persis dengan nama yang dibutuhkan Apps Script.

## Catatan penting

- Jangan ubah nama kolom header.
- Anda boleh menghapus contoh data setelah berhasil diuji.
- Jika ingin login demo, gunakan:
  Nomor HP: `081234567890`
  PIN: `1234`
