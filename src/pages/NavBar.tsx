import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function NavBar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/">Ethio Insights</NavLink>
      </div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/articles">Articles</NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
        )}
      </ul>

      <div className="sidebar-auth">
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
          <NavLink to="/login" className="sidebar-login-link">
            Log in
          </NavLink>
        )}
      </div>
    </nav>
  );
}
