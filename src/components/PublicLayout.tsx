import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SettingsProvider from "../context/SettingsProvider";
import Footer from "./Footer";
import Navbar from "./Navbar";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function PublicLayout() {
  return (
    <SettingsProvider>
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </SettingsProvider>
  );
}
