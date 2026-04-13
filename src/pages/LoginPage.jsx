import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_INFO } from "../constants/appConfig";
import { useAppContext } from "../services/AppContext";
import { validatePin } from "../utils/validators";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [form, setForm] = useState({ identitas: "", pin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.identitas) {
      setError("Nomor HP atau email wajib diisi.");
      return;
    }

    const pinError = validatePin(form.pin);
    if (pinError) {
      setError(pinError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(form);
      if (result.success) navigate("/");
      else setError(result.message || "Login gagal.");
    } catch (err) {
      setError(err.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__hero">
          <p className="eyebrow">Aplikasi keuangan keluarga</p>
          <h1>{APP_INFO.nama}</h1>
          <p>{APP_INFO.subjudul}</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Nomor HP atau email</span>
            <input
              name="identitas"
              value={form.identitas}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
            />
          </label>
          <label className="form-field">
            <span>PIN sederhana</span>
            <input
              name="pin"
              type="password"
              value={form.pin}
              onChange={handleChange}
              placeholder="Masukkan 4 angka atau lebih"
            />
          </label>
          {error ? <p className="text-error">{error}</p> : null}
          <button type="submit" className="button button-primary button-block">
            {loading ? "Sedang masuk..." : "Masuk"}
          </button>
          <p className="helper-text">Contoh demo: isi nomor apa saja dan PIN minimal 4 angka.</p>
        </form>
      </section>
    </main>
  );
}
