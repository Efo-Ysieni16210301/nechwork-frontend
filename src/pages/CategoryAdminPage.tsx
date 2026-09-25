/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface Category { name: string; slug: string; active: boolean; }

export default function CategoryAdminPage() {
  const { isAdmin, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const response = await api.get<Category[]>("/categories");
      setCategories(response.data);
    } catch { setError("Could not load categories."); }
  };
  useEffect(() => { if (!loading && isAdmin) void load(); }, [isAdmin, loading]);

  if (loading) return <main className="article-page"><p>Loading...</p></main>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/shop">Back to shop</Link></main>;

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try { await api.post("/categories", { name }); setName(""); await load(); }
    catch (requestError) {
      setError((requestError as { response?: { data?: { error?: string } } }).response?.data?.error || "Could not create category.");
    }
  };
  const toggle = async (category: Category) => {
    try { await api.put(`/categories/${category.slug}`, { active: !category.active }); await load(); }
    catch { setError("Could not update category."); }
  };

  return <main className="article-page">
    <p className="eyebrow">Store management</p>
    <h1>Categories</h1>
    <p>Create as many product categories as your store needs. Archive a category instead of deleting it so existing products remain safe.</p>
    <form className="comment-form" onSubmit={create}><input className="comment-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Electronics" required /><button className="comment-submit">Add category</button></form>
    {error && <p className="comment-error">{error}</p>}
    <ul className="comment-list">{categories.map((category) => <li className="comment-item admin-article-row" key={category.slug}><span><strong>{category.name}</strong><br /><span className="comment-author">{category.active ? "Active" : "Archived"}</span></span><button className="comment-link-btn" onClick={() => void toggle(category)}>{category.active ? "Archive" : "Restore"}</button></li>)}</ul>
  </main>;
}
