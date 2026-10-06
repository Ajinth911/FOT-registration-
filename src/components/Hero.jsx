import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
        
      {/* Left traditional artwork */}
      <div className="decoration decoration-left"></div>

      {/* Main poster content */}
      <div className="hero-content">

        <div className="institute-logo">
          <div className="logo-symbol">◉</div>

          <div className="logo-text">
            <strong>UNCOMMON</strong>
            <span>INSTITUTE OF</span>
            <strong>DESIGN</strong>
          </div>
        </div>

        <h1>
          MAKkA
          <br />
          DESIGN
          <br />
          PAKKA
        </h1>

        <p className="tagline">
          Are You Ready To Be Uncommon?
        </p>

        <div className="event-ticket">
          <div className="ticket-date">
            <strong>03</strong>
            <div>
              <span>OCTOBER</span>
              <span>2026</span>
            </div>
          </div>

          <div className="ticket-fee">
            REGISTRATION FEE: <strong>₹99</strong>
          </div>
        </div>

      </div>

      {/* Right traditional artwork */}
      <div className="decoration decoration-right"></div>

    </section>
  );
}

export default Hero;