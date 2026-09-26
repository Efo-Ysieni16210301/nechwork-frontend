/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface Profile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function CustomerContactsPage() {
  const { isAdmin, loading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = async () => {
    try {
      const response = await api.get<Profile[]>("/admin/profiles");
      setProfiles(response.data);
    } catch {
      setError("Could not load customer contact details.");
    }
  };

  useEffect(() => {
    if (!loading && isAdmin) void loadProfiles();
  }, [isAdmin, loading]);

  if (loading) return <p className="article-page">Loading...</p>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/shop">Back to shop</Link></main>;

  return (
    <main className="article-page">
      <p className="eyebrow">Store management</p>
      <h1>Customer contacts</h1>
      <p>Customer names, email addresses, and phone numbers for order delivery and support.</p>
      {error && <p className="comment-error">{error}</p>}
      <ul className="comment-list">
        {profiles.map((profile) => (
          <li className="comment-item admin-article-row" key={profile.uid}>
            <span><strong>{profile.firstName} {profile.lastName}</strong><br /><span className="comment-author">{profile.email} · {profile.phoneNumber || "Phone not provided"}</span></span>
          </li>
        ))}
      </ul>
    </main>
  );
}
