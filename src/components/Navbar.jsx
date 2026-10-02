import React from 'react';
import { Link } from 'react-router-dom';

// Навігаційна панель для переходів між сторінками
export default function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <Link to="/">🎬 KinoSWIN </Link>
      </div>
      <div className="nav-links">
        <Link to="/">Repertuar</Link>
        <Link to="/history">Moje Rezerwacje</Link>
        <Link to="/about">O kinie</Link>
        <Link to="/contact">Kontakt</Link>
      </div>
    </nav>
  );
}