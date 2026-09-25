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
  phoneNumber?: string;
  phoneVerified: boolean;
}

export default function CustomerVerificationPage() {
  const { isAdmin, loading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = async () => {
    try {
      const response = await api.get<Profile[]>("/admin/profiles");
      setProfiles(response.data);
    } catch {
      setError("Could not load customer verification requests.");
    }
  };

  useEffect(() => {
    if (!loading && isAdmin) void loadProfiles();
  }, [isAdmin, loading]);

  if (loading) return <p className="article-page">Loading...</p>;
  if (!isAdmin) return <main className="article-page"><p>You don't have access to this page.</p><Link to="/shop">Back to shop</Link></main>;

  const setStatus = async (uid: string, verified: boolean) => {
    try {
      await api.patch(`/admin/profiles/${uid}/phone-status`, { verified });
      await loadProfiles();
    } catch {
      setError("Could not update phone verification.");
    }
  };

  return (
    <main className="article-page">
      <p className="eyebrow">Store management</p>
      <h1>Customer verification</h1>
      <p>Review phone numbers submitted by customers. Confirm them only after checking the customer through your chosen manual process.</p>
      {error && <p className="comment-error">{error}</p>}
      <ul className="comment-list">
        {profiles.map((profile) => (
          <li className="comment-item admin-article-row" key={profile.uid}>
            <span><strong>{profile.firstName} {profile.lastName}</strong><br /><span className="comment-author">{profile.email} · {profile.phoneNumber || "No phone number"} · {profile.phoneVerified ? "Approved" : "Pending"}</span></span>
            <span className="admin-product-actions">
              <button className="comment-link-btn" onClick={() => void setStatus(profile.uid, true)} disabled={!profile.phoneNumber}>Approve</button>
              <button className="comment-link-btn danger" onClick={() => void setStatus(profile.uid, false)}>Revoke</button>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
