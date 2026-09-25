import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

interface Profile {
  phoneNumber: string;
  phoneVerified: boolean;
}

export default function VerifyAccountPage() {
  const { user, isFullyVerified, refreshUser, savePhoneNumber, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void api.get<Profile | null>("/profile").then((response) => {
      setProfile(response.data);
      setPhone(response.data?.phoneNumber || "");
    }).catch(() => setError("Could not load your phone verification status."));
  }, [user]);

  useEffect(() => {
    if (isFullyVerified) navigate("/shop", { replace: true });
  }, [isFullyVerified, navigate]);

  if (!user) return <main className="auth-page"><h1>Sign in required</h1><Link to="/login">Log in</Link></main>;

  const resendEmail = async () => {
    setError(null);
    try {
      await sendVerificationEmail();
      setMessage("Verification email sent. Check your inbox, including spam.");
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Could not send verification email.");
    }
  };

  const savePhone = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await savePhoneNumber(phone);
      const response = await api.get<Profile>("/profile");
      setProfile(response.data);
      setMessage("Phone number submitted. An administrator must approve it before you can order.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save phone number.");
    }
  };

  const refreshEmail = async () => {
    setError(null);
    try {
      await auth.currentUser?.reload();
      await refreshUser();
      setMessage("Email verification status refreshed.");
    } catch {
      setError("Could not refresh email verification status.");
    }
  };

  return (
    <main className="auth-page verification-page">
      <p className="eyebrow">Account security</p>
      <h1>Verify your account</h1>
      <p>Choose one verification method. You can verify your email, or submit a phone number for manual administrator approval. You do not need to complete both.</p>
      <section className="verification-card">
        <h2>Email verification</h2>
        <p className={user.emailVerified ? "verification-ok" : ""}>{user.emailVerified ? "✓ Email verified" : `Verify the link sent to ${user.email}.`}</p>
        {!user.emailVerified && <><button className="comment-submit" onClick={resendEmail}>Resend email</button><button className="comment-link-btn" onClick={refreshEmail}>I verified my email</button></>}
      </section>
      <section className="verification-card">
        <h2>Phone number (alternative)</h2>
        <form onSubmit={savePhone}>
          <label>Phone number<input type="tel" placeholder="+251912345678" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
          <button className="comment-submit" type="submit">Submit for manual approval</button>
        </form>
        {profile?.phoneVerified ? <p className="verification-ok">✓ Phone number approved by an administrator</p> : profile?.phoneNumber && <p>Pending administrator approval.</p>}
      </section>
      {message && <p className="verification-ok">{message}</p>}
      {error && <p className="comment-error">{error}</p>}
    </main>
  );
}
