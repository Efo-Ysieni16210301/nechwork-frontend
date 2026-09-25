import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(email, password);
      navigate("/verify-account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate("/verify-account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-up failed.");
    }
  };

  return (
    <div className="auth-page">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="comment-input"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="comment-input"
        />
        {error && <p className="comment-error">{error}</p>}
        <button type="submit" disabled={submitting} className="comment-submit">
          {submitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
      <button onClick={handleGoogle} className="google-button">
        Continue with Google
      </button>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
