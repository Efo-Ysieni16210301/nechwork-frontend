import { useState } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

interface Article {
  name: string;
  title: string;
  content: string[];
}

export default function AdminPage() {
  const articles = useLoaderData() as Article[];
  const { isAdmin, loading } = useAuth();
  const revalidator = useRevalidator();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="article-page">Loading...</p>;

  if (!isAdmin) {
    return (
      <div className="article-page">
        <p>You don't have access to this page.</p>
        <Link to="/articles" className="article-back-link">
          ← Back to articles
        </Link>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !title.trim() || !content.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);

    const contentArray = content
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    api
      .post("/articles", {
        name: name.trim(),
        title: title.trim(),
        content: contentArray,
      ...(image.trim() ? { image: image.trim() } : {}),
      })
      .then(() => {
        setName("");
        setTitle("");
        setContent("");
        setImage("");
        setSubmitting(false);
        revalidator.revalidate();
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to create article");
        setSubmitting(false);
      });
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) { setError("Cloudinary upload is not configured."); return; }
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) { setError("Choose an image up to 10 MB."); return; }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", preset);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
      const result = await response.json() as { secure_url?: string; error?: { message?: string } };
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Image upload failed.");
      setImage(result.secure_url);
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Image upload failed."); }
    finally { setUploading(false); event.target.value = ""; }
  };

  const handleDelete = (articleName: string) => {
    if (!confirm(`Delete "${articleName}"? This cannot be undone.`)) return;
    api.delete(`/articles/${articleName}`).then(() => {
      revalidator.revalidate();
    });
  };

  return (
    <div className="article-page">
      <h1>Admin Dashboard</h1>

      <section className="admin-create">
        <h2>Create New Article</h2>
        <form onSubmit={handleCreate} className="comment-form">
          <input
            type="text"
            placeholder="Slug (e.g. ethiopian-honey)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="comment-input"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="comment-input"
          />
          <textarea
            placeholder="Content (separate paragraphs with a blank line)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="comment-textarea"
            style={{ minHeight: 160 }}
          />
          <label>Article image <span className="field-hint">(optional)</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} disabled={uploading} />
            <span className="field-hint">{uploading ? "Uploading..." : "Leave empty for a text-only article."}</span>
          </label>
          {image && <img className="article-image-preview" src={image} alt="Article preview" />}
          {error && <p className="comment-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="comment-submit"
          >
            {submitting ? "Creating..." : "Create Article"}
          </button>
        </form>
      </section>

      <section className="admin-list">
        <h2>Existing Articles</h2>
        <ul className="comment-list">
          {articles.map((a) => (
            <li key={a.name} className="comment-item admin-article-row">
              <span className="comment-author">{a.title}</span>
              <button
                onClick={() => handleDelete(a.name)}
                className="comment-link-btn danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
