import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductAdminPage() {
  const products = useLoaderData() as Product[];
  const { isAdmin, loading } = useAuth();
  const revalidator = useRevalidator();
  const [form, setForm] = useState({ id: "", name: "", category: "Coffee", description: "", price: "", image: "", badge: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="article-page">Loading...</p>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/shop">← Back to shop</Link></main>;

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/products", { ...form, price: Number(form.price), badge: form.badge || undefined });
      setForm({ id: "", name: "", category: "Coffee", description: "", price: "", image: "", badge: "" });
      revalidator.revalidate();
    } catch (requestError) {
      setError((requestError as { response?: { data?: { error?: string } } }).response?.data?.error || "Could not create product.");
    } finally {
      setSubmitting(false);
    }
  };
  const archive = async (id: string) => {
    if (!confirm("Archive this product from the shop?")) return;
    await api.delete(`/products/${id}`);
    revalidator.revalidate();
  };

  return (
    <main className="article-page product-admin-page">
      <p className="eyebrow">Store management</p>
      <h1>Products</h1>
      <p>Add products to the shop using an image URL. Uploaded products appear immediately in the storefront.</p>
      <section className="admin-create">
        <h2>Add a product</h2>
        <form onSubmit={handleSubmit} className="product-admin-form">
          <div className="form-row"><label>Product ID<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.id} onChange={(e) => update("id", e.target.value)} placeholder="ethiopian-honey" /></label><label>Name<input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Wildflower honey" /></label></div>
          <div className="form-row"><label>Category<select value={form.category} onChange={(e) => update("category", e.target.value)}><option>Coffee</option><option>Tea</option><option>Pantry</option><option>Home & gifts</option></select></label><label>Price<input required min="0" step="0.01" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="18.00" /></label></div>
          <label>Description<textarea required value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="A short description for the product card." /></label>
          <label>Image URL<input required type="url" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." /></label>
          <label>Badge <span className="field-hint">(optional)</span><input value={form.badge} onChange={(e) => update("badge", e.target.value)} placeholder="Bestseller" /></label>
          {error && <p className="comment-error">{error}</p>}
          <button className="comment-submit" disabled={submitting}>{submitting ? "Adding..." : "Add product"}</button>
        </form>
      </section>
      <section className="admin-list"><h2>Published products</h2><ul className="comment-list">{products.map((product) => <li className="comment-item admin-article-row" key={product.id}><span><strong>{product.name}</strong><br /><span className="comment-author">{product.category} · ${product.price.toFixed(2)}</span></span><button className="comment-link-btn danger" onClick={() => archive(product.id)}>Archive</button></li>)}</ul></section>
    </main>
  );
}
