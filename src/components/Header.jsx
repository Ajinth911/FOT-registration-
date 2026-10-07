import "./Header.css";
function Header() {
  return (
    <header className="header">

      <div className="logo">
        FOT
      </div>

      <nav>
        <a href="#home">Home</a>
        <a href="#event">Event</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
 <div className="header-buttons">
        <button
          className="admin-btn"
          onClick={() => (window.location.href = "/admin-login")}
        >
          Admin Login
        </button>
      <button className="register-btn"
      onClick={()=>window.open("https://luma.com/s5hucs1r","_blank")}>
        Register Now
      </button>
</div>
    </header>
  );
}

export default Header;