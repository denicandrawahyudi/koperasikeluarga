import { formatRupiah } from "../../utils/formatters";

export function StatCard({ title, value, hint, tone = "default" }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__title">{title}</p>
      <strong className="stat-card__value">{formatRupiah(value)}</strong>
      {hint ? <span className="stat-card__hint">{hint}</span> : null}
    </article>
  );
}
