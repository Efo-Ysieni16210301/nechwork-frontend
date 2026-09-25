import { useEffect, useState } from "react";
import api from "../api/client";

const defaultGalleryImages = [
  ["A morning ritual", "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=85"],
  ["From the highlands", "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=85"],
  ["Made by hand", "https://images.unsplash.com/photo-1522120573867-e574959f84c8?auto=format&fit=crop&w=1000&q=85"],
  ["Gather around", "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85"],
  ["Simple pleasures", "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1000&q=85"],
];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);
  useEffect(() => {
    void api.get<{ caption: string; image: string }[]>("/gallery").then((response) => {
      setGalleryImages([...defaultGalleryImages, ...response.data.map((item) => [item.caption, item.image] as [string, string])]);
    }).catch(() => undefined);
  }, []);
  return (
    <main className="gallery-page">
      <div className="gallery-intro">
        <p className="eyebrow">A little closer</p>
        <h1>Objects and moments with a story.</h1>
        <p>We believe the best products carry the care of the people who made them. Come behind the scenes.</p>
      </div>
      <div className="gallery-grid">
        {galleryImages.map(([caption, image], index) => (
          <figure className={index === 0 ? "gallery-feature" : ""} key={caption}>
            <img src={image} alt={caption} />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
