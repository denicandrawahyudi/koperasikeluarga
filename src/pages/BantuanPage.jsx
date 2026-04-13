import { PageHeader } from "../components/common/PageHeader";
import { HELP_STEPS } from "../constants/menuConfig";

export function BantuanPage() {
  return (
    <div className="page-stack">
      <PageHeader title="Bantuan" subtitle="Panduan singkat agar aplikasi mudah dipakai setiap hari." />
      <section className="panel">
        <ol className="help-list">
          {HELP_STEPS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
      <section className="panel">
        <h3>Tips untuk orang tua</h3>
        <p>
          Gunakan tombol besar di dashboard untuk menambah catatan baru. Bila ragu,
          isi bagian wajib terlebih dahulu: tanggal, jenis, kategori, dan nominal.
        </p>
      </section>
    </div>
  );
}
