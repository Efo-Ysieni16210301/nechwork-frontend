import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./pages/NavBar";
import { company } from "./company";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <div className="announcement-bar">
        Freshly chosen goods, delivered across Ethiopia <span>·</span> Free delivery on orders over 2,500 ETB
      </div>
      <NavBar />
      <div className="route-transition" key={location.pathname}>
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="footer-columns">
          <div><h3>Shop</h3><a href="/shop">All products</a><a href="/shop?category=Coffee">Coffee</a><a href="/shop?category=Tea">Tea & pantry</a><a href="/shop?category=Home%20%26%20gifts">Gifts</a></div>
          <div><h3>Learn</h3><a href="/articles">Articles</a><a href="/gallery">Our gallery</a><a href="/about">Our approach</a><a href="/signup">Join Nech Work</a></div>
          <div><h3>Support</h3><a href="/about">Contact us</a><a href="/orders">Track an order</a><a href="/about">Delivery information</a><span>Mon–Fri, 9–5</span></div>
          <div><h3>Company</h3><a href="/about">About us</a>{company.offices.map((office) => <span key={office.name}>{office.name}: <a href={`tel:${office.phone}`}>{office.phone}</a></span>)}</div>
          <div className="footer-signup"><h2>Stay in the loop.</h2><p>New products, stories, and good things from Nech Work.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Your email" aria-label="Your email" required /><button type="submit">Submit</button></form><div className="social-links"><a href="https://www.facebook.com" target="_blank" rel="noreferrer">f</a><a href="https://www.instagram.com" target="_blank" rel="noreferrer">◎</a><a href="https://www.youtube.com" target="_blank" rel="noreferrer">▶</a></div></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span><span><a href="/about">Privacy</a> · <a href="/about">Terms</a></span><strong>Nech Work</strong></div>
      </footer>
    </>
  );
}
