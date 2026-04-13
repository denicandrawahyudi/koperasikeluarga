import { useMemo, useState } from "react";
import { PAYMENT_METHODS } from "../../constants/appConfig";
import { validateTransaksi } from "../../utils/validators";
import { InputField } from "./InputField";

const initialForm = {
  tanggal: new Date().toISOString().slice(0, 10),
  jenis_transaksi: "",
  kategori: "",
  subkategori: "",
  nominal: "",
  metode_pembayaran: "",
  deskripsi: "",
  catatan: "",
};

export function TransactionForm({
  categories,
  defaultType = "",
  initialData = null,
  submitLabel = "Simpan transaksi",
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(
    initialData ? { ...initialForm, ...initialData } : { ...initialForm, jenis_transaksi: defaultType },
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const filteredCategories = useMemo(
    () => categories.filter((item) => !form.jenis_transaksi || item.jenis === form.jenis_transaksi),
    [categories, form.jenis_transaksi],
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTransaksi(form);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const result = await onSubmit(form);
    setSaving(false);
    setMessage(result.message);
    if (result.success && !initialData) setForm({ ...initialForm });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="form-grid">
        <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} error={errors.tanggal} />
        <InputField label="Jenis transaksi" name="jenis_transaksi" as="select" value={form.jenis_transaksi} onChange={handleChange} options={["Pemasukan", "Pengeluaran"]} error={errors.jenis_transaksi} />
        <InputField label="Kategori" name="kategori" as="select" value={form.kategori} onChange={handleChange} options={filteredCategories.map((item) => item.nama_kategori)} error={errors.kategori} />
        <InputField label="Subkategori" name="subkategori" value={form.subkategori} onChange={handleChange} placeholder="Contoh: Belanja pasar" />
        <InputField label="Nominal" name="nominal" type="number" value={form.nominal} onChange={handleChange} placeholder="Masukkan jumlah uang" error={errors.nominal} />
        <InputField label="Metode pembayaran" name="metode_pembayaran" as="select" value={form.metode_pembayaran} onChange={handleChange} options={PAYMENT_METHODS} />
      </div>
      <InputField label="Deskripsi" name="deskripsi" value={form.deskripsi} onChange={handleChange} placeholder="Contoh: Bayar listrik bulan ini" />
      <InputField label="Catatan tambahan" name="catatan" as="textarea" value={form.catatan} onChange={handleChange} placeholder="Tulis catatan jika perlu" />
      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? "Sedang menyimpan..." : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="button" onClick={onCancel}>
            Batal
          </button>
        ) : null}
        {message ? <p className="form-message">{message}</p> : null}
      </div>
    </form>
  );
}
