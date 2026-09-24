import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
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
  shipping: { firstName: string; lastName: string; address: string; city: string; postalCode: string };
  createdAt: string;
}

const statuses = ["pending", "under_review", "confirmed", "processing", "shipped", "delivered", "rejected", "cancelled"];

export default function AdminOrdersPage() {
  const orders = useLoaderData() as Order[];
  const { isAdmin, loading } = useAuth();
  const revalidator = useRevalidator();
  const [error, setError] = useState<string | null>(null);

  if (loading) return <p className="article-page">Loading...</p>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/shop">← Back to shop</Link></main>;

  const updateStatus = async (id: string, status: string) => {
    setError(null);
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      revalidator.revalidate();
    } catch {
      setError("Could not update this order.");
    }
  };

  return (
    <main className="article-page admin-orders-page">
      <p className="eyebrow">Store management</p>
      <h1>Orders</h1>
      <p>Review payment proof before confirming an order for packing and delivery.</p>
      {error && <p className="comment-error">{error}</p>}
      {!orders.length && <p>No orders have been submitted yet.</p>}
      <div className="admin-order-list">
        {orders.map((order) => (
          <article className="admin-order-card" key={order._id}>
            <div className="admin-order-header"><div><strong>Order {order._id.slice(-8)}</strong><span>{new Date(order.createdAt).toLocaleString()}</span></div><strong>${order.subtotal.toFixed(2)}</strong></div>
            <p><strong>Customer:</strong> {order.email}</p>
            <p><strong>Items:</strong> {order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</p>
            <p><strong>Delivery:</strong> {order.shipping.firstName} {order.shipping.lastName}, {order.shipping.address}, {order.shipping.city}, {order.shipping.postalCode}</p>
            <div className="admin-payment-row"><span><strong>Payment:</strong> {order.paymentMethod.toUpperCase()} · <code>{order.transactionId}</code></span><a href={order.paymentProofUrl} target="_blank" rel="noreferrer">View payment proof ↗</a></div>
            <label className="order-status">Order status<select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></label>
          </article>
        ))}
      </div>
    </main>
  );
}
