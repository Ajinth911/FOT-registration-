import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import AdminLogin from "../components/AdminLogin";

function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const u = localStorage.getItem("adminUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("dashboard");
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal and Import states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingParticipant, setViewingParticipant] = useState(null);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importNotice, setImportNotice] = useState(null);
  const fileInputRef = useRef(null);

  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    status: "Registered",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdminUser(null);
  };

  // Helper for auth headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || localStorage.getItem("adminToken")}`,
  });

  // Fetch registrations from API
  const fetchRegistrations = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("/api/registrations", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("adminToken")}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch registrations");
      let data = [];
      try {
        data = await res.json();
      } catch {
        data = [];
      }
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to backend API or session expired.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRegistrations();
    }
  }, [token]);

  // If not authenticated, render login screen
  if (!token) {
    return (
      <AdminLogin
        onLoginSuccess={(newToken, user) => {
          setToken(newToken);
          setAdminUser(user);
        }}
      />
    );
  }

  // Filtered registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      (reg.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.college || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.department || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (reg.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Dynamic statistics
  const totalCount = registrations.length;
  const confirmedCount = registrations.filter(
    (r) => r.status === "Confirmed" || r.status === "Registered"
  ).length;
  const pendingCount = registrations.filter((r) => r.status === "Pending").length;
  const cancelledCount = registrations.filter((r) => r.status === "Cancelled").length;
  const revenue = confirmedCount * 99;

  const capacityMax = 150;
  const remainingSpots = Math.max(0, capacityMax - totalCount);
  const capacityPercent = Math.min(100, Math.round((totalCount / capacityMax) * 100));
  const confirmedPercent = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0;

  // Add Participant Handler
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(addFormData),
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) throw new Error(data?.message || data?.error || "Failed to add participant");

      setAddFormData({
        name: "",
        email: "",
        phone: "",
        college: "",
        department: "",
        status: "Registered",
      });
      setIsAddModalOpen(false);
      await fetchRegistrations();
    } catch (err) {
      alert("Error adding participant: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Status Handler
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error("Failed to update status");
      setEditingParticipant(null);
      await fetchRegistrations();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete registration for ${name || "this participant"}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error("Failed to delete registration");
      await fetchRegistrations();
    } catch (err) {
      alert("Error deleting registration: " + err.message);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("No registrations to export.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "College", "Department", "Status", "Date"];
    const rows = registrations.map((r) => [
      `"${(r.name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.college || "").replace(/"/g, '""')}"`,
      `"${(r.department || "").replace(/"/g, '""')}"`,
      `"${(r.status || "Registered").replace(/"/g, '""')}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger hidden file picker
  const handleTriggerImportCSV = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Papa Parse CSV Guest Import Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    setIsImporting(true);
    setImportNotice(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: false,
      complete: async (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error("The selected CSV file appears to be empty.");
          }

          // Map CSV columns gracefully
          const guests = results.data
            .map((row) => {
              const normalized = {};
              for (const key of Object.keys(row)) {
                if (key) {
                  normalized[key.trim().toLowerCase()] = row[key];
                }
              }

              const getVal = (aliases) => {
                for (const a of aliases) {
                  if (
                    normalized[a] !== undefined &&
                    normalized[a] !== null &&
                    String(normalized[a]).trim() !== ""
                  ) {
                    return String(normalized[a]).trim();
                  }
                }
                return "";
              };

              let name = getVal([
                "name",
                "full name",
                "fullname",
                "participant",
                "participant name",
                "guest",
                "guest name",
              ]);
              if (!name) {
                const first = getVal(["first name", "firstname"]);
                const last = getVal(["last name", "lastname"]);
                if (first || last) name = `${first} ${last}`.trim();
              }

              const email = getVal(["email", "email address", "mail", "email id"]);
              const phone =
                getVal([
                  "phone",
                  "phone number",
                  "phonenumber",
                  "mobile",
                  "mobile number",
                  "contact",
                  "contact no",
                  "contact number",
                ]) || "N/A";
              const college =
                getVal([
                  "college",
                  "college / institute",
                  "institute",
                  "institution",
                  "university",
                  "college/institute",
                  "organization",
                  "org",
                ]) || "N/A";
              const department =
                getVal(["department", "dept", "major", "branch", "course"]) || "General";
              let status =
                getVal(["status", "registration status", "ticket status"]) || "Registered";

              const validStatuses = ["Registered", "Confirmed", "Pending", "Cancelled"];
              const matchedStatus = validStatuses.find(
                (s) => s.toLowerCase() === status.toLowerCase()
              );
              status = matchedStatus || "Registered";

              return {
                name: String(name).trim(),
                email: String(email).trim().toLowerCase(),
                phone: String(phone).trim(),
                college: String(college).trim(),
                department: String(department).trim(),
                status,
              };
            })
            .filter((g) => g.name && g.email);

          if (guests.length === 0) {
            throw new Error(
              "No valid guest rows found in CSV. Please ensure your CSV includes 'Name' and 'Email' columns."
            );
          }

          // POST to backend Mongoose endpoint
          const res = await fetch("/api/registrations/import", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ guests }),
          });

          if (res.status === 401) {
            handleLogout();
            return;
          }

          let resData = null;
          try {
            resData = await res.json();
          } catch {
            resData = null;
          }

          if (!res.ok || !resData?.success) {
            throw new Error(
              resData?.message ||
                "Failed to save guests in MongoDB. Please check backend."
            );
          }

          setImportNotice({
            type: "success",
            message: `Successfully imported ${resData.count || guests.length} guest(s) into MongoDB!`,
          });

          // Refresh guest list
          await fetchRegistrations();
        } catch (err) {
          console.error("CSV Import Error:", err);
          setImportNotice({
            type: "error",
            message: err.message || "Failed to process and import CSV.",
          });
        } finally {
          setIsImporting(false);
        }
      },
      error: (err) => {
        console.error("Papa Parse Error:", err);
        setImportNotice({
          type: "error",
          message: `CSV Parse Error: ${err.message}`,
        });
        setIsImporting(false);
      },
    });
  };

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed" || s === "registered") return "status confirmed";
    if (s === "pending") return "status pending";
    if (s === "cancelled") return "status cancelled";
    return "status confirmed";
  };

  return (
    <main className="admin-page">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">M9</div>
          <div>
            <h2>MARK9</h2>
            <span>EVENT ADMIN</span>
          </div>
        </div>

        {/* MAIN MENU */}
        <div className="sidebar-section">
          <p>MAIN</p>

          <button
            className={`sidebar-item ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`sidebar-item ${activePage === "registrations" ? "active" : ""}`}
            onClick={() => setActivePage("registrations")}
          >
            <span>◉</span>
            Registrations {totalCount > 0 && `(${totalCount})`}
          </button>

          <button
            className={`sidebar-item ${activePage === "participants" ? "active" : ""}`}
            onClick={() => setActivePage("participants")}
          >
            <span>♢</span>
            Participants
          </button>
        </div>

        {/* EVENT MANAGEMENT */}
        <div className="sidebar-section">
          <p>EVENT MANAGEMENT</p>

          <button
            className={`sidebar-item ${activePage === "event" ? "active" : ""}`}
            onClick={() => setActivePage("event")}
          >
            <span>◷</span>
            Event Details
          </button>

          <button
            className={`sidebar-item ${activePage === "reports" ? "active" : ""}`}
            onClick={() => setActivePage("reports")}
          >
            <span>▤</span>
            Reports
          </button>

          <button
            className={`sidebar-item ${activePage === "settings" ? "active" : ""}`}
            onClick={() => setActivePage("settings")}
          >
            <span>⚙</span>
            Settings
          </button>
        </div>

        <Link to="/" className="sidebar-home-link">
          ← View Public Site
        </Link>

        {/* ADMIN PROFILE & LOGOUT */}
        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>{adminUser?.username || "Admin"}</strong>
              <span>Event Manager</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                marginLeft: "auto",
                background: "rgba(239, 68, 68, 0.25)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#fca5a5",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <section className="admin-content">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <button className="menu-button">☰</button>

          <div className="admin-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search registrations, participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="topbar-actions">
            <button className="topbar-icon" onClick={fetchRegistrations} title="Refresh Data">
              ↻
            </button>

            <button
              onClick={handleLogout}
              className="secondary-button"
              style={{
                height: "34px",
                padding: "0 12px",
                borderColor: "#fca5a5",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
              }}
              title="Sign Out of Admin Portal"
            >
              <span>🔒</span> Logout
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">A</div>
              <div>
                <strong>{adminUser?.username || "Admin"}</strong>
                <small>Event Manager</small>
              </div>
            </div>
          </div>
        </header>

        {/* IMPORT NOTICE (SUCCESS / ERROR) */}
        {importNotice && (
          <div
            style={{
              margin: "16px 34px 0",
              padding: "12px 18px",
              background: importNotice.type === "success" ? "#ecfdf5" : "#fee2e2",
              border: `1px solid ${importNotice.type === "success" ? "#34d399" : "#f87171"}`,
              borderRadius: "10px",
              color: importNotice.type === "success" ? "#065f46" : "#991b1b",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            <span>{importNotice.type === "success" ? "✓ " : "⚠ "}{importNotice.message}</span>
            <button
              onClick={() => setImportNotice(null)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
                color: "inherit",
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* ERROR / LOADING NOTICES */}
        {error && (
          <div style={{ margin: "16px 34px 0", padding: "12px 18px", background: "#fee2e2", border: "1px solid #f87171", borderRadius: "10px", color: "#991b1b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button onClick={fetchRegistrations} className="secondary-button" style={{ height: "30px", padding: "0 10px" }}>
              Retry
            </button>
          </div>
        )}

        {/* DASHBOARD CONTENT */}
        {activePage === "dashboard" && (
          <>
            {/* PAGE HEADER */}
            <div className="dashboard-header">
              <div>
                <p className="dashboard-breadcrumb">DASHBOARD / EVENT MANAGEMENT</p>
                <h1>Welcome back, Admin</h1>
                <p>Here's what's happening with your event registrations today.</p>
              </div>

              <div className="header-actions">
                {/* Hidden file input for Papa Parse CSV upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <button
                  className="secondary-button"
                  onClick={handleTriggerImportCSV}
                  disabled={isImporting}
                  title="Import guests from a CSV file"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>{isImporting ? "⌛" : "↑"}</span>
                  {isImporting ? "Importing..." : "Import CSV"}
                </button>
                <button className="secondary-button" onClick={handleExportCSV}>
                  ↓ Export
                </button>
                <button className="primary-button" onClick={() => setIsAddModalOpen(true)}>
                  + Add Participant
                </button>
              </div>
            </div>

            {/* STAT CARDS */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon purple">◉</div>
                  <span className="stat-growth">Live</span>
                </div>
                <span className="stat-label">Total Registrations</span>
                <h2>{isLoading ? "..." : totalCount}</h2>
                <p>{totalCount === 0 ? "No signups yet" : `${totalCount} participants enrolled`}</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon green">✓</div>
                  <span className="stat-growth">{confirmedPercent}%</span>
                </div>
                <span className="stat-label">Confirmed / Registered</span>
                <h2>{isLoading ? "..." : confirmedCount}</h2>
                <p>{confirmedCount} ready for event</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon orange">◷</div>
                  <span className="stat-growth">{pendingCount}</span>
                </div>
                <span className="stat-label">Pending</span>
                <h2>{isLoading ? "..." : pendingCount}</h2>
                <p>Awaiting confirmation</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon blue">₹</div>
                  <span className="stat-growth">₹99/ticket</span>
                </div>
                <span className="stat-label">Total Revenue</span>
                <h2>{isLoading ? "..." : `₹${revenue.toLocaleString()}`}</h2>
                <p>From registration fees</p>
              </div>
            </section>

            {/* CHART + EVENT OVERVIEW */}
            <section className="dashboard-grid">
              {/* ANALYTICS CARD */}
              <div className="dashboard-card chart-card">
                <div className="card-header">
                  <div>
                    <p>REGISTRATION ANALYTICS</p>
                    <h2>Registration Overview</h2>
                  </div>
                  <select>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>

                <div className="chart-area">
                  <div className="chart-y-axis">
                    <span>150</span>
                    <span>100</span>
                    <span>50</span>
                    <span>0</span>
                  </div>

                  <div className="chart">
                    <div className="chart-grid-line"></div>
                    <div className="chart-grid-line"></div>
                    <div className="chart-grid-line"></div>
                    <div className="chart-grid-line"></div>

                    <div className="chart-bars">
                      <div className="bar" style={{ height: "35%" }}><span>Mon</span></div>
                      <div className="bar" style={{ height: "48%" }}><span>Tue</span></div>
                      <div className="bar" style={{ height: "55%" }}><span>Wed</span></div>
                      <div className="bar" style={{ height: "70%" }}><span>Thu</span></div>
                      <div className="bar" style={{ height: "65%" }}><span>Fri</span></div>
                      <div className="bar" style={{ height: "82%" }}><span>Sat</span></div>
                      <div className="bar" style={{ height: "95%" }}><span>Sun</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* EVENT OVERVIEW */}
              <div className="dashboard-card event-card">
                <div className="card-header">
                  <div>
                    <p>YOUR EVENT</p>
                    <h2>Event Overview</h2>
                  </div>
                  <button className="more-button">•••</button>
                </div>

                <div className="event-title-box">
                  <div className="event-logo">M9</div>
                  <div>
                    <h3>Makka Design Pakka</h3>
                    <span>MARK9 • Nagercoil</span>
                  </div>
                </div>

                <div className="event-info">
                  <div>
                    <span>DATE</span>
                    <strong>03 Oct 2026</strong>
                  </div>
                  <div>
                    <span>TIME</span>
                    <strong>10:00 AM</strong>
                  </div>
                  <div>
                    <span>FEE</span>
                    <strong>₹99</strong>
                  </div>
                </div>

                <div className="capacity-section">
                  <div className="capacity-header">
                    <span>Registration Capacity</span>
                    <strong>{totalCount} / {capacityMax}</strong>
                  </div>
                  <div className="capacity-bar">
                    <div style={{ width: `${capacityPercent}%` }}></div>
                  </div>
                  <small>{remainingSpots} spots remaining</small>
                </div>

                <button className="event-button" onClick={() => setActivePage("registrations")}>
                  Manage Registrations →
                </button>
              </div>
            </section>

            {/* BOTTOM SECTION */}
            <section className="bottom-grid">
              {/* RECENT REGISTRATIONS */}
              <div className="dashboard-card registrations-card">
                <div className="card-header">
                  <div>
                    <p>PARTICIPANTS</p>
                    <h2>Recent Registrations</h2>
                  </div>
                  <button className="view-all" onClick={() => setActivePage("registrations")}>
                    View All →
                  </button>
                </div>

                <div className="registration-table">
                  <div className="table-header">
                    <span>Participant</span>
                    <span>Email</span>
                    <span>Status</span>
                    <span>Date</span>
                  </div>

                  {isLoading ? (
                    <div className="table-empty-notice">Loading registrations...</div>
                  ) : registrations.length === 0 ? (
                    <div className="table-empty-notice">
                      No registrations in database yet.
                      <br />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
                        <button
                          className="primary-button"
                          style={{ height: "34px" }}
                          onClick={() => setIsAddModalOpen(true)}
                        >
                          + Add Participant
                        </button>
                        <button
                          className="secondary-button"
                          style={{ height: "34px", display: "flex", alignItems: "center", gap: "6px" }}
                          onClick={handleTriggerImportCSV}
                          disabled={isImporting}
                        >
                          <span>{isImporting ? "⌛" : "↑"}</span>
                          {isImporting ? "Importing..." : "Import CSV"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    registrations.slice(0, 5).map((reg) => (
                      <div className="table-row" key={reg._id || reg.email}>
                        <div className="participant-info">
                          <div className="participant-avatar">
                            {(reg.name || "P").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{reg.name}</strong>
                            <small>{reg.college || "Participant"}</small>
                          </div>
                        </div>
                        <span>{reg.email}</span>
                        <span className={getStatusClass(reg.status)}>
                          {reg.status || "Registered"}
                        </span>
                        <span>
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleDateString()
                            : "Recent"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* REGISTRATION STATUS */}
              <div className="dashboard-card status-card">
                <div className="card-header">
                  <div>
                    <p>REGISTRATION STATUS</p>
                    <h2>Breakdown</h2>
                  </div>
                </div>

                <div className="status-circle">
                  <div>
                    <strong>{confirmedPercent}%</strong>
                    <span>Confirmed</span>
                  </div>
                </div>

                <div className="status-legend">
                  <div>
                    <span className="legend-dot confirmed-dot"></span>
                    <span>Confirmed / Registered</span>
                    <strong>{confirmedCount}</strong>
                  </div>

                  <div>
                    <span className="legend-dot pending-dot"></span>
                    <span>Pending</span>
                    <strong>{pendingCount}</strong>
                  </div>

                  <div>
                    <span className="legend-dot available-dot"></span>
                    <span>Available Spots</span>
                    <strong>{remainingSpots}</strong>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* REGISTRATIONS PAGE */}
        {activePage === "registrations" && (
          <div className="registrations-page">
            <div className="dashboard-header">
              <div>
                <p className="dashboard-breadcrumb">REGISTRATIONS / PARTICIPANTS</p>
                <h1>Registrations</h1>
                <p>Manage and monitor all event registrations in real time.</p>
              </div>

              <div className="header-actions">
                <button
                  className="secondary-button"
                  onClick={handleTriggerImportCSV}
                  disabled={isImporting}
                  title="Import guests from a CSV file"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>{isImporting ? "⌛" : "↑"}</span>
                  {isImporting ? "Importing..." : "Import CSV"}
                </button>
                <button className="secondary-button" onClick={handleExportCSV}>
                  ↓ Export CSV
                </button>
                <button className="primary-button" onClick={() => setIsAddModalOpen(true)}>
                  + Add Participant
                </button>
              </div>
            </div>

            {/* STATS */}
            <section className="registration-stats">
              <div className="registration-stat-card">
                <div className="registration-stat-icon purple">◉</div>
                <div>
                  <span>Total Registrations</span>
                  <strong>{totalCount}</strong>
                </div>
              </div>

              <div className="registration-stat-card">
                <div className="registration-stat-icon green">✓</div>
                <div>
                  <span>Confirmed</span>
                  <strong>{confirmedCount}</strong>
                </div>
              </div>

              <div className="registration-stat-card">
                <div className="registration-stat-icon orange">◷</div>
                <div>
                  <span>Pending</span>
                  <strong>{pendingCount}</strong>
                </div>
              </div>

              <div className="registration-stat-card">
                <div className="registration-stat-icon blue">₹</div>
                <div>
                  <span>Revenue</span>
                  <strong>₹{revenue.toLocaleString()}</strong>
                </div>
              </div>
            </section>

            {/* FULL REGISTRATION TABLE */}
            <div className="dashboard-card full-registration-card">
              <div className="registration-page-toolbar">
                <div>
                  <p>PARTICIPANT LIST</p>
                  <h2>All Registrations ({filteredRegistrations.length})</h2>
                </div>

                <div className="registration-tools">
                  <div className="registration-search">
                    <span>⌕</span>
                    <input
                      type="text"
                      placeholder="Search participants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="registration-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Registered">Registered</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="full-registration-table">
                <div className="full-table-header">
                  <span>Participant</span>
                  <span>Email</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                {isLoading ? (
                  <div className="table-empty-notice">Loading participants from database...</div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="table-empty-notice">
                    {registrations.length === 0
                      ? "No registrations found in database."
                      : "No participants match your search criteria."}
                  </div>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <div className="full-table-row" key={reg._id || reg.email}>
                      <div className="full-participant">
                        <div className="participant-avatar">
                          {(reg.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{reg.name}</strong>
                          <small>{reg.college || "General"}</small>
                        </div>
                      </div>

                      <span>{reg.email}</span>

                      <span>
                        {reg.createdAt
                          ? new Date(reg.createdAt).toLocaleDateString()
                          : "03 Oct 2026"}
                      </span>

                      <span>₹99</span>

                      <span className={getStatusClass(reg.status)}>
                        {reg.status || "Registered"}
                      </span>

                      <div className="table-actions">
                        <button
                          title="View Details"
                          onClick={() => setViewingParticipant(reg)}
                        >
                          👁
                        </button>
                        <button
                          title="Change Status"
                          onClick={() => setEditingParticipant(reg)}
                        >
                          ✎
                        </button>
                        <button
                          title="Delete Registration"
                          onClick={() => handleDelete(reg._id, reg.name)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="registration-pagination">
                <span>
                  Showing <strong>{filteredRegistrations.length}</strong> of{" "}
                  <strong>{totalCount}</strong> registrations
                </span>
              </div>
            </div>
          </div>
        )}

        {/* OTHER SUB-PAGES */}
        {activePage === "participants" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">PARTICIPANTS</p>
              <h1>Participants Directory</h1>
              <p>Browse by college and department.</p>
              <div style={{ marginTop: "24px" }}>
                <button className="primary-button" onClick={() => setActivePage("registrations")}>
                  Go to Registrations Table
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === "event" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">EVENT MANAGEMENT</p>
              <h1>Event Details</h1>
              <p>MAKKA DESIGN PAKKA • 03 October 2026 • Nagercoil</p>
            </div>
          </div>
        )}

        {activePage === "reports" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">REPORTS</p>
              <h1>Analytics & Export</h1>
              <div style={{ marginTop: "20px" }}>
                <button className="primary-button" onClick={handleExportCSV}>
                  ↓ Download Full CSV Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === "settings" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">SETTINGS</p>
              <h1>Event Configuration</h1>
              <p>Configure ticket price (₹99), registration capacity (150), and API endpoints.</p>
            </div>
          </div>
        )}
      </section>

      {/* ADD PARTICIPANT MODAL */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add New Participant</h3>
              <button className="admin-modal-close" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="admin-form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  placeholder="e.g. Aditi Sharma"
                />
              </div>

              <div className="admin-form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  placeholder="e.g. aditi@example.com"
                />
              </div>

              <div className="admin-form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div className="admin-form-group">
                <label>College / Institute *</label>
                <input
                  type="text"
                  required
                  value={addFormData.college}
                  onChange={(e) => setAddFormData({ ...addFormData, college: e.target.value })}
                  placeholder="e.g. National Institute of Design"
                />
              </div>

              <div className="admin-form-group">
                <label>Department / Stream *</label>
                <input
                  type="text"
                  required
                  value={addFormData.department}
                  onChange={(e) => setAddFormData({ ...addFormData, department: e.target.value })}
                  placeholder="e.g. Visual Communication"
                />
              </div>

              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value })}
                >
                  <option value="Registered">Registered</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Participant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PARTICIPANT DETAILS MODAL */}
      {viewingParticipant && (
        <div className="admin-modal-backdrop" onClick={() => setViewingParticipant(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Participant Details</h3>
              <button className="admin-modal-close" onClick={() => setViewingParticipant(null)}>
                ✕
              </button>
            </div>

            <div className="admin-detail-list">
              <div className="admin-detail-item">
                <span>Name:</span>
                <strong>{viewingParticipant.name}</strong>
              </div>
              <div className="admin-detail-item">
                <span>Email:</span>
                <strong>{viewingParticipant.email}</strong>
              </div>
              <div className="admin-detail-item">
                <span>Phone:</span>
                <strong>{viewingParticipant.phone}</strong>
              </div>
              <div className="admin-detail-item">
                <span>College:</span>
                <strong>{viewingParticipant.college}</strong>
              </div>
              <div className="admin-detail-item">
                <span>Department:</span>
                <strong>{viewingParticipant.department}</strong>
              </div>
              <div className="admin-detail-item">
                <span>Status:</span>
                <span className={getStatusClass(viewingParticipant.status)}>
                  {viewingParticipant.status || "Registered"}
                </span>
              </div>
              <div className="admin-detail-item">
                <span>Registered At:</span>
                <strong>
                  {viewingParticipant.createdAt
                    ? new Date(viewingParticipant.createdAt).toLocaleString()
                    : "N/A"}
                </strong>
              </div>
            </div>

            <div className="admin-form-actions">
              <button className="primary-button" onClick={() => setViewingParticipant(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STATUS MODAL */}
      {editingParticipant && (
        <div className="admin-modal-backdrop" onClick={() => setEditingParticipant(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Update Participant Status</h3>
              <button className="admin-modal-close" onClick={() => setEditingParticipant(null)}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "16px" }}>
              Update registration status for <strong>{editingParticipant.name}</strong>:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                className="secondary-button"
                style={{ background: "#e8f8f0", borderColor: "#159b66", color: "#159b66" }}
                onClick={() => handleStatusUpdate(editingParticipant._id, "Confirmed")}
              >
                ✓ Confirmed
              </button>

              <button
                className="secondary-button"
                style={{ background: "#ede9fe", borderColor: "#6d28d9", color: "#6d28d9" }}
                onClick={() => handleStatusUpdate(editingParticipant._id, "Registered")}
              >
                ◉ Registered
              </button>

              <button
                className="secondary-button"
                style={{ background: "#fff3df", borderColor: "#d78a1b", color: "#d78a1b" }}
                onClick={() => handleStatusUpdate(editingParticipant._id, "Pending")}
              >
                ◷ Pending
              </button>

              <button
                className="secondary-button"
                style={{ background: "#fee2e2", borderColor: "#dc2626", color: "#dc2626" }}
                onClick={() => handleStatusUpdate(editingParticipant._id, "Cancelled")}
              >
                ✕ Cancelled
              </button>
            </div>

            <div className="admin-form-actions">
              <button className="secondary-button" onClick={() => setEditingParticipant(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Admin;