/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface CustomerOrder {
  _id: string;
  items?: { name?: string; quantity?: number; price?: number }[];
  subtotal?: number;
  paymentMethod?: string;
  transactionId?: string;
  paymentProofUrl?: string;
  status?: string;
  createdAt?: string;
}

export default function CustomerOrdersPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    setLoadingOrders(true);
    const cacheKey = `customer-orders:${user.uid}`;
    void api.get<CustomerOrder[]>("/orders")
      .then((response) => {
        setOrders(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
      })
      .catch((requestError) => {
        const response = (requestError as { response?: { data?: { error?: string } } }).response;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setOrders(JSON.parse(cached) as CustomerOrder[]);
          setError("Offline: showing your last saved orders.");
        } else {
          setError(response?.data?.error || t("couldNotLoadOrders"));
        }
      })
      .finally(() => setLoadingOrders(false));
  }, [loading, t, user]);

  if (loading) return <main className="article-page"><p>{t("loading")}</p></main>;
  if (!user) {
    return <main className="article-page"><h1>{t("signInOrders")}</h1><Link to="/login">{t("login")}</Link></main>;
  }

  return (
    <main className="article-page customer-orders-page">
      <p className="eyebrow">{t("yourAccount")}</p>
      <h1>{t("myOrdersTitle")}</h1>
      <p>{t("trackOrders")}</p>
      {loadingOrders && <p>{t("loadingOrders")}</p>}
      {error && <p className="comment-error">{error}</p>}
      {!loadingOrders && !error && !orders.length && (
        <p>{t("noOrders")} <Link to="/shop">{t("browseShop")}</Link></p>
      )}
      <div className="customer-order-list">
        {orders.map((order) => {
          const status = order.status || "pending";
          return (
            <article className="customer-order-card" key={order._id}>
              <div className="customer-order-heading">
                <div>
                  <strong>Order {order._id?.slice(-8) || "unknown"}</strong>
                  <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : t("dateUnavailable")}</span>
                </div>
                <strong>${Number(order.subtotal || 0).toFixed(2)}</strong>
              </div>
              <p className="order-status-badge">{({
                pending: t("paymentPending"), under_review: t("underReview"), confirmed: t("paymentConfirmed"),
                processing: t("beingPrepared"), shipped: t("shipped"), delivered: t("delivered"),
                rejected: t("rejected"), cancelled: t("cancelled"),
              } as Record<string, string>)[status] || status.replaceAll("_", " ")}</p>
              <p><strong>{t("items")}:</strong> {(order.items || []).map((item) => `${item.quantity || 0} × ${item.name || "Product"}`).join(", ") || t("itemsUnavailable")}</p>
              <p><strong>{t("payment")}:</strong> {order.paymentMethod?.toUpperCase() || t("notProvided")} · {t("transaction")}: {order.transactionId || t("notProvided")}</p>
              {order.paymentProofUrl && <a href={order.paymentProofUrl} target="_blank" rel="noreferrer">{t("viewProof")}</a>}
            </article>
          );
        })}
      </div>
    </main>
  );
}
