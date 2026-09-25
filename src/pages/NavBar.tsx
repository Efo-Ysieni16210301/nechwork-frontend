import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

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
          <NavLink to="/shop" onClick={closeMenu}>{t("shop")}</NavLink>
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
