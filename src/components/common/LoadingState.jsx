export function LoadingState({ label = "Sedang memuat data..." }) {
  return (
    <div className="loading-state" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
