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
        <strong>{company.name}</strong>
        {company.offices.map((office) => (
          <span key={office.name}>
            {office.name}: <a href={`tel:${office.phone}`}>{office.phone}</a> · {office.address}
          </span>
        ))}
      </footer>
    </>
  );
}
