import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithTelegramToken, user, isFullyVerified } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const telegramBot = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const telegramAuthUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/telegram`;
  useEffect(() => {
    if (!telegramBot) return;
    const telegramToken = new URLSearchParams(window.location.hash.slice(1)).get("telegram_token");
    if (telegramToken) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      void loginWithTelegramToken(telegramToken).then(() => navigate("/shop")).catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Telegram sign-in failed.");
      });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", telegramBot);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", telegramAuthUrl);
    document.getElementById("telegram-login")?.appendChild(script);
    return () => {
      script.remove();
    };
  }, [loginWithTelegramToken, navigate, telegramAuthUrl, telegramBot]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(user && isFullyVerified ? "/shop" : "/verify-account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate(user && isFullyVerified ? "/shop" : "/verify-account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
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
      {telegramBot && (
        <div className="telegram-login-block">
          <span>or</span>
          <div id="telegram-login" />
        </div>
      )}
      <p>
        No account? <Link to="/signup">Sign up </Link>
      </p>
    </div>
  );
}
