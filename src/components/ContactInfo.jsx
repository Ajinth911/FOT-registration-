import "./ContactInfo.css";

function ContactInfo() {
  return (
    <section className="contact-info" id="contact">
      <div className="contact-content">
        <p className="contact-label">GET IN TOUCH</p>

        <h2>
          HAVE A
          <br />
          QUESTION?
        </h2>

        <p className="contact-text">
          Want to know more about the event or need help with
          registration? Get in touch with us.
        </p>

        <div className="contact-details">
          <div className="contact-item">
            <span>EMAIL</span>
            <strong>hello@mdp.com</strong>
          </div>

          <div className="contact-item">
            <span>PHONE</span>
            <strong>+91 98765 43210</strong>
          </div>

          <div className="contact-item">
            <span>LOCATION</span>
            <strong>Nagercoil, Tamil Nadu</strong>
          </div>
        </div>

        <button className="contact-btn">
          CONTACT US
        </button>
      </div>
    </section>
  );
}

export default ContactInfo;