import { Link } from "react-router-dom";
import Preloader from "../components/Preloader";
import "./Home.css";

function Home() {

  return (
    <main className="app-container">
      <Preloader />

      <div className="home-page">
        {/* HERO SECTION */}
        <section className="hero-container" id="hero">
          <img
            src="/left.png"
            alt="Decorative Left Border"
            className="hero-border-left"
          />

          <header className="header-container">
            <img
              src="/logo.png"
              alt="Uncommon Institute of Design Logo"
              className="header-logo"
            />
          </header>

          <div className="hero-main">
            <div className="hero-badge-wrapper">
              <img
                src="/herologo.png"
                alt="MAKKA DESIGN PAKKA"
                className="hero-title-img"
              />
            </div>

            <img
              src="/date.png"
              alt="03 October 2026 - Registration Fee : ₹99"
              className="hero-date-badge"
            />

            <p className="hero-venue-text">
              <strong>Venue:</strong> 2nd Floor, MARK 9 Office, Chettikulam
            </p>

            <Link
              to="/luma"
              className="hero-register-btn"
              id="hero-register-now-btn"
            >
              Register Now
            </Link>
          </div>

          <img
            src="/right.png"
            alt="Decorative Right Border"
            className="hero-border-right"
          />
        </section>

        {/* CITY SECTION */}
        <section className="city-section" id="nagercoil">
          <div className="city-container">
            <div className="city-text-wrapper">
              <p className="city-subheading">
                something uncommon
                <br />
                is coming to
              </p>
              <h2 className="city-main-heading">NAGERCOIL</h2>
            </div>

            <div className="city-image-wrapper">
              <img
                src="/kk.png"
                alt="Nagercoil Landmarks Illustration"
                className="city-landmark-img"
              />
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <div className="about-frame-wrapper">
            <img
              src="/frame.png"
              alt="Decorative Frame"
              className="about-frame-overlay"
            />
            <div className="about-content">
              <p className="about-text">
                Uncommon Institute of Design, an initiative by{" "}
                <strong className="about-highlight">MARK9</strong>, is a place
                for curious minds to explore through experimentation, get
                guidance from experienced designers, and grow more confident in
                their ideas. With{" "}
                <strong className="about-highlight">MARK9’s</strong> support and
                community to keep exploring, try new things, and discover where
                your creativity can take you.
              </p>
            </div>
          </div>
        </section>

        {/* LEARN & CONTACT SECTION */}
        <section className="learn-section" id="learn-more">
          <img
            src="/star.png"
            alt="Decorative Star Left"
            className="learn-star-left"
          />

          <div className="learn-container">
            <div className="learn-person-wrapper">
              <img
                src="/person.png"
                alt="Student with Sunglasses"
                className="learn-person-img"
              />
            </div>

            <div className="learn-content-wrapper">
              <div className="learn-logo-wrapper">
                <img
                  src="/logo.png"
                  alt="Uncommon Institute of Design"
                  className="learn-logo-img"
                />
              </div>

              <div className="learn-text-wrapper">
                <h2 className="learn-tamil-heading">
                  இன்னும் எவ்வளவோ
                  <br />
                  இருக்கு கத்துக்குறதுக்கு
                </h2>

                <div className="learn-cta-wrapper">
                  <Link
                    to="/luma"
                    className="learn-register-btn"
                    id="learn-register-now-btn"
                  >
                    Register Now
                  </Link>
                </div>
              </div>

              <div className="learn-contact-wrapper">
                <p className="learn-address">
                  Address: 2nd Floor, MARK 9 Office, Chettikulam
                </p>
                <p className="learn-phone">
                  Contact No : <a href="tel:9994535121">99945 35121</a>
                </p>
                <p className="learn-website">
                  <a
                    href="https://www.mark9.cc"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.MARK9.cc
                  </a>
                </p>
                <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                  <Link
                    to="/admin"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#52008f",
                      textDecoration: "none",
                      background: "rgba(82, 0, 143, 0.08)",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    🔒 Authorized Admin Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>


    </main>
  );
}

export default Home;