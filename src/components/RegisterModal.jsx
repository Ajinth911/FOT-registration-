import { useState } from "react";
import "./RegisterModal.css";

function RegisterModal({ isOpen, onClose, onRegistered }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.college.trim() || !formData.department.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error ||
          (response.status >= 500
            ? "Cannot reach backend server. Please make sure the backend server is running on port 5000."
            : "Failed to submit registration")
        );
      }

      setSuccessData(data);
      if (onRegistered) {
        onRegistered(data);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setError("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      college: "",
      department: "",
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
          ✕
        </button>

        {successData ? (
          <div className="modal-success-view">
            <div className="success-icon-badge">✓</div>
            <h3>Registration Confirmed!</h3>
            <p className="success-subtitle">
              Thank you for registering for <strong>MAKKA DESIGN PAKKA</strong>.
            </p>

            <div className="ticket-summary-card">
              <div className="ticket-summary-row">
                <span>Participant:</span>
                <strong>{successData.name}</strong>
              </div>
              <div className="ticket-summary-row">
                <span>Email:</span>
                <strong>{successData.email}</strong>
              </div>
              <div className="ticket-summary-row">
                <span>College:</span>
                <strong>{successData.college}</strong>
              </div>
              <div className="ticket-summary-row">
                <span>Department:</span>
                <strong>{successData.department}</strong>
              </div>
              <div className="ticket-summary-row">
                <span>Registration Fee:</span>
                <strong>₹99</strong>
              </div>
              <div className="ticket-summary-row">
                <span>Status:</span>
                <span className="badge-registered">{successData.status || "Registered"}</span>
              </div>
            </div>

            <p className="ticket-notice">
              We look forward to seeing you in Nagercoil on <strong>03 October 2026</strong>!
            </p>

            <button className="modal-submit-btn" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="modal-header">
              <span className="modal-tag">MAKKA DESIGN PAKKA</span>
              <h2>Event Registration</h2>
              <p>Join the uncommon design experience in Nagercoil (Entry: ₹99)</p>
            </div>

            {error && <div className="modal-alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-email">Email Address *</label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-phone">Phone Number *</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-college">College / Institute *</label>
                  <input
                    id="reg-college"
                    type="text"
                    name="college"
                    placeholder="e.g. University College"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-department">Department / Major *</label>
                  <input
                    id="reg-department"
                    type="text"
                    name="department"
                    placeholder="e.g. Design / Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn" disabled={loading}>
                {loading ? "Submitting Registration..." : "Complete Registration (₹99)"}
              </button>

              <div className="modal-alt-option">
                <span>Or register via external platform:</span>
                <a
                  href="https://luma.com/s5hucs1r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-luma-link"
                >
                  Register on Luma ↗
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterModal;
