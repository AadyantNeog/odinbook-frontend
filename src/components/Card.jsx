export function Card({ children, className = "", accentTop = false }) {
  return (
    <section className={`card ${accentTop ? "card-accent" : ""} ${className}`.trim()}>
      {children}
    </section>
  );
}
