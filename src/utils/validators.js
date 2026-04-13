export function validateTransaksi(form) {
  const errors = {};

  if (!form.tanggal) errors.tanggal = "Tanggal wajib diisi.";
  if (!form.jenis_transaksi) errors.jenis_transaksi = "Jenis transaksi wajib dipilih.";
  if (!form.kategori) errors.kategori = "Kategori wajib dipilih.";
  if (!form.nominal || Number(form.nominal) <= 0) {
    errors.nominal = "Nominal harus lebih besar dari 0.";
  }

  return errors;
}

export function validatePin(pin) {
  if (!pin) return "PIN wajib diisi.";
  if (String(pin).length < 4) return "PIN minimal 4 angka.";
  return "";
}
