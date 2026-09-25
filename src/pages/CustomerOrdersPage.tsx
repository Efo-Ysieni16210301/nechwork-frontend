/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

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

const statusLabels: Record<string, string> = {
  pending: "Payment pending review",
  under_review: "Under review",
  confirmed: "Payment confirmed",
  processing: "Being prepared",
  shipped: "Shipped",
  delivered: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export default function CustomerOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    setLoadingOrders(true);
    void api.get<CustomerOrder[]>("/orders")
      .then((response) => setOrders(response.data))
      .catch((requestError) => {
        const response = (requestError as { response?: { data?: { error?: string } } }).response;
        setError(response?.data?.error || "Could not load your orders.");
      })
      .finally(() => setLoadingOrders(false));
  }, [loading, user]);

  if (loading) return <main className="article-page"><p>Loading...</p></main>;
  if (!user) {
    return <main className="article-page"><h1>Sign in to view your orders</h1><Link to="/login">Log in</Link></main>;
  }

  return (
    <main className="article-page customer-orders-page">
      <p className="eyebrow">Your account</p>
      <h1>My orders</h1>
      <p>Track payment review, preparation, shipping, and delivery updates for your purchases.</p>
      {loadingOrders && <p>Loading your orders...</p>}
      {error && <p className="comment-error">{error}</p>}
      {!loadingOrders && !error && !orders.length && (
        <p>You have no orders yet. <Link to="/shop">Browse the shop</Link></p>
      )}
      <div className="customer-order-list">
        {orders.map((order) => {
          const status = order.status || "pending";
          return (
            <article className="customer-order-card" key={order._id}>
              <div className="customer-order-heading">
                <div>
                  <strong>Order {order._id?.slice(-8) || "unknown"}</strong>
                  <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable"}</span>
                </div>
                <strong>${Number(order.subtotal || 0).toFixed(2)}</strong>
              </div>
              <p className="order-status-badge">{statusLabels[status] || status.replaceAll("_", " ")}</p>
              <p><strong>Items:</strong> {(order.items || []).map((item) => `${item.quantity || 0} × ${item.name || "Product"}`).join(", ") || "Items unavailable"}</p>
              <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase() || "Not provided"} · Transaction: {order.transactionId || "Not provided"}</p>
              {order.paymentProofUrl && <a href={order.paymentProofUrl} target="_blank" rel="noreferrer">View submitted payment proof ↗</a>}
            </article>
          );
        })}
      </div>
    </main>
  );
}
