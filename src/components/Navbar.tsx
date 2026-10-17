import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <h2 className="logo">Haribon<span>.</span></h2>

        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${open ? "show" : ""}`}>
          <li>
            <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setOpen(false)}>About Me</NavLink>
          </li>
          <li>
            <NavLink to="/donate" onClick={() => setOpen(false)}>Donate</NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;