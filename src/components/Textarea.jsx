export function Textarea({ className = "", label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea className={`textarea ${className}`.trim()} {...props} />
    </label>
  );
}
