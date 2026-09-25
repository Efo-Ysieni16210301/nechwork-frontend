import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

type PaymentMethod = "telebirr" | "cbe" | "abyssinia" | "other";

const paymentMethods: { value: PaymentMethod; label: string; details: string }[] = [
  { value: "telebirr", label: "Telebirr", details: "Pay with your Telebirr wallet." },
  { value: "cbe", label: "CBE", details: "Commercial Bank of Ethiopia transfer." },
  { value: "abyssinia", label: "Bank of Abyssinia", details: "Bank of Abyssinia transfer." },
  { value: "other", label: "Other payment", details: "Another agreed payment method." },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isFullyVerified } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("telebirr");
  const [proofUrl, setProofUrl] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadProof = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Payment proof must be a PDF, PNG, JPG, or WebP file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Payment proof must be 10 MB or smaller.");
      return;
    }
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setError("Payment proof upload is not configured.");
      return;
    }
    setError(null);
    setUploadingProof(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      const resourceType = file.type === "application/pdf" ? "raw" : "image";
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: "POST", body });
      const result = await response.json() as { secure_url?: string; error?: { message?: string } };
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Could not upload payment proof.");
      setProofUrl(result.secure_url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Payment proof upload failed.");
    } finally {
      setUploadingProof(false);
      event.target.value = "";
    }
  };

  if (placed) return <main className="checkout-page confirmation"><span className="confirmation-mark">✓</span><p className="eyebrow">Payment submitted</p><h1>Your order is waiting for review.</h1><p>Our team will verify your transaction and contact you before dispatching the order.</p><Link to="/shop" className="btn btn-primary">Continue shopping</Link></main>;
  if (!items.length) return <main className="checkout-page empty-cart"><h1>Your bag is empty.</h1><Link to="/shop" className="btn btn-primary">Browse the shop</Link></main>;

  return (
    <main className="checkout-page">
      <p className="eyebrow">Checkout</p>
      <h1>Almost yours.</h1>
      {user && !isFullyVerified && <p className="comment-error">Please complete <Link to="/verify-account">email verification or phone approval</Link> before ordering.</p>}
      {!user && <p className="comment-error">Please <Link to="/login">log in</Link> before placing an order.</p>}
      <form className="checkout-layout" onSubmit={async (event) => {
        event.preventDefault();
        if (!user || !isFullyVerified || !proofUrl) return;
        setError(null);
        const form = new FormData(event.currentTarget);
        try {
          await api.post("/orders", {
            items: items.map(({ product, quantity }) => ({ productId: product.id, quantity })),
            shipping: {
              firstName: form.get("firstName"),
              lastName: form.get("lastName"),
              address: form.get("address"),
              city: form.get("city"),
              postalCode: form.get("postalCode"),
            },
            paymentMethod,
            transactionId: form.get("transactionId"),
            paymentProofUrl: proofUrl,
          });
          clearCart();
          setPlaced(true);
        } catch (requestError) {
          const response = (requestError as { response?: { data?: { error?: string } } }).response;
          setError(response?.data?.error || (requestError instanceof Error ? requestError.message : "Unable to submit your order."));
        }
      }}>
        <section className="checkout-form">
          <h2>Delivery details</h2>
          <div className="form-row"><label>First name<input name="firstName" required /></label><label>Last name<input name="lastName" required /></label></div>
          <label>Email address<input type="email" value={user?.email ?? ""} readOnly required /></label>
          <label>Address<input name="address" required /></label>
          <div className="form-row"><label>City<input name="city" required /></label><label>Postal code<input name="postalCode" required /></label></div>
          <h2>Payment verification</h2>
          <p>Pay using one of the methods below, then submit the transaction ID and payment receipt. Your order will be reviewed before delivery.</p>
          <div className="payment-methods">{paymentMethods.map((method) => <label className={`payment-option ${paymentMethod === method.value ? "selected" : ""}`} key={method.value}><input type="radio" name="paymentMethod" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} /><span><strong>{method.label}</strong><small>{method.details}</small></span></label>)}</div>
          <label>Transaction ID<input name="transactionId" required placeholder="Enter the payment transaction/reference ID" /></label>
          <label>Payment proof <input type="file" accept=".pdf,image/png,image/jpeg,image/webp" onChange={uploadProof} disabled={uploadingProof} required={!proofUrl} /><small>{uploadingProof ? "Uploading proof..." : proofUrl ? "Payment proof uploaded." : "PDF, PNG, JPG, or WebP up to 10 MB."}</small></label>
          {error && <p className="comment-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={!user || !isFullyVerified || !proofUrl || uploadingProof}>Submit order for review · ${subtotal.toFixed(2)}</button>
        </section>
        <aside className="order-summary checkout-summary"><h2>In your bag</h2>{items.map(({ product, quantity }) => <div className="checkout-product" key={product.id}><span>{quantity} × {product.name}</span><strong>${(product.price * quantity).toFixed(2)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div></aside>
      </form>
    </main>
  );
}
