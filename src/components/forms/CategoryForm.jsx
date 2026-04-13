import { useState } from "react";
import { InputField } from "./InputField";

const initialForm = {
  nama_kategori: "",
  jenis: "",
  ikon: "",
  warna: "#5c8a72",
  status: "Aktif",
};

export function CategoryForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.nama_kategori) nextErrors.nama_kategori = "Nama kategori wajib diisi.";
    if (!form.jenis) nextErrors.jenis = "Jenis wajib dipilih.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const result = await onSubmit(form);
    setSaving(false);
    setMessage(result.message || "Kategori berhasil disimpan.");
    if (result.success && !initialData) {
      setForm(initialForm);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="form-grid">
        <InputField label="Nama kategori" name="nama_kategori" value={form.nama_kategori} onChange={handleChange} error={errors.nama_kategori} placeholder="Contoh: Belanja sekolah" />
        <InputField label="Jenis" name="jenis" as="select" value={form.jenis} onChange={handleChange} options={["Pemasukan", "Pengeluaran"]} error={errors.jenis} />
        <InputField label="Ikon" name="ikon" value={form.ikon} onChange={handleChange} placeholder="Contoh: 💼" />
        <InputField label="Warna" name="warna" type="color" value={form.warna} onChange={handleChange} />
        <InputField label="Status" name="status" as="select" value={form.status} onChange={handleChange} options={["Aktif", "Nonaktif"]} />
      </div>
      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? "Sedang menyimpan..." : initialData ? "Simpan perubahan" : "Simpan kategori"}
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
