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
      })
      .then(() => {
        setName("");
        setTitle("");
        setContent("");
        setSubmitting(false);
        revalidator.revalidate();
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to create article");
        setSubmitting(false);
      });
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
