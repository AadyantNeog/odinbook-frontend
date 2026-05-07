import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/useAuth";

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await signIn({ identifier, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Return to your feed, requests, and profiles."
      footer={
        <>
          New here? <Link to="/signup">Create an account</Link>.
        </>
      }
    >
      <form className="stack-lg" onSubmit={handleSubmit}>
        <Input
          label="Username or email"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
