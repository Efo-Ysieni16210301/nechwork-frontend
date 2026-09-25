import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    nechWorkTelegramLogin?: (data: Record<string, unknown>) => void;
  }
}

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithTelegram, user, isFullyVerified } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const telegramBot = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  useEffect(() => {
    if (!telegramBot) return;
    window.nechWorkTelegramLogin = (data: Record<string, unknown>) => {
      void loginWithTelegram(data).then(() => navigate("/shop")).catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Telegram sign-in failed.");
      });
    };
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", telegramBot);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "nechWorkTelegramLogin(user)");
    document.getElementById("telegram-login")?.appendChild(script);
    return () => {
      delete window.nechWorkTelegramLogin;
      script.remove();
    };
  }, [loginWithTelegram, navigate, telegramBot]);
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
