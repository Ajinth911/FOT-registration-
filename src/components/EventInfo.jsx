import "./EventInfo.css";

function EventInfo() {
  return (
    <section className="event-info" id="event">
      <div className="event-info-content">
        <p className="event-label">SOMETHING UNCOMMON IS COMING</p>

        <h2>
          MAKKA
          <br />
          DESIGN
          <br />
          PAKKA
        </h2>

        <p className="event-description">
          An uncommon design experience is coming to Nagercoil.
          Join us for a creative event filled with ideas, learning,
          interaction and design.
        </p>

        <div className="event-details">
          <div className="detail-item">
            <span className="detail-title">DATE</span>
            <strong>03 OCTOBER 2026</strong>
          </div>

          <div className="detail-item">
            <span className="detail-title">VENUE</span>
            <strong>NAGERCOIL</strong>
          </div>

          <div className="detail-item">
            <span className="detail-title">ENTRY</span>
            <strong>₹99</strong>
          </div>
        </div>

        <button className="event-register-btn" onClick={() => window.open("https://luma.com/s5hucs1r", "_blank")}>
          REGISTER NOW
        </button>
      </div>
    </section>
  );
}

export default EventInfo;