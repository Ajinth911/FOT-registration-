import "./Header.css";
import { Link } from "react-router-dom";

function Header({ onOpenRegister }) {
  return (
    <header className="header">

      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          FOT
        </Link>
      </div>

      <nav>
        <a href="#home">Home</a>
        <a href="#event">Event</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <Link to="/admin">Admin</Link>
      </nav>

      <button
        className="register-btn"
        onClick={() => {
          if (onOpenRegister) {
            onOpenRegister();
          } else {
            window.open("https://luma.com/s5hucs1r", "_blank");
          }
        }}
      >
        Register Now
      </button>

    </header>
  );
}

export default Header;