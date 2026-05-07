import { Link } from "react-router";
import { Card } from "./Card";

export function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="page auth-page">
      <div className="shell-noise" />
      <div className="shell-glow" />
      <div className="auth-grid">
        <section className="auth-copy">
          <p className="eyebrow">Editorial social</p>
          <h1>Write carefully. Follow deliberately.</h1>
          <p>
            OdinBook is a quiet social space for notes, readerly profiles, and the people you
            choose to keep close.
          </p>
          <div className="auth-links">
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Create account</Link>
          </div>
        </section>

        <Card className="auth-card" accentTop>
          <p className="eyebrow">OdinBook</p>
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </Card>
      </div>
    </div>
  );
}
