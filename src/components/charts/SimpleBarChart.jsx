import { formatRupiah } from "../../utils/formatters";

export function SimpleBarChart({ items }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="panel chart-panel">
      <div className="chart-list">
        {items.map((item) => (
          <div className="chart-row" key={item.label}>
            <div className="chart-row__meta">
              <span>{item.label}</span>
              <strong>{formatRupiah(item.value)}</strong>
            </div>
            <div className="chart-row__bar">
              <span
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  background: item.color || "var(--color-primary)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
