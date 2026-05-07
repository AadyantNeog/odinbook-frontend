export function Input({ className = "", label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className={`input ${className}`.trim()} {...props} />
    </label>
  );
}
