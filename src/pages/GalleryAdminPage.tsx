/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface ImageItem { _id: string; caption: string; image: string; }
export default function GalleryAdminPage() {
  const { isAdmin, loading } = useAuth();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const load = async () => { try { setItems((await api.get<ImageItem[]>("/gallery")).data); } catch { setError("Could not load gallery."); } };
  useEffect(() => { if (!loading && isAdmin) void load(); }, [loading, isAdmin]);
  if (loading) return <main className="article-page"><p>Loading...</p></main>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/gallery">Back to gallery</Link></main>;
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) { setError("Cloudinary upload is not configured."); return; }
    try { const body = new FormData(); body.append("file", file); body.append("upload_preset", preset); const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body }); const result = await response.json() as { secure_url?: string }; if (!response.ok || !result.secure_url) throw new Error("Image upload failed."); setImage(result.secure_url); } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Image upload failed."); } finally { event.target.value = ""; }
  };
  const add = async (event: React.FormEvent) => { event.preventDefault(); try { await api.post("/gallery", { caption, image }); setCaption(""); setImage(""); await load(); } catch { setError("Could not add gallery image."); } };
  const remove = async (id: string) => { if (confirm("Delete this gallery image?")) { await api.delete(`/gallery/${id}`); await load(); } };
  return <main className="article-page"><p className="eyebrow">Store management</p><h1>Gallery</h1><form className="comment-form" onSubmit={add}><input className="comment-input" placeholder="Caption" value={caption} onChange={(event) => setCaption(event.target.value)} required /><input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} required={!image} /><input className="comment-input" type="url" placeholder="Or paste an image URL" value={image} onChange={(event) => setImage(event.target.value)} required /><button className="comment-submit">Add image</button></form>{error && <p className="comment-error">{error}</p>}<ul className="comment-list">{items.map((item) => <li className="comment-item admin-article-row" key={item._id}><span><strong>{item.caption}</strong><br /><img className="admin-gallery-thumb" src={item.image} alt={item.caption} /></span><button className="comment-link-btn danger" onClick={() => void remove(item._id)}>Delete</button></li>)}</ul></main>;
}
