/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useRouteError } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface Order {
  _id: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  paymentMethod: string;
  transactionId: string;
  paymentProofUrl: string;
  status: string;
  shipping: { firstName: string; lastName: string; phoneNumber?: string; address: string; city: string; postalCode: string };
  createdAt: string;
}

const statuses = ["pending", "under_review", "confirmed", "processing", "shipped", "delivered", "rejected", "cancelled"];

export function AdminOrdersRouteError() {
  const error = useRouteError();
  const detail = error instanceof Error ? error.message : "The orders page could not be loaded.";
  return (
    <main className="article-page">
      <p className="eyebrow">Store management</p>
      <h1>Orders could not be loaded</h1>
      <p>{detail}</p>
      <Link to="/admin/orders" className="article-back-link">Try again</Link>
    </main>
  );
}

export default function AdminOrdersPage() {
  const { isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setError(null);
    setOrdersLoading(true);
    try {
      const response = await api.get<Order[]>("/admin/orders");
      setOrders(response.data);
    } catch (requestError) {
      const response = (
        requestError as { response?: { data?: { error?: string }; status?: number } }
      ).response;
      setError(
        response?.data?.error ||
          (response?.status === 401
            ? "Your admin session has expired. Please log in again."
            : response?.status === 403
              ? "This account is not authorized to view orders."
              : "Could not load orders. Check that the Render API is running."),
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAdmin) {
      void loadOrders();
    }
  }, [isAdmin, loading]);

  if (loading) return <p className="article-page">Loading...</p>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/shop">← Back to shop</Link></main>;

  const updateStatus = async (id: string, status: string) => {
    setError(null);
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      await loadOrders();
    } catch (requestError) {
      const response = (
        requestError as { response?: { data?: { error?: string } } }
      ).response;
      setError(response?.data?.error || "Could not update this order.");
    }
  };

  return (
    <main className="article-page admin-orders-page">
      <p className="eyebrow">Store management</p>
      <h1>Orders</h1>
      <p>Review payment proof before confirming an order for packing and delivery.</p>
      {error && <p className="comment-error">{error}</p>}
      {ordersLoading && <p>Loading orders...</p>}
      {!ordersLoading && !error && !orders.length && <p>No orders have been submitted yet.</p>}
      <div className="admin-order-list">
        {orders.map((order) => (
          <article className="admin-order-card" key={order._id}>
            <div className="admin-order-header"><div><strong>Order {order._id?.slice(-8) || "unknown"}</strong><span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable"}</span></div><strong>${Number(order.subtotal || 0).toFixed(2)}</strong></div>
            <p><strong>Customer:</strong> {order.email || "Email unavailable"}</p>
            <p><strong>Items:</strong> {(order.items || []).map((item) => `${item.quantity} × ${item.name}`).join(", ") || "Items unavailable"}</p>
            <p><strong>Delivery:</strong> {order.shipping ? `${order.shipping.firstName} ${order.shipping.lastName}, ${order.shipping.phoneNumber || "Phone unavailable"}, ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.postalCode}` : "Delivery details unavailable"}</p>
            <div className="admin-payment-row"><span><strong>Payment:</strong> {order.paymentMethod?.toUpperCase() || "NOT PROVIDED"} · <code>{order.transactionId || "No transaction ID"}</code></span>{order.paymentProofUrl ? <a href={order.paymentProofUrl} target="_blank" rel="noreferrer">View payment proof ↗</a> : <span>No payment proof</span>}</div>
            <label className="order-status">Order status<select value={order.status || "pending"} onChange={(event) => updateStatus(order._id, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></label>
          </article>
        ))}
      </div>
    </main>
  );
}
