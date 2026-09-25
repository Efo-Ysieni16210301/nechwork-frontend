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
  description: string;
  badge?: string;
}

export default function ProductAdminPage() {
  const products = useLoaderData() as Product[];
  const { isAdmin, loading } = useAuth();
  const revalidator = useRevalidator();
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "Coffee",
    description: "",
    price: "",
    image: "",
    badge: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "upload">("upload");
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loading) return <p className="article-page">Loading...</p>;
  if (!isAdmin)
    return (
      <main className="article-page">
        <p>You don't have access to this page.</p>
        <Link to="/shop">← Back to shop</Link>
      </main>
    );

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setError(
        "Cloudinary upload is not configured. Add the Cloudinary values to front-end/.env.local.",
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Images must be 10 MB or smaller.");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body,
        },
      );
      const result = (await response.json()) as {
        secure_url?: string;
        error?: { message?: string };
      };
      if (!response.ok)
        throw new Error(
          result.error?.message || "Cloudinary could not upload this image.",
        );
      if (!result.secure_url)
        throw new Error("Cloudinary returned no image URL.");
      update("image", result.secure_url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        badge: form.badge || undefined,
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setForm({
        id: "",
        name: "",
        category: "Coffee",
        description: "",
        price: "",
        image: "",
        badge: "",
      });
      setEditingId(null);
      revalidator.revalidate();
    } catch (requestError) {
      const message = (requestError as { response?: { data?: { error?: string } } }).response?.data?.error;
      setError(message || (editingId ? "Could not update product." : "Could not create product."));
    } finally {
      setSubmitting(false);
    }
  };
  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      image: product.image,
      badge: product.badge || "",
    });
    setImageMode("url");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancelEditing = () => {
    setEditingId(null);
    setForm({ id: "", name: "", category: "Coffee", description: "", price: "", image: "", badge: "" });
    setError(null);
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
      <p>
        Add products to the shop or edit existing products. Changes appear in
        the storefront after saving.
      </p>
      <section className="admin-create">
        <h2>{editingId ? "Edit product" : "Add a product"}</h2>
        <form onSubmit={handleSubmit} className="product-admin-form">
          <div className="form-row">
            <label>
              Product ID
              <input
                required={!editingId}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
                placeholder="ethiopian-honey"
                disabled={Boolean(editingId)}
              />
            </label>
            <label>
              Name
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Wildflower honey"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option>Coffee</option>
                <option>Tea</option>
                <option>Pantry</option>
                <option>Home & gifts</option>
              </select>
            </label>
            <label>
              Price
              <input
                required
                min="0"
                step="0.01"
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="18.00"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short description for the product card."
            />
          </label>
          <div className="image-input-section">
            <div className="image-input-tabs">
              <button
                type="button"
                className={imageMode === "upload" ? "active" : ""}
                onClick={() => setImageMode("upload")}
              >
                Upload an image
              </button>
              <button
                type="button"
                className={imageMode === "url" ? "active" : ""}
                onClick={() => setImageMode("url")}
              >
                Use image URL
              </button>
            </div>
            {imageMode === "upload" ? (
              <label>
                Image file
                <input
                  required={!form.image}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <span className="field-hint">
                  {uploading
                    ? "Uploading image..."
                    : "PNG, JPG, or WebP up to 10 MB. Files are stored in Cloudinary."}
                </span>
              </label>
            ) : (
              <label>
                Image URL
                <input
                  required={!form.image}
                  type="url"
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
                />
              </label>
            )}
            {form.image && (
              <img
                className="product-image-preview"
                src={form.image}
                alt="Selected product preview"
              />
            )}
          </div>
          <label>
            Badge <span className="field-hint">(optional)</span>
            <input
              value={form.badge}
              onChange={(e) => update("badge", e.target.value)}
              placeholder="Bestseller"
            />
          </label>
          {error && <p className="comment-error">{error}</p>}
          <button className="comment-submit" disabled={submitting || uploading}>
            {submitting ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Save changes" : "Add product")}
          </button>
          {editingId && <button type="button" className="comment-cancel" onClick={cancelEditing}>Cancel edit</button>}
        </form>
      </section>
      <section className="admin-list">
        <h2>Published products</h2>
        <ul className="comment-list">
          {products.map((product) => (
            <li className="comment-item admin-article-row" key={product.id}>
              <span>
                <strong>{product.name}</strong>
                <br />
                <span className="comment-author">
                  {product.category} · ${product.price.toFixed(2)}
                </span>
              </span>
              <span className="admin-product-actions">
                <button className="comment-link-btn" onClick={() => startEditing(product)}>Edit</button>
                <button className="comment-link-btn danger" onClick={() => archive(product.id)}>Archive</button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
