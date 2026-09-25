import { Link, useLoaderData } from "react-router-dom";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import Reveal from "../components/Reveal";

export default function HomePage() {
  const products = useLoaderData() as Product[];
  const { addToCart } = useCart();
  return (
    <div className="home-page">
      <Reveal className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Thoughtfully sourced in Ethiopia</p>
          <h1>Find something <em>worth savoring.</em></h1>
        <p className="home-lead">
          Coffee, tea, pantry goods, and everyday objects from people who care
          deeply about making good things.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-primary">Shop the collection</Link>
          <Link to="/about" className="text-link">Our approach <span>→</span></Link>
        </div>
        </div>
        <div className="hero-media" aria-label="A cinematic coffee preparation scene">
          <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85" alt="" />
          <img src="https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1400&q=85" alt="" />
          <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=85" alt="" />
          <div className="hero-media-caption">Small rituals. Big feeling.</div>
        </div>
      </Reveal>

      <Reveal className="ritual-banner" delay={80}>
        <div>
          <p className="eyebrow">Not sure where to start?</p>
          <h2>Tell us what you like. We’ll help you find your next favorite.</h2>
        </div>
        <Link to="/shop" className="btn btn-light">Explore your taste <span>→</span></Link>
      </Reveal>

      <Reveal className="home-featured" delay={120}>
        <div className="section-heading"><div><p className="eyebrow">A few favourites</p><h2>Made for your ritual</h2></div><Link to="/shop" className="text-link">Shop all →</Link></div>
        <div className="featured-grid">
          {products.slice(0, 3).map((product) => <article className="featured-card" key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.category}</span><h3>{product.name}</h3><strong>${product.price}</strong><button onClick={() => addToCart(product)}>Add to bag +</button></div></article>)}
        </div>
      </Reveal>

      <Reveal className="category-showcase" delay={140}>
        <div className="section-heading">
          <div><p className="eyebrow">Explore by mood</p><h2>There’s always more to discover.</h2></div>
          <Link to="/shop" className="text-link">View all products →</Link>
        </div>
        <div className="category-showcase-grid">
          {Array.from(new Set(products.map((product) => product.category))).slice(0, 4).map((category) => {
            const product = products.find((item) => item.category === category);
            return product ? (
              <Link className="category-showcase-card" to={`/shop?category=${encodeURIComponent(category)}`} key={category}>
                <img src={product.image} alt="" />
                <span>{category}</span>
                <strong>Shop {category} <b>↗</b></strong>
              </Link>
            ) : null;
          })}
        </div>
      </Reveal>

      <Reveal className="origin-marquee" delay={150}>
        <div className="origin-marquee-heading"><p className="eyebrow">From near and far</p><h2>Products with a place to tell.</h2></div>
        <div className="origin-track">
          {[...products, ...products].slice(0, 10).map((product, index) => <div className="origin-item" key={`${product.id}-${index}`}><span className="origin-pin">●</span><span>{["Addis Ababa", "Gondar", "Sidama", "Harar", "Metema"][index % 5]}</span><img src={product.image} alt={product.name} /><strong>{product.name}</strong></div>)}
        </div>
      </Reveal>

      <Reveal className="trust-stats" delay={170}>
        <div className="trust-stats-heading">
          <p className="eyebrow">Made for real life</p>
          <h2>Good products are better when people can count on them.</h2>
          <p>We keep listening, tasting, and improving so every order feels considered, useful, and worth sharing.</p>
        </div>
        <div className="trust-stats-grid">
          <div><strong>500+</strong><span>products selected with care</span></div>
          <div><strong>1,000+</strong><span>orders prepared for customers</span></div>
          <div><strong>13M+</strong><span>small moments made better</span></div>
          <div><strong>4.9/5</strong><span>customer experience rating</span></div>
        </div>
      </Reveal>

      <Reveal className="how-it-works" delay={160}>
        <p className="eyebrow">The Nech Work way</p>
        <h2>Good things, made easy.</h2>
        <div className="how-it-works-grid">
          <div><span>01</span><h3>Choose with confidence</h3><p>Clear notes, honest descriptions, and a collection that gets better every season.</p></div>
          <div><span>02</span><h3>We pack with care</h3><p>Every order is prepared by hand and ready to make an ordinary day feel special.</p></div>
          <div><span>03</span><h3>Enjoy the ritual</h3><p>Make time for the little things. We’ll keep bringing you more to discover.</p></div>
        </div>
      </Reveal>

      <Reveal className="newsletter-card" delay={180}>
        <div>
          <p className="eyebrow">A note from Nech Work</p>
          <h2>Good things, in your inbox.</h2>
          <p>New arrivals, thoughtful stories, and occasional offers. No noise, just the good stuff.</p>
        </div>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            <span className="sr-only">Email address</span>
            <input type="email" placeholder="Your email address" required />
          </label>
          <button className="btn btn-primary" type="submit">Sign me up <span>→</span></button>
        </form>
      </Reveal>
    </div>
  );
}
