import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, linkWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function VerifyAccountPage() {
  const { user, isFullyVerified, refreshUser, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recaptcha = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!user) return;
    recaptcha.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    return () => recaptcha.current?.clear();
  }, [user]);

  if (!user) return <main className="auth-page"><h1>Sign in required</h1><Link to="/login">Log in</Link></main>;
  if (isFullyVerified) {
    navigate("/shop", { replace: true });
    return null;
  }

  const resendEmail = async () => {
    setError(null);
    try { await sendVerificationEmail(); setMessage("Verification email sent. Check your inbox, including spam."); }
    catch (verificationError) { setError(verificationError instanceof Error ? verificationError.message : "Could not send verification email."); }
  };
  const sendCode = async () => {
    setError(null);
    try {
      if (!recaptcha.current) throw new Error("Security check is not ready. Please try again.");
      const result = await linkWithPhoneNumber(auth.currentUser!, phone, recaptcha.current);
      setConfirmation(result);
      setMessage("A verification code was sent to your phone.");
    } catch (verificationError) {
      const errorCode =
        typeof verificationError === "object" &&
        verificationError !== null &&
        "code" in verificationError
          ? String((verificationError as { code?: unknown }).code)
          : "";
      setError(
        errorCode === "auth/billing-not-enabled"
          ? "Phone verification requires billing to be enabled for this Firebase project. The site administrator must upgrade the project to the Blaze plan and link a billing account."
          : errorCode === "auth/operation-not-allowed"
            ? "Phone verification is disabled for this region. The site administrator must enable Ethiopia (+251) in Firebase Authentication SMS region policy."
          : verificationError instanceof Error
            ? verificationError.message
            : "Could not send phone code.",
      );
    }
  };
  const verifyCode = async () => {
    setError(null);
    try {
      await confirmation?.confirm(code);
      await refreshUser();
      setMessage("Your email and phone are verified.");
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Invalid verification code.");
    }
  };

  return <main className="auth-page verification-page"><p className="eyebrow">Account security</p><h1>Verify your account</h1><p>Verify both contact methods before ordering so we can safely process delivery and payment proof.</p><section className="verification-card"><h2>Email verification</h2><p className={user.emailVerified ? "verification-ok" : ""}>{user.emailVerified ? "✓ Email verified" : `We sent a verification link to ${user.email}.`}</p>{!user.emailVerified && <><button className="comment-submit" onClick={resendEmail}>Resend email</button><button className="comment-link-btn" onClick={refreshUser}>I verified my email</button></>}</section><section className="verification-card"><h2>Phone verification</h2>{user.phoneNumber ? <p className="verification-ok">✓ Phone verified</p> : !confirmation ? <><label>Phone number<input type="tel" placeholder="+251 9..." value={phone} onChange={(event) => setPhone(event.target.value)} /></label><button className="comment-submit" onClick={sendCode}>Send SMS code</button></> : <><label>SMS code<input inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value)} /></label><button className="comment-submit" onClick={verifyCode}>Verify phone</button></>}</section><div id="recaptcha-container" />{message && <p className="verification-ok">{message}</p>}{error && <p className="comment-error">{error}</p>}</main>;
}
