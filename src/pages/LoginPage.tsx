import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
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
      await login(email, password);
      navigate("/articles");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate("/articles");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <h1>Log in</h1>
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="comment-input"
        />
        {error && <p className="comment-error">{error}</p>}
        <button type="submit" disabled={submitting} className="comment-submit">
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <button onClick={handleGoogle} className="google-button">
        {" "}
        Continue with Google
      </button>
      <p>
        No account? <Link to="/signup">Sign up </Link>
      </p>
    </div>
  );
}
