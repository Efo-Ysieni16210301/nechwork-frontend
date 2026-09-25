import { NavLink, useNavigate } from "react-router-dom";
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/" className="brand-lockup">
          <span className="brand-mark">◎</span>
          <span>Nech Work</span>
        </NavLink>
      </div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/" end>
            {t("home")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/shop">{t("shop")}</NavLink>
        </li>
        <li>
          <NavLink to="/gallery">{t("gallery")}</NavLink>
        </li>
        <li>
          <NavLink to="/articles">{t("articles")}</NavLink>
        </li>
        <li>
          <NavLink to="/about">{t("about")}</NavLink>
        </li>
        {isAdmin && (
          <>
            <li>
              <NavLink to="/admin">{t("admin")}</NavLink>
            </li>
            <li>
              <NavLink to="/admin/products">{t("products")}</NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders">{t("orders")}</NavLink>
            </li>
            <li>
              <NavLink to="/admin/customers">{t("customers")}</NavLink>
            </li>
          </>
        )}
        {user && !isAdmin && (
          <li>
            <NavLink to="/orders">{t("myOrders")}</NavLink>
          </li>
        )}
      </ul>

      <div className="sidebar-auth">
        <NavLink to="/cart" className="cart-link">
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
            <NavLink to="/login" className="sidebar-login-link">
              {t("login")}
            </NavLink>
            <NavLink to="/signup" className="btn btn-primary nav-signup">
              {t("signup")}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
