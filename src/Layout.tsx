import { Outlet } from "react-router-dom";
import NavBar from "./pages/NavBar";
import { company } from "./company";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
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
