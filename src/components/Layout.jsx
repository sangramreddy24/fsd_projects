import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div id="top" />
      <Navbar />
      <main id="main">
        {/* Each route's page component renders here */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
