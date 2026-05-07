import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/useAuth";

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await signUp(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start with a local account and build your circle deliberately."
      footer={
        <>
          Already have an account? <Link to="/signin">Sign in</Link>.
        </>
      }
    >
      <form className="stack-lg" onSubmit={handleSubmit}>
        <Input
          label="Username"
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
