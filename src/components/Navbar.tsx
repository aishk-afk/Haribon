import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSettings } from "../context/settings";
import { publicApi } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import Icon from "./Icon";

// These pages already have their own links or routes, so they are not added to the menu twice.
const BUILT_IN = ["home", "about", "donate"];
const fetchPages = () => publicApi.pages();

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const { org_name } = useSettings();
  const { data: pages } = useAsync(fetchPages);

  // Published pages created in the CMS (for example "Our Story") appear in the menu automatically.
  const extraPages = (pages ?? []).filter((p) => !BUILT_IN.includes(p.slug));

  // "Haribon Foundation" -> "Haribon" in white and "Foundation" in gold
  const [first, ...rest] = (org_name ?? "").split(" ");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="logo" onClick={close}>
          <Icon name="logo" size={22} badge="white" />
          <span className="logo-text">
            {first} {rest.length > 0 && <span>{rest.join(" ")}</span>}
          </span>
        </NavLink>

        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <Icon name={open ? "close" : "menu"} size={24} white />
        </button>

        <ul className={`nav-links ${open ? "show" : ""}`}>
          <li><NavLink to="/" end onClick={close}>Home</NavLink></li>
          <li><NavLink to="/about" onClick={close}>About Me</NavLink></li>
          {extraPages.map((page) => (
            <li key={page.id}>
              <NavLink to={`/${page.slug}`} onClick={close}>{page.title}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;