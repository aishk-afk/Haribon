import { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="logo" onClick={close}>
          <Icon name="logo" size={22} badge="white" />
          <span className="logo-text">Haribon <span>Foundation</span></span>
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
        </ul>
      </div>
    </header>
  );
}

export default Navbar;