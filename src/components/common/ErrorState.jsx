export function ErrorState({ message }) {
  return (
    <div className="error-state" role="alert">
      <h3>Data belum bisa ditampilkan</h3>
      <p>{message}</p>
    </div>
  );
}
