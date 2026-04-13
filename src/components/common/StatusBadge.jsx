export function StatusBadge({ status }) {
  const tone =
    status === "Lunas" || status === "Aktif"
      ? "success"
      : status === "Cicilan"
        ? "warning"
        : "default";

  return <span className={`badge badge--${tone}`}>{status}</span>;
}
