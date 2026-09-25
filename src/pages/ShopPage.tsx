import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { categories as fallbackCategories } from "../data/products";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/client";

export default function ShopPage() {
  const products = useLoaderData() as Product[];
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([...fallbackCategories]);
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const { addToCart } = useCart();
  const { t } = useLanguage();
  useEffect(() => {
    void api.get<{ name: string }[]>("/categories").then((response) => {
      setCategories(["All", ...response.data.map((item) => item.name)]);
    }).catch(() => undefined);
  }, []);
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((first, second) => {
    if (sort === "price-low") return first.price - second.price;
    if (sort === "price-high") return second.price - first.price;
    return 0;
  }), [category, products, query, sort]);

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
        <label className="sort-field">
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
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
