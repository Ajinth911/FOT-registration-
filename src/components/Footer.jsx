import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>MDP</h3>
          <p>Something uncommon is coming to Nagercoil.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#event">Event</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MDP. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;