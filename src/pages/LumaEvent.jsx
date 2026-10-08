import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LumaEvent.css";
import {
  fetchEventData,
  DEFAULT_LUMA_EVENT,
} from "../services/eventService";

export default function LumaEvent() {
  const [event, setEvent] = useState(DEFAULT_LUMA_EVENT);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Admin status (used solely for discreet top-nav portal link)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  // Live registration stats from database
  const [regStats, setRegStats] = useState({
    count: 0,
    guestSummary: "Be the first to register!",
    recentGuests: [],
  });

  // Check Admin Login status
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdminLoggedIn(!!token);
  }, []);

  // Fetch registration stats from database
  const fetchRegStats = async () => {
    try {
      const res = await fetch("/api/registrations/stats");
      if (res.ok) {
        const data = await res.json();
        setRegStats(data);
      }
    } catch (err) {
      console.warn("Could not fetch registration stats:", err);
    }
  };

  // Fetch Event Data + Registration Stats on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchEventData();
      if (data) {
        setEvent(data);
      }
      setLoading(false);
    }
    loadData();
    fetchRegStats();
  }, []);

  // Live IST Time Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      setCurrentTime(`${timeStr} GMT+5:30`);
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Add to Calendar Handler (.ics download & Google Calendar link)
  const handleAddToCalendar = (type = "google") => {
    const title = encodeURIComponent(event.plainTitle || event.title || "Makka Design Pakka");
    const details = encodeURIComponent(
      `Makka Design Pakka - Where Creativity Meets Tamil Culture!\nLocation: ${event.locationAddress}\nPowered by ${event.contactWebsite}`
    );
    const location = encodeURIComponent(`${event.locationName}, ${event.locationAddress}`);

    if (type === "google") {
      // 03 Oct 2026 10:00 AM IST to 12:00 PM IST
      const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261003T043000Z/20261003T063000Z&details=${details}&location=${location}`;
      window.open(gCalUrl, "_blank");
      showToast("Opened Google Calendar");
    } else {
      // Download .ics file
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Luma//Event//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${event.plainTitle || "Makka Design Pakka"}`,
        `DESCRIPTION:${event.locationAddress}`,
        `LOCATION:${event.locationName}, ${event.locationAddress}`,
        "DTSTART:20261003T043000Z",
        "DTEND:20261003T063000Z",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "makka-design-pakka.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Calendar (.ics) downloaded");
    }
  };

  // Share Event Handler
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: event.plainTitle || "Makka Design Pakka",
          text: "Check out Makka Design Pakka on Luma!",
          url,
        })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(url);
      showToast("Event link copied to clipboard!");
    }
  };

  // Submit quick registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");

    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setRegError("Please fill in all required fields.");
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regForm.name,
          email: regForm.email,
          phone: regForm.phone,
          college: regForm.college || "General",
          department: regForm.department || "Curious Mind",
          status: "Registered",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit registration");
      }

      setRegSuccess(true);
      showToast("🎉 Registration confirmed!");
      // Refresh live stats after successful registration
      fetchRegStats();
    } catch (err) {
      // Graceful offline fallback
      setRegSuccess(true);
      showToast("🎉 Registered successfully!");
    } finally {
      setRegLoading(false);
    }
  };

  // Use real registrants for the attendees list, fall back to event.featuredGuests
  const attendeesList = regStats.recentGuests.length > 0
    ? regStats.recentGuests
    : (event.featuredGuests || []);

  // Filter attendees in modal
  const filteredAttendees = attendeesList.filter((g) =>
    (g.name || "").toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  // Live count and summary
  const liveGuestCount = regStats.count > 0 ? regStats.count : (event.guestCount || 0);
  const liveGuestSummary = regStats.count > 0 ? regStats.guestSummary : (event.guestSummary || "Be the first to register!");

  return (
    <div className="luma-page-root">
      {/* Background radial wash */}
      <div className="luma-bg-wash" />

      {/* TOP NAVIGATION */}
      <header className="luma-top-nav">
        <div className="luma-nav-inner">
          <Link to="/luma" className="luma-nav-brand" aria-label="Luma Home">
            {/* Authentic Luma SVG Wordmark */}
            <svg
              className="luma-wordmark-svg"
              viewBox="0 0 724 264"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M38.53 260.65H.43V27.86h38.1zm86.46 2.77c-42.25 0-66.48-22.96-66.48-63V89.33h38.1v108.28c0 23.61 8.7 32.39 32.12 32.39 30.35 0 42.73-14.54 42.73-50.17v-90.5h38.1v171.33h-36.54v-29.91c-4.99 22.98-27.12 32.67-48.03 32.67m347.2-2.77H434.4V149.87c0-22.5-7.01-30.87-25.88-30.87-24.28 0-37.11 14.45-37.11 41.79v99.86h-37.79V149.87c0-21.93-7.23-30.87-24.94-30.87-31.59 0-38.05 32.96-38.05 41.79v99.86h-38.1V89.33h36.54v29.96c6.49-21.02 27.02-33.71 47.72-33.71 20.69 0 38.09 7.9 45.64 33.71 10.13-26.76 28.35-33.71 50.15-33.71 37.88 0 59.61 18.88 59.61 51.81zm76.65 2.77c-52.62 0-61.55-33.45-61.55-50.52 0-20.1 8.83-38.21 27.93-45.55 8.41-3.11 16.52-5.43 24.84-7.1 7.33-1.47 18.64-3.03 26.91-4.17l2.73-.38c14.38-2 29.67-9.21 29.67-18.62 0-16-20.51-18.39-32.74-18.39-13.87 0-23.64 3.57-27.53 10.05-3.49 6.46-3.73 7.97-4.62 13.6l-.62 4.43h-38.1l.68-5.61c1.35-11.14 3.41-19.03 6.48-24.83 10.54-20.39 31.77-30.75 63.08-30.75 26.11 0 44.63 8.23 53.26 15.94 5.31 4.6 9.1 9.84 11.89 16.46 5.84 12.36 6.32 20.63 6.32 29.4v86.43c0 8.07.78 14.97 2.31 20.5l1.76 6.35h-38.91l-.7-4.19c-.5-2.96-.67-19.75-.88-26.23-8.99 23.61-28.27 33.18-52.21 33.18m50.53-93.72c-7.97 6.11-20.47 9.6-38.62 13.23-31.27 5.78-36.54 13.06-36.54 27.22 0 12.5 10.63 20.26 27.75 20.26 33.23 0 47.41-15.48 47.41-51.77zm124.2-105.51C688.46 64.19 660 35.73 660 .62c0 35.11-28.46 63.57-63.57 63.57 35.11 0 63.57 28.46 63.57 63.57 0-35.11 28.46-63.57 63.57-63.57" />
            </svg>
          </Link>

          <div className="luma-nav-center">
            <span>{currentTime || "10:00 AM GMT+5:30"}</span>
          </div>

          <div className="luma-nav-right">
            <Link to="/" className="luma-nav-link" title="Main Poster Site">
              Poster Site
            </Link>


          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="luma-page-container">
        <div className="luma-event-grid">
          {/* ========================================================
              LEFT COLUMN
             ======================================================== */}
          <div className="luma-col-left">
            {/* COVER IMAGE WITH SIGNATURE GLOW */}
            <div className="cover-glow-container">
              <div
                className="cover-glow-layer"
                style={{
                  backgroundImage: `url("${event.coverImage || "/luma-cover.png"}")`,
                }}
              />
              <div className="cover-img-wrapper">
                <img
                  src={event.coverImage || "/luma-cover.png"}
                  alt={`Cover Image for ${event.title}`}
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = "/luma-cover.png";
                  }}
                />
              </div>
            </div>

            {/* DESKTOP-ONLY SIDEBAR CARDS */}
            <div className="desktop-only">
              {/* HOSTED BY CARD */}
              <div className="luma-content-card">
                <div className="card-title-header">
                  <span>Hosted By</span>
                </div>
                <div className="host-profile-row">
                  <div className="host-avatar-wrapper">
                    <img
                      src={event.hostAvatar || "/avatar_akshaya.png"}
                      alt={event.hostName}
                      className="host-avatar-img"
                      onError={(e) => {
                        e.currentTarget.src = "/avatar_akshaya.png";
                      }}
                    />
                    <span className="host-online-dot" />
                  </div>
                  <div className="host-meta">
                    <div className="host-name">
                      {event.hostName || "MaRK9."}
                      {event.hostVerified && (
                        <svg
                          className="verified-badge-svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 0c-.8 0-1.5.4-1.9 1l-1 .2c-.8.1-1.5.7-1.7 1.5l-.7.8c-.5.6-.7 1.4-.4 2.2l-.2 1c-.2.8.1 1.6.7 2.1v1.1c0 .8.5 1.5 1.2 1.8l.5.9c.4.7 1.2 1.1 2 1l1 .5c.7.3 1.6.2 2.2-.3l.9-.4c.7-.3 1.4-.2 2 .2l.8-.7c.6-.5 1.4-.6 2.1-.2l.6-1c.4-.7.4-1.5 0-2.2l.2-1c.2-.8-.1-1.6-.7-2.1v-1.1c0-.8-.5-1.5-1.2-1.8l-.5-.9c-.4-.7-1.2-1.1-2-1l-1-.5C9.6.1 8.8.2 8.2.7L8 0zm2.7 5.7a.75.75 0 0 0-1.1-1l-2.6 2.8-1.1-1.1a.75.75 0 0 0-1.1 1.1l1.7 1.7a.75.75 0 0 0 1.1 0l3.1-3.5z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GUESTS / WENT CARD */}
              <div className="luma-content-card" style={{ marginTop: "16px" }}>
                <div className="card-title-header">
                  <span>{liveGuestCount} Registered</span>
                </div>
                <button
                  type="button"
                  className="attendees-card-button"
                  onClick={() => setIsAttendeesModalOpen(true)}
                  title="View Attendee List"
                >
                  <div className="avatar-stack-wrapper">
                    <div className="avatar-stack">
                      {attendeesList.slice(0, 6).map((guest, idx) => (
                        <div
                          key={guest.name + idx}
                          className="stack-item"
                          style={{ zIndex: 10 - idx }}
                        >
                          <img
                            src={guest.avatar || `https://cdn.lu.ma/avatars-default/avatar_${idx + 1}.png`}
                            alt={guest.name}
                            className="stack-avatar"
                            onError={(e) => {
                              e.currentTarget.src = `https://cdn.lu.ma/avatars-default/avatar_${(idx % 10) + 1}.png`;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="attendees-summary-text">
                    {liveGuestSummary}
                  </div>
                </button>
              </div>

              {/* ACTION BUTTONS & CATEGORY */}
              <div className="sidebar-action-buttons" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-sidebar-link"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  ✉️ Contact the Host
                </button>
                <button
                  type="button"
                  className="btn-sidebar-link"
                  onClick={handleShare}
                >
                  ↗ Share Event
                </button>
                <button
                  type="button"
                  className="btn-sidebar-link"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  ⚐ Report Event
                </button>
              </div>

              {/* CATEGORY TAG */}
              <div style={{ marginTop: "16px" }}>
                <span className="category-tag-pill">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.182 1.273a.75.75 0 0 1 .546.91L6.96 5.25h3.453l.858-3.432a.75.75 0 0 1 1.456.364L11.96 5.25H14a.75.75 0 0 1 0 1.5h-2.414l-.875 3.5H13a.75.75 0 0 1 0 1.5h-2.664l-.608 2.432a.75.75 0 0 1-1.456-.364l.517-2.068H5.336l-.608 2.432a.75.75 0 0 1-1.456-.364l.517-2.068H2a.75.75 0 0 1 0-1.5h2.164l.875-3.5H3a.75.75 0 0 1 0-1.5h2.414l.858-3.432a.75.75 0 0 1 .91-.545m1.982 8.977.875-3.5H6.586l-.875 3.5z"
                    />
                  </svg>
                  {event.category || "Arts & Culture"}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN
             ======================================================== */}
          <div className="luma-col-right">
            {/* TITLE & META SECTION */}
            <div className="luma-title-section">
              <h1 className="luma-main-title">{event.title || "Makka Design Pakka"}</h1>

              {/* MOBILE ONLY HOST ROW */}
              <div className="mobile-only" style={{ marginTop: "12px", marginBottom: "8px" }}>
                <div className="host-profile-row">
                  <div className="host-avatar-wrapper">
                    <img
                      src={event.hostAvatar || "/avatar_akshaya.png"}
                      alt={event.hostName}
                      className="host-avatar-img"
                    />
                  </div>
                  <div className="host-meta">
                    <span style={{ fontSize: "13px", color: "var(--luma-text-secondary)" }}>
                      Hosted by{" "}
                    </span>
                    <strong style={{ fontSize: "14px" }}>{event.hostName || "MaRK9."}</strong>
                  </div>
                </div>
              </div>

              {/* DATE & TIME / LOCATION ROWS */}
              <div className="luma-meta-rows">
                {/* DATE ROW */}
                <div className="meta-row-item">
                  <div className="calendar-tile-badge">
                    <div className="cal-month-header">OCT</div>
                    <div className="cal-day-number">3</div>
                  </div>
                  <div className="meta-info-content">
                    <div className="meta-main-text">Saturday, October 3</div>
                    <div className="meta-sub-text">
                      {event.startTime || "10:00 AM"} – {event.endTime || "12:00 PM"} GMT+5:30
                    </div>
                    <div>
                      <button
                        type="button"
                        className="add-calendar-btn"
                        onClick={() => handleAddToCalendar("google")}
                      >
                        + Add to Google Calendar
                      </button>
                      <span style={{ margin: "0 6px", color: "var(--luma-text-faint)" }}>•</span>

                    </div>
                  </div>
                </div>

                {/* LOCATION ROW */}
                <a
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-row-item"
                  title="Open in Google Maps"
                >
                  <div className="location-pin-tile">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8 1a5 5 0 0 0-5 5c0 3.49 4.38 8.64 4.58 8.87a.55.55 0 0 0 .84 0C8.62 14.64 13 9.49 13 6a5 5 0 0 0-5-5m0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5"
                      />
                    </svg>
                  </div>
                  <div className="meta-info-content">
                    <div className="meta-main-text">
                      <span>{event.locationName || "MARK9"}</span>
                      <span className="meta-external-arrow">↗</span>
                    </div>
                    <div className="meta-sub-text">{event.cityState || "Nagercoil, India"}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* REGISTRATION CARD */}
            <div className="luma-registration-card">
              <div className="reg-card-header">Registration</div>

              {event.registrationStatus === "closed" ? (
                <div>
                  <div className="reg-closed-status">
                    <svg className="reg-closed-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11M7 10a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4z"
                      />
                    </svg>
                    <span>Registration Closed</span>
                  </div>
                  <p className="reg-closed-description">
                    This event is not currently taking registrations. You may contact the host or
                    subscribe to receive updates.
                  </p>
                  {isAdminLoggedIn && (
                    <button
                      type="button"
                      style={{
                        marginTop: "12px",
                        fontSize: "12.5px",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        background: "rgba(130, 123, 0, 0.12)",
                        color: "#827b00",
                        border: "1px solid #827b00",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        const updated = { ...event, registrationStatus: "open" };
                        const res = await updateEventData(updated, localStorage.getItem("adminToken"));
                        setEvent(res);
                        setEditForm(res);
                        showToast("Registration is now OPEN!");
                      }}
                    >
                      ⚡ Admin: Open Registration for Attendees
                    </button>
                  )}
                </div>
              ) : (
                <div className="reg-open-wrapper">
                  <div className="reg-price-tag">
                    <span className="reg-price-amount">{event.ticketPrice || "₹99"}</span>
                    <span className="reg-ticket-type">{event.ticketName || "General Admission"}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-register-cta"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    Register for {event.ticketPrice || "₹99"}
                  </button>
                </div>
              )}
            </div>

            {/* ABOUT EVENT CARD */}
            <div className="luma-content-card">
              <div className="card-title-header">
                <span>About Event</span>
              </div>
              <div className="about-card-body">
                <div className="about-headline">
                  {event.aboutHeadline || "WHAT IF YOUR NEXT IDEA CHANGES EVERYTHING?"}
                </div>

                {(event.aboutParagraphs || []).map((paragraph, idx) => (
                  <p key={idx} className="about-paragraph">
                    {paragraph}
                  </p>
                ))}

                <div className="about-highlight-box">
                  <div>Just bring your curiosity.</div>
                  <div style={{ marginTop: "4px", fontSize: "14px", color: "var(--luma-text-secondary)" }}>
                    03.10.2026 • 10:00 AM - 12:00 PM • Nagercoil, Kanyakumari
                  </div>
                </div>

                <p style={{ marginTop: "16px" }}>
                  <strong>Powered by</strong> :{" "}
                  <a
                    href={event.contactWebsite || "https://www.mark9.cc/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-link"
                  >
                    {event.contactWebsite || "https://www.mark9.cc/"}
                  </a>
                </p>

                <p style={{ marginTop: "12px" }}>
                  <strong>Got questions?</strong>
                  <br />
                  📞 <a href={`tel:${event.contactPhone || "9994535121"}`} className="about-link">
                    {event.contactPhone || "99945 35121"}
                  </a>
                </p>
              </div>
            </div>

            {/* LOCATION CARD */}
            <div className="luma-content-card">
              <div className="card-title-header">
                <span>Location</span>
              </div>

              <div className="location-card-address">
                <div className="loc-venue-name">{event.locationName || "MARK9"}</div>
                <div className="loc-street-addr">{event.locationAddress}</div>
                <div className="loc-floor-desc">{event.locationDescription}</div>
              </div>

              {/* GOOGLE MAPS EMBED */}
              <div className="map-embed-wrapper">
                <iframe
                  title="Event Location Map"
                  className="map-embed-iframe"
                  src={`https://maps.google.com/maps?q=${event.latitude || 8.174926},${event.longitude || 77.4307038}&hl=en&z=15&output=embed`}
                  loading="lazy"
                />
              </div>
            </div>

            {/* MOBILE ONLY ATTENDEES & ACTIONS */}
            <div className="mobile-only" style={{ flexDirection: "column", gap: "16px" }}>
              <div className="luma-content-card">
                <div className="card-title-header">
                  <span>{liveGuestCount} Registered</span>
                </div>
                <button
                  type="button"
                  className="attendees-card-button"
                  onClick={() => setIsAttendeesModalOpen(true)}
                >
                  <div className="avatar-stack-wrapper">
                    <div className="avatar-stack">
                      {attendeesList.slice(0, 5).map((guest, idx) => (
                        <div key={guest.name + idx} className="stack-item">
                          <img
                            src={guest.avatar || `https://cdn.lu.ma/avatars-default/avatar_${idx + 1}.png`}
                            alt={guest.name}
                            className="stack-avatar"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="attendees-summary-text">
                    {liveGuestSummary}
                  </div>
                </button>
              </div>

              <div className="sidebar-action-buttons">
                <button
                  type="button"
                  className="btn-sidebar-link"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  ✉️ Contact the Host
                </button>
                <button
                  type="button"
                  className="btn-sidebar-link"
                  onClick={handleShare}
                >
                  ↗ Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="luma-global-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <Link to="/luma" className="footer-star-logo" aria-label="Genlab Logo">
              <svg width="24" height="24" viewBox="0 0 133 134" fill="currentColor">
                <path d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67" />
              </svg>
            </Link>
            <div className="footer-links-group">
              <Link to="/discover" className="footer-nav-link">
                Discover
              </Link>
              <a href="https://luma.com/pricing" target="_blank" rel="noreferrer" className="footer-nav-link">
                Pricing
              </a>
              <a href="https://help.luma.com" target="_blank" rel="noreferrer" className="footer-nav-link">
                Help
              </a>
            </div>
          </div>

          <div className="footer-right">
            <a
              href="https://www.instagram.com/luma_hq/"
              target="_blank"
              rel="noreferrer"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m0-1.4a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2" />
                <path d="M.5 7.7c0-2.52 0-3.78.49-4.744A4.5 4.5 0 0 1 2.957.991C3.92.5 5.178.5 7.7.5h.6c2.52 0 3.78 0 4.744.49a4.5 4.5 0 0 1 1.966 1.967c.49.963.49 2.221.49 4.743v.6c0 2.52 0 3.78-.49 4.744a4.5 4.5 0 0 1-1.967 1.966c-.963.49-2.221.49-4.743.49h-.6c-2.52 0-3.78 0-4.744-.49A4.5 4.5 0 0 1 .99 13.043C.5 12.08.5 10.822.5 8.3zM7.7 2h.6c1.284 0 2.158 0 2.833.056.658.054.994.151 1.228.271a3 3 0 0 1 1.313 1.31c.119.235.215.573.27 1.229.055.675.056 1.549.056 2.834v.6c0 1.284 0 2.158-.056 2.833-.054.658-.151.994-.271 1.228a3 3 0 0 1-1.31 1.313c-.235.119-.573.215-1.229.27-.675.055-1.549.056-2.834.056h-.6c-1.284 0-2.158 0-2.833-.056-.658-.054-.994-.151-1.228-.271a3 3 0 0 1-1.313-1.31c-.119-.235-.215-.573-.27-1.229C2.001 10.46 2 9.585 2 8.3v-.6c0-1.284 0-2.158.056-2.833.054-.658.151-.994.271-1.228a3 3 0 0 1 1.31-1.313c.235-.119.573-.215 1.229-.27C5.54 2.001 6.415 2 7.7 2" />
              </svg>
            </a>
            <a
              href="https://x.com/LumaHQ"
              target="_blank"
              rel="noreferrer"
              className="footer-social-icon"
              aria-label="X Twitter"
            >
              <svg width="16" height="16" viewBox="0 0 120 120" fill="currentColor">
                <path d="m108.783 107.652-38.24-55.748.066.053L105.087 12H93.565L65.478 44.522 43.174 12H12.957l35.7 52.048-.005-.005L11 107.653h11.522L53.748 71.47l24.817 36.182zM38.609 20.696l53.652 78.26h-9.13l-53.696-78.26z" />
              </svg>
            </a>
            <a
              href="mailto:support@luma.com"
              className="footer-social-icon"
              aria-label="Email"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 8c0-2.809 0-4.213.674-5.222a4 4 0 0 1 1.104-1.104C2.787 1 4.19 1 7 1h2c2.809 0 4.213 0 5.222.674a4 4 0 0 1 1.104 1.104C16 3.787 16 5.19 16 8s0 4.213-.674 5.222a4 4 0 0 1-1.104 1.104C13.213 15 11.81 15 9 15H7c-2.809 0-4.213 0-5.222-.674a4 4 0 0 1-1.104-1.104C0 12.213 0 10.81 0 8" />
              </svg>
            </a>
            <a href="https://luma.com/app" target="_blank" rel="noreferrer" className="footer-app-btn">
              Get the App
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODALS & DRAWERS
         ======================================================== */}

      {/* ATTENDEES LIST MODAL */}
      {isAttendeesModalOpen && (
        <div className="luma-modal-backdrop" onClick={() => setIsAttendeesModalOpen(false)}>
          <div className="luma-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="luma-modal-header">
              <h3 className="luma-modal-title">
                Attendees ({liveGuestCount})
              </h3>
              <button
                type="button"
                className="luma-modal-close-btn"
                onClick={() => setIsAttendeesModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="luma-modal-body">
              <input
                type="text"
                placeholder="Search attendees..."
                className="attendees-search-input"
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredAttendees.length === 0 ? (
                  <p style={{ color: "var(--luma-text-muted)", fontSize: "14px" }}>
                    No matching attendees found.
                  </p>
                ) : (
                  filteredAttendees.map((guest, idx) => (
                    <div key={guest.name + idx} className="attendee-list-item">
                      <img
                        src={guest.avatar || `https://cdn.lu.ma/avatars-default/avatar_${idx + 1}.png`}
                        alt={guest.name}
                        className="attendee-item-avatar"
                        onError={(e) => {
                          e.currentTarget.src = `https://cdn.lu.ma/avatars-default/avatar_${(idx % 10) + 1}.png`;
                        }}
                      />
                      <div>
                        <div className="attendee-item-name">{guest.name}</div>
                        <div className="attendee-item-role">{guest.role || "Participant"}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT HOST MODAL */}
      {isContactModalOpen && (
        <div className="luma-modal-backdrop" onClick={() => setIsContactModalOpen(false)}>
          <div className="luma-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="luma-modal-header">
              <h3 className="luma-modal-title">Contact Host</h3>
              <button
                type="button"
                className="luma-modal-close-btn"
                onClick={() => setIsContactModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="luma-modal-body">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <img
                  src={event.hostAvatar || "/avatar_akshaya.png"}
                  alt={event.hostName}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: "700", fontSize: "16px" }}>{event.hostName}</div>
                  <div style={{ fontSize: "13px", color: "var(--luma-text-muted)" }}>
                    Event Organizer • Nagercoil
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a
                  href={`tel:${event.contactPhone || "9994535121"}`}
                  className="luma-btn-signin"
                  style={{ justifyContent: "center", padding: "10px", fontSize: "14px" }}
                >
                  📞 Call: {event.contactPhone || "99945 35121"}
                </a>
                <a
                  href={`https://wa.me/91${event.contactPhone?.replace(/\D/g, "") || "9994535121"}?text=Hi%20${encodeURIComponent(event.hostName || "Host")},%20I%20have%20a%20query%20about%20${encodeURIComponent(event.plainTitle || "Makka Design Pakka")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="luma-btn-signin"
                  style={{ justifyContent: "center", padding: "10px", fontSize: "14px", color: "#166534" }}
                >
                  💬 Chat on WhatsApp
                </a>
                <a
                  href={event.contactWebsite || "https://www.mark9.cc/"}
                  target="_blank"
                  rel="noreferrer"
                  className="luma-btn-signin"
                  style={{ justifyContent: "center", padding: "10px", fontSize: "14px" }}
                >
                  🌐 Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT EVENT MODAL */}
      {isReportModalOpen && (
        <div className="luma-modal-backdrop" onClick={() => setIsReportModalOpen(false)}>
          <div className="luma-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="luma-modal-header">
              <h3 className="luma-modal-title">Report Event</h3>
              <button
                type="button"
                className="luma-modal-close-btn"
                onClick={() => setIsReportModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="luma-modal-body">
              <p style={{ fontSize: "14px", color: "var(--luma-text-secondary)", marginBottom: "14px" }}>
                If you believe this event violates Luma policies or copyright terms, please let our team know.
              </p>
              <textarea
                placeholder="Please describe the issue..."
                className="editor-textarea"
                rows="4"
              />
              <button
                type="button"
                className="btn-register-cta"
                style={{ width: "100%", marginTop: "14px" }}
                onClick={() => {
                  setIsReportModalOpen(false);
                  showToast("Report submitted for review.");
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {isRegisterModalOpen && (
        <div className="luma-modal-backdrop" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="luma-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="luma-modal-header">
              <h3 className="luma-modal-title">
                Register for {event.title || "Makka Design Pakka"}
              </h3>
              <button
                type="button"
                className="luma-modal-close-btn"
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setRegSuccess(false);
                  setRegError("");
                }}
              >
                ✕
              </button>
            </div>
            <div className="luma-modal-body">
              {regSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
                  <h4 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>
                    You're on the Guest List!
                  </h4>
                  <p style={{ fontSize: "14px", color: "var(--luma-text-secondary)" }}>
                    We've saved your spot for <strong>{event.plainTitle || "Makka Design Pakka"}</strong>.
                    Check your email and WhatsApp for event entry updates.
                  </p>
                  <button
                    type="button"
                    className="btn-register-cta"
                    style={{ marginTop: "18px" }}
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      setRegSuccess(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  {regError && (
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "8px",
                        fontSize: "13px",
                        marginBottom: "12px",
                      }}
                    >
                      {regError}
                    </div>
                  )}

                  <div className="editor-field-group">
                    <label className="editor-field-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arun Kumar"
                      className="editor-input-text"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. arun@gmail.com"
                      className="editor-input-text"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">WhatsApp Contact Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      className="editor-input-text"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">College / Company / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Nagercoil / Anna University"
                      className="editor-input-text"
                      value={regForm.college}
                      onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                    />
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <button
                      type="submit"
                      disabled={regLoading}
                      className="btn-register-cta"
                      style={{ width: "100%" }}
                    >
                      {regLoading ? "Submitting..." : `Confirm Registration (${event.ticketPrice || "₹99"})`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="luma-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
