import { Outlet } from "react-router-dom";
import NavBar from "./pages/NavBar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
