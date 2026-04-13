import { useState } from "react";
import { InputField } from "./InputField";

const initialForm = {
  periode: new Date().toISOString().slice(0, 7),
  kategori: "",
  batas_anggaran: "",
  terpakai: 0,
  sisa: 0,
};

export function BudgetForm({ categories, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    if (name === "batas_anggaran") {
      const limit = Number(value || 0);
      const used = Number(nextForm.terpakai || 0);
      nextForm.sisa = Math.max(limit - used, 0);
    }
    setForm(nextForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.periode) nextErrors.periode = "Periode wajib diisi.";
    if (!form.kategori) nextErrors.kategori = "Kategori wajib dipilih.";
    if (!form.batas_anggaran || Number(form.batas_anggaran) <= 0) {
      nextErrors.batas_anggaran = "Batas anggaran harus lebih besar dari 0.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const payload = {
      ...form,
      batas_anggaran: Number(form.batas_anggaran),
      terpakai: Number(form.terpakai || 0),
      sisa: Math.max(Number(form.batas_anggaran || 0) - Number(form.terpakai || 0), 0),
    };
    const result = await onSubmit(payload);
    setSaving(false);
    setMessage(result.message || "Anggaran berhasil disimpan.");
    if (result.success && !initialData) {
      setForm(initialForm);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="form-grid">
        <InputField label="Periode" name="periode" type="month" value={form.periode} onChange={handleChange} error={errors.periode} />
        <InputField
          label="Kategori"
          name="kategori"
          as="select"
          value={form.kategori}
          onChange={handleChange}
          options={categories.filter((item) => item.status !== "Nonaktif").map((item) => item.nama_kategori)}
          error={errors.kategori}
        />
        <InputField label="Batas anggaran" name="batas_anggaran" type="number" value={form.batas_anggaran} onChange={handleChange} error={errors.batas_anggaran} />
      </div>
      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? "Sedang menyimpan..." : initialData ? "Simpan perubahan" : "Simpan anggaran"}
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
