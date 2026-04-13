export const dummyUser = {
  id_pengguna: "USR-001",
  nama: "Ibu Rini",
  nomor_hp: "081234567890",
  email: "ibu.rini@example.com",
  status: "Aktif",
};

export const dummyDashboard = {
  hariIni: { pemasukan: 250000, pengeluaran: 85000, saldo: 165000 },
  bulanIni: { pemasukan: 5400000, pengeluaran: 3150000, saldo: 2250000 },
  tahunIni: { pemasukan: 64200000, pengeluaran: 40150000, saldo: 24050000 },
  totalHutang: 1750000,
  totalPiutang: 2300000,
  saldoAkhir: 8650000,
};

export const dummyKategori = [
  { id_kategori: "KAT-001", nama_kategori: "Gaji", jenis: "Pemasukan", ikon: "💼", warna: "#5c8a72", status: "Aktif" },
  { id_kategori: "KAT-002", nama_kategori: "Belanja Harian", jenis: "Pengeluaran", ikon: "🛒", warna: "#d17b49", status: "Aktif" },
  { id_kategori: "KAT-003", nama_kategori: "Transportasi", jenis: "Pengeluaran", ikon: "🚌", warna: "#5c7fa3", status: "Aktif" },
  { id_kategori: "KAT-004", nama_kategori: "Tagihan", jenis: "Pengeluaran", ikon: "💡", warna: "#a36a6a", status: "Aktif" },
];

export const dummyTransactions = [
  {
    id_transaksi: "TRX-001",
    tanggal: "2026-04-13",
    jenis_transaksi: "Pemasukan",
    kategori: "Gaji",
    subkategori: "Gaji Bulanan",
    nominal: 4500000,
    metode_pembayaran: "Transfer",
    deskripsi: "Gaji bulan April",
    catatan: "Masuk tepat waktu",
    lampiran_bukti: "",
    dibuat_oleh: "Ibu Rini",
    waktu_input: "2026-04-13T07:30:00",
    tag: "rutin",
  },
  {
    id_transaksi: "TRX-002",
    tanggal: "2026-04-13",
    jenis_transaksi: "Pengeluaran",
    kategori: "Belanja Harian",
    subkategori: "Sayur dan lauk",
    nominal: 125000,
    metode_pembayaran: "Tunai",
    deskripsi: "Belanja pasar",
    catatan: "",
    lampiran_bukti: "",
    dibuat_oleh: "Ibu Rini",
    waktu_input: "2026-04-13T09:10:00",
    tag: "pokok",
  },
  {
    id_transaksi: "TRX-003",
    tanggal: "2026-04-12",
    jenis_transaksi: "Pengeluaran",
    kategori: "Tagihan",
    subkategori: "Listrik",
    nominal: 320000,
    metode_pembayaran: "E-Wallet",
    deskripsi: "Bayar token listrik",
    catatan: "Transaksi berulang",
    lampiran_bukti: "",
    dibuat_oleh: "Ibu Rini",
    waktu_input: "2026-04-12T18:25:00",
    tag: "tagihan",
  },
];

export const dummyHutang = [
  {
    id_hutang: "HTG-001",
    tanggal: "2026-04-01",
    nama_pemberi_hutang: "Pak Anton",
    nominal: 1000000,
    tanggal_jatuh_tempo: "2026-04-20",
    status: "Cicilan",
    keterangan: "Pinjam untuk servis motor",
    sisa_hutang: 450000,
  },
];

export const dummyPiutang = [
  {
    id_piutang: "PTG-001",
    tanggal: "2026-04-05",
    nama_peminjam: "Mbak Sari",
    nominal: 750000,
    tanggal_jatuh_tempo: "2026-04-18",
    status: "Belum Dibayar",
    keterangan: "Pinjaman kebutuhan sekolah",
    sisa_piutang: 750000,
  },
];

export const dummyAnggaran = [
  {
    id_anggaran: "ANG-001",
    periode: "2026-04",
    kategori: "Belanja Harian",
    batas_anggaran: 2000000,
    terpakai: 1350000,
    sisa: 650000,
  },
  {
    id_anggaran: "ANG-002",
    periode: "2026-04",
    kategori: "Transportasi",
    batas_anggaran: 500000,
    terpakai: 280000,
    sisa: 220000,
  },
];

export const dummyPengaturan = {
  nama_aplikasi: "Catatan Keuangan Keluarga",
  logo: "",
  warna_tema: "#f5efe4",
  format_tanggal: "dd MMMM yyyy",
  mata_uang: "Rupiah",
  pengingat_jatuh_tempo: "3 hari sebelumnya",
  mode_sederhana: true,
};
