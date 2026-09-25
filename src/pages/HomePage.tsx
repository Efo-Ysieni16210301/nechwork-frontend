import { Link, useLoaderData } from "react-router-dom";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";

export default function HomePage() {
  const products = useLoaderData() as Product[];
  const { addToCart } = useCart();
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Well made, well chosen</p>
          <h1>Bring a little more <em>good</em> into your everyday.</h1>
        <p className="home-lead">
          A considered collection of coffee, pantry goods, and objects for
          slow mornings and generous gifting.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Shop the collection
        </Link>
        </div>
        <img className="hero-image" src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85" alt="A cup of coffee on a sunny cafe table" />
      </section>

      <section className="home-featured">
        <div className="section-heading"><div><p className="eyebrow">A few favourites</p><h2>Made for your ritual</h2></div><Link to="/shop" className="text-link">Shop all →</Link></div>
        <div className="featured-grid">
          {products.slice(0, 3).map((product) => <article className="featured-card" key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.category}</span><h3>{product.name}</h3><strong>${product.price}</strong><button onClick={() => addToCart(product)}>Add to bag +</button></div></article>)}
        </div>
      </section>
    </div>
  );
}
