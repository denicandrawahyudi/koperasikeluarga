export const APP_INFO = {
  nama: "Catatan Keuangan Keluarga",
  subjudul: "Catat uang masuk dan keluar dengan mudah",
  mataUang: "Rp",
  formatTanggal: "id-ID",
};

export const NAVIGATION_ITEMS = [
  { path: "/", label: "Dashboard", icon: "beranda" },
  { path: "/transaksi", label: "Transaksi", icon: "catatan" },
  { path: "/hutang", label: "Hutang", icon: "dompet" },
  { path: "/piutang", label: "Piutang", icon: "orang" },
  { path: "/anggaran", label: "Anggaran", icon: "target" },
  { path: "/laporan", label: "Laporan", icon: "grafik" },
  { path: "/kategori", label: "Kategori", icon: "label" },
  { path: "/pengaturan", label: "Pengaturan", icon: "atur" },
  { path: "/bantuan", label: "Bantuan", icon: "tanya" },
];

export const QUICK_ACTIONS = [
  { id: "pemasukan", label: "Tambah Pemasukan", type: "Pemasukan" },
  { id: "pengeluaran", label: "Tambah Pengeluaran", type: "Pengeluaran" },
];

export const STATUS_OPTIONS = {
  hutang: ["Belum Lunas", "Cicilan", "Lunas"],
  piutang: ["Belum Dibayar", "Cicilan", "Lunas"],
};

export const PAYMENT_METHODS = ["Tunai", "Transfer", "E-Wallet", "Lainnya"];
