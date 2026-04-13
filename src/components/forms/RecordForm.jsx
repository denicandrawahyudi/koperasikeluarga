import { useState } from "react";
import { STATUS_OPTIONS } from "../../constants/appConfig";
import { InputField } from "./InputField";

const initialState = {
  tanggal: new Date().toISOString().slice(0, 10),
  nama: "",
  nominal: "",
  tanggal_jatuh_tempo: "",
  status: "",
  keterangan: "",
};

function validateRecord(form, type) {
  const errors = {};
  if (!form.tanggal) errors.tanggal = "Tanggal wajib diisi.";
  if (!form.nama) errors.nama = type === "hutang" ? "Nama pemberi hutang wajib diisi." : "Nama peminjam wajib diisi.";
  if (!form.nominal || Number(form.nominal) <= 0) errors.nominal = "Nominal harus lebih besar dari 0.";
  if (!form.tanggal_jatuh_tempo) errors.tanggal_jatuh_tempo = "Tanggal jatuh tempo wajib diisi.";
  if (!form.status) errors.status = "Status wajib dipilih.";
  return errors;
}

export function RecordForm({ type, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    ...initialState,
    status: STATUS_OPTIONS[type][0],
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRecord(form, type);
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const payload =
      type === "hutang"
        ? {
            tanggal: form.tanggal,
            nama_pemberi_hutang: form.nama,
            nominal: Number(form.nominal),
            tanggal_jatuh_tempo: form.tanggal_jatuh_tempo,
            status: form.status,
            keterangan: form.keterangan,
            sisa_hutang: Number(form.nominal),
          }
        : {
            tanggal: form.tanggal,
            nama_peminjam: form.nama,
            nominal: Number(form.nominal),
            tanggal_jatuh_tempo: form.tanggal_jatuh_tempo,
            status: form.status,
            keterangan: form.keterangan,
            sisa_piutang: Number(form.nominal),
          };
    const result = await onSubmit(payload);
    setSaving(false);
    setMessage(result.message || "Data berhasil disimpan.");
    if (result.success) {
      setForm({
        ...initialState,
        status: STATUS_OPTIONS[type][0],
      });
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="form-grid">
        <InputField label="Tanggal" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} error={errors.tanggal} />
        <InputField
          label={type === "hutang" ? "Nama pemberi hutang" : "Nama peminjam"}
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder={type === "hutang" ? "Contoh: Pak Anton" : "Contoh: Mbak Sari"}
          error={errors.nama}
        />
        <InputField label="Nominal" name="nominal" type="number" value={form.nominal} onChange={handleChange} placeholder="Masukkan nominal" error={errors.nominal} />
        <InputField label="Tanggal jatuh tempo" name="tanggal_jatuh_tempo" type="date" value={form.tanggal_jatuh_tempo} onChange={handleChange} error={errors.tanggal_jatuh_tempo} />
        <InputField
          label="Status"
          name="status"
          as="select"
          value={form.status}
          onChange={handleChange}
          options={STATUS_OPTIONS[type]}
          error={errors.status}
        />
      </div>
      <InputField label="Keterangan" name="keterangan" as="textarea" value={form.keterangan} onChange={handleChange} placeholder="Tulis catatan singkat bila perlu" />
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
