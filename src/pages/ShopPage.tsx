import { useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { categories } from "../data/products";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ShopPage() {
  const products = useLoaderData() as Product[];
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const { addToCart } = useCart();
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [category, query]);

  return (
    <main className="shop-page">
      <div className="shop-heading">
        <div>
          <p className="eyebrow">The shop</p>
          <h1>Good things, thoughtfully sourced.</h1>
          <p>Everyday essentials and small luxuries from producers we know and trust.</p>
        </div>
        <Link to="/gallery" className="text-link">See our world →</Link>
      </div>
      <div className="shop-controls">
        <div className="category-tabs" aria-label="Product categories">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <span className="sr-only">Search products</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shop" />
          <span>⌕</span>
        </label>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="product-badge">{product.badge}</span>}
            </div>
            <div className="product-card-body">
              <div className="product-meta"><span>{product.category}</span><strong>${product.price}</strong></div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <button className="add-button" onClick={() => addToCart(product)}>Add to bag <span>+</span></button>
            </div>
          </article>
        ))}
      </div>
      {visibleProducts.length === 0 && <p className="empty-state">No products match that search.</p>}
    </main>
  );
}
