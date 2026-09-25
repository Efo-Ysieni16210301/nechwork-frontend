import { useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { categories } from "../data/products";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function ShopPage() {
  const products = useLoaderData() as Product[];
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [category, products, query]);

  return (
    <main className="shop-page">
      <div className="shop-heading">
        <div>
          <p className="eyebrow">{t("theShop")}</p>
          <h1>{t("shopTitle")}</h1>
          <p>{t("shopDescription")}</p>
        </div>
        <Link to="/gallery" className="text-link">{t("seeWorld")}</Link>
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
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchShop")} />
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
              <button className="add-button" onClick={() => addToCart(product)}>{t("addToBag")} <span>+</span></button>
            </div>
          </article>
        ))}
      </div>
      {visibleProducts.length === 0 && <p className="empty-state">{t("noProducts")}</p>}
    </main>
  );
}
