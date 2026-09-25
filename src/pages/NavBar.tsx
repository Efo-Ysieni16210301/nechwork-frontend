import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

export default function NavBar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { t, toggleLanguage, language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);
  const scheduleShopClose = () => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setShopOpen(false), 180);
  };
  const keepShopOpen = () => window.clearTimeout(closeTimerRef.current);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setShopOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShopOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <nav className={`sidebar ${menuOpen ? "menu-open" : ""}`}>
      <div className="sidebar-brand">
        <NavLink to="/" className="brand-lockup" onClick={closeMenu}>
          <span className="brand-mark">◎</span>
          <span>Nech Work</span>
        </NavLink>
      </div>
      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      >
        <span />
        <span />
        <span />
      </button>
      <ul id="site-navigation" className="sidebar-links">
        <li>
          <NavLink to="/" end onClick={closeMenu}>
            {t("home")}
          </NavLink>
        </li>
        <li>
          <div
            className={`shop-nav-item ${shopOpen ? "shop-open" : ""}`}
            ref={shopMenuRef}
            onMouseEnter={keepShopOpen}
            onMouseLeave={scheduleShopClose}
          >
            <button
              type="button"
              className="shop-menu-trigger"
              aria-expanded={shopOpen}
              aria-haspopup="true"
              onClick={() => setShopOpen((open) => !open)}
            >
              {t("shop")} <span aria-hidden="true">⌄</span>
            </button>
            <div className="shop-mega-menu">
              <div className="mega-menu-links">
                <Link className="mega-menu-heading-link" to="/shop" onClick={() => { closeMenu(); setShopOpen(false); }}>Shop all</Link>
                <Link to="/shop" onClick={() => { closeMenu(); setShopOpen(false); }}>Build your collection</Link>
                <Link to="/shop?category=Coffee" onClick={() => { closeMenu(); setShopOpen(false); }}>Browse coffee</Link>
                <Link to="/shop?category=Tea" onClick={() => { closeMenu(); setShopOpen(false); }}>Browse tea</Link>
                <Link to="/shop?category=Home%20%26%20gifts" onClick={() => { closeMenu(); setShopOpen(false); }}>Gifts for good mornings</Link>
              </div>
              <Link className="mega-menu-card" to="/shop?category=Coffee" onClick={() => { closeMenu(); setShopOpen(false); }}>
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85" alt="" />
                <strong>Find your everyday cup</strong>
                <span>Explore coffee →</span>
              </Link>
              <Link className="mega-menu-card" to="/gallery" onClick={() => { closeMenu(); setShopOpen(false); }}>
                <img src="https://images.unsplash.com/photo-1522120573867-e574959f84c8?auto=format&fit=crop&w=700&q=85" alt="" />
                <strong>Made with intention</strong>
                <span>See our world →</span>
              </Link>
            </div>
          </div>
        </li>
        <li>
          <NavLink to="/gallery" onClick={closeMenu}>{t("gallery")}</NavLink>
        </li>
        <li>
          <NavLink to="/articles" onClick={closeMenu}>{t("articles")}</NavLink>
        </li>
        <li>
          <NavLink to="/about" onClick={closeMenu}>{t("about")}</NavLink>
        </li>
        {isAdmin && (
          <>
            <li>
              <NavLink to="/admin" onClick={closeMenu}>{t("admin")}</NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" onClick={closeMenu}>{t("products")}</NavLink>
            </li>
            <li>
              <NavLink to="/admin/categories" onClick={closeMenu}>Categories</NavLink>
            </li>
            <li>
              <NavLink to="/admin/gallery" onClick={closeMenu}>Gallery manager</NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" onClick={closeMenu}>{t("orders")}</NavLink>
            </li>
            <li>
              <NavLink to="/admin/customers" onClick={closeMenu}>{t("customers")}</NavLink>
            </li>
          </>
        )}
        {user && !isAdmin && (
          <li>
            <NavLink to="/orders" onClick={closeMenu}>{t("myOrders")}</NavLink>
          </li>
        )}
      </ul>

      <div className="sidebar-auth">
        <NavLink to="/cart" className="cart-link" onClick={closeMenu}>
          {t("bag")} <span>{itemCount}</span>
        </NavLink>
        <button
          type="button"
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={
            language === "en" ? "Switch to Amharic" : "Switch to English"
          }
        >
          {t("language")}
        </button>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        {user ? (
          <>
            <span className="sidebar-user">{user.email}</span>
            <button onClick={handleLogout} className="sidebar-logout">
              {t("logout")}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="sidebar-login-link" onClick={closeMenu}>
              {t("login")}
            </NavLink>
            <NavLink to="/signup" className="btn btn-primary nav-signup" onClick={closeMenu}>
              {t("signup")}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
