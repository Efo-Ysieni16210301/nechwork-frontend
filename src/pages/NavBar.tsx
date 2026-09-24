import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/" className="brand-lockup"><span className="brand-mark">◎</span><span>mara</span></NavLink>
      </div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/shop">Shop</NavLink>
        </li>
        <li>
          <NavLink to="/gallery">Gallery</NavLink>
        </li>
        <li>
          <NavLink to="/articles">Articles</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        {isAdmin && (
          <>
            <li><NavLink to="/admin">Admin</NavLink></li>
            <li><NavLink to="/admin/products">Products</NavLink></li>
          </>
        )}
      </ul>

      <div className="sidebar-auth">
        <NavLink to="/cart" className="cart-link">Bag <span>{itemCount}</span></NavLink>
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
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="sidebar-login-link">Log in</NavLink>
            <NavLink to="/signup" className="btn btn-primary nav-signup">Sign up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
