export function LoadingScreen({ label }) {
  return (
    <div className="page page-centered">
      <div className="loading-stack">
        <p className="eyebrow">OdinBook</p>
        <h1>{label}</h1>
      </div>
    </div>
  );
}
