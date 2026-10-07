import { useState } from "react";

function Admin() {
  const [activePage, setActivePage] = useState("dashboard");

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
            className={`sidebar-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`sidebar-item ${
              activePage === "registrations" ? "active" : ""
            }`}
            onClick={() => setActivePage("registrations")}
          >
            <span>◉</span>
            Registrations
          </button>

          <button
            className={`sidebar-item ${
              activePage === "participants" ? "active" : ""
            }`}
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
            className={`sidebar-item ${
              activePage === "event" ? "active" : ""
            }`}
            onClick={() => setActivePage("event")}
          >
            <span>◷</span>
            Event Details
          </button>

          <button
            className={`sidebar-item ${
              activePage === "reports" ? "active" : ""
            }`}
            onClick={() => setActivePage("reports")}
          >
            <span>▤</span>
            Reports
          </button>

          <button
            className={`sidebar-item ${
              activePage === "settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("settings")}
          >
            <span>⚙</span>
            Settings
          </button>
        </div>

        {/* ADMIN PROFILE */}
        <div className="sidebar-bottom">
          <div className="admin-profile">

            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Event Manager</span>
            </div>

            <span className="profile-more">
              •••
            </span>

          </div>
        </div>

      </aside>


      {/* MAIN AREA */}
      <section className="admin-content">

        {/* TOP BAR */}
        <header className="admin-topbar">

          <button className="menu-button">
            ☰
          </button>

          <div className="admin-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search registrations, participants..."
            />
          </div>

          <div className="topbar-actions">

            <button className="topbar-icon">
              ♧
            </button>

            <button className="topbar-icon notification">
              ♢
              <span></span>
            </button>

            <div className="topbar-user">

              <div className="topbar-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <small>Event Manager</small>
              </div>

              <span>⌄</span>

            </div>

          </div>

        </header>


        {/* DASHBOARD CONTENT */}
        {activePage === "dashboard" && (

          <>

            {/* PAGE HEADER */}
            <div className="dashboard-header">

              <div>

                <p className="dashboard-breadcrumb">
                  DASHBOARD / EVENT MANAGEMENT
                </p>

                <h1>
                  Welcome back, Admin
                </h1>

                <p>
                  Here's what's happening with your event today.
                </p>

              </div>

              <div className="header-actions">

                <button className="secondary-button">
                  ↓ Export
                </button>

                <button className="primary-button">
                  + Add Participant
                </button>

              </div>

            </div>


            {/* STAT CARDS */}
            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-card-top">

                  <div className="stat-icon purple">
                    ◉
                  </div>

                  <span className="stat-growth">
                    +12.5%
                  </span>

                </div>

                <span className="stat-label">
                  Total Registrations
                </span>

                <h2>
                  128
                </h2>

                <p>
                  Compared to last week
                </p>

              </div>


              <div className="stat-card">

                <div className="stat-card-top">

                  <div className="stat-icon green">
                    ✓
                  </div>

                  <span className="stat-growth">
                    +8.2%
                  </span>

                </div>

                <span className="stat-label">
                  Confirmed
                </span>

                <h2>
                  96
                </h2>

                <p>
                  75% of total registrations
                </p>

              </div>


              <div className="stat-card">

                <div className="stat-card-top">

                  <div className="stat-icon orange">
                    ◷
                  </div>

                  <span className="stat-growth">
                    25%
                  </span>

                </div>

                <span className="stat-label">
                  Pending
                </span>

                <h2>
                  32
                </h2>

                <p>
                  Awaiting confirmation
                </p>

              </div>


              <div className="stat-card">

                <div className="stat-card-top">

                  <div className="stat-icon blue">
                    ₹
                  </div>

                  <span className="stat-growth">
                    +15.4%
                  </span>

                </div>

                <span className="stat-label">
                  Revenue
                </span>

                <h2>
                  ₹9,504
                </h2>

                <p>
                  From registration fees
                </p>

              </div>

            </section>


            {/* CHART + EVENT */}
            <section className="dashboard-grid">

              {/* CHART */}
              <div className="dashboard-card chart-card">

                <div className="card-header">

                  <div>

                    <p>
                      REGISTRATION ANALYTICS
                    </p>

                    <h2>
                      Registration Overview
                    </h2>

                  </div>

                  <select>

                    <option>
                      Last 7 days
                    </option>

                    <option>
                      Last 30 days
                    </option>

                    <option>
                      Last 3 months
                    </option>

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

                      <div
                        className="bar"
                        style={{ height: "42%" }}
                      >
                        <span>Mon</span>
                      </div>

                      <div
                        className="bar"
                        style={{ height: "58%" }}
                      >
                        <span>Tue</span>
                      </div>

                      <div
                        className="bar"
                        style={{ height: "48%" }}
                      >
                        <span>Wed</span>
                      </div>

                      <div
                        className="bar"
                        style={{ height: "70%" }}
                      >
                        <span>Thu</span>
                      </div>

                      <div
                        className="bar"
                        style={{ height: "62%" }}
                      >
                        <span>Fri</span>
                      </div>

                      <div
                        className="bar"
                        style={{ height: "84%" }}
                      >
                        <span>Sat</span>
                      </div>

                      <div
                        className="bar"
                        style={{ height: "92%" }}
                      >
                        <span>Sun</span>
                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* EVENT OVERVIEW */}
              <div className="dashboard-card event-card">

                <div className="card-header">

                  <div>

                    <p>
                      YOUR EVENT
                    </p>

                    <h2>
                      Event Overview
                    </h2>

                  </div>

                  <button className="more-button">
                    •••
                  </button>

                </div>


                <div className="event-title-box">

                  <div className="event-logo">
                    M9
                  </div>

                  <div>

                    <h3>
                      Makka Design Pakka
                    </h3>

                    <span>
                      MARK9 • Nagercoil
                    </span>

                  </div>

                </div>


                <div className="event-info">

                  <div>

                    <span>
                      DATE
                    </span>

                    <strong>
                      03 Oct 2026
                    </strong>

                  </div>

                  <div>

                    <span>
                      TIME
                    </span>

                    <strong>
                      10:00 AM
                    </strong>

                  </div>

                  <div>

                    <span>
                      FEE
                    </span>

                    <strong>
                      ₹99
                    </strong>

                  </div>

                </div>


                <div className="capacity-section">

                  <div className="capacity-header">

                    <span>
                      Registration Capacity
                    </span>

                    <strong>
                      128 / 150
                    </strong>

                  </div>

                  <div className="capacity-bar">

                    <div></div>

                  </div>

                  <small>
                    22 spots remaining
                  </small>

                </div>


                <button className="event-button">
                  Manage Event →
                </button>

              </div>

            </section>


            {/* BOTTOM SECTION */}
            <section className="bottom-grid">

              {/* RECENT REGISTRATIONS */}
              <div className="dashboard-card registrations-card">

                <div className="card-header">

                  <div>

                    <p>
                      PARTICIPANTS
                    </p>

                    <h2>
                      Recent Registrations
                    </h2>

                  </div>

                  <button className="view-all">
                    View All →
                  </button>

                </div>


                <div className="registration-table">

                  <div className="table-header">

                    <span>
                      Participant
                    </span>

                    <span>
                      Email
                    </span>

                    <span>
                      Status
                    </span>

                    <span>
                      Date
                    </span>

                  </div>


                  <div className="table-row">

                    <div className="participant-info">

                      <div className="participant-avatar">
                        R
                      </div>

                      <div>

                        <strong>
                          Rahul Kumar
                        </strong>

                        <small>
                          Participant
                        </small>

                      </div>

                    </div>

                    <span>
                      rahul@example.com
                    </span>

                    <span className="status confirmed">
                      Confirmed
                    </span>

                    <span>
                      06 Oct 2026
                    </span>

                  </div>


                  <div className="table-row">

                    <div className="participant-info">

                      <div className="participant-avatar">
                        S
                      </div>

                      <div>

                        <strong>
                          Sarah John
                        </strong>

                        <small>
                          Participant
                        </small>

                      </div>

                    </div>

                    <span>
                      sarah@example.com
                    </span>

                    <span className="status confirmed">
                      Confirmed
                    </span>

                    <span>
                      06 Oct 2026
                    </span>

                  </div>


                  <div className="table-row">

                    <div className="participant-info">

                      <div className="participant-avatar">
                        K
                      </div>

                      <div>

                        <strong>
                          Karthik M
                        </strong>

                        <small>
                          Participant
                        </small>

                      </div>

                    </div>

                    <span>
                      karthik@example.com
                    </span>

                    <span className="status pending">
                      Pending
                    </span>

                    <span>
                      05 Oct 2026
                    </span>

                  </div>


                  <div className="table-row">

                    <div className="participant-info">

                      <div className="participant-avatar">
                        A
                      </div>

                      <div>

                        <strong>
                          Ananya R
                        </strong>

                        <small>
                          Participant
                        </small>

                      </div>

                    </div>

                    <span>
                      ananya@example.com
                    </span>

                    <span className="status confirmed">
                      Confirmed
                    </span>

                    <span>
                      05 Oct 2026
                    </span>

                  </div>

                </div>

              </div>


              {/* REGISTRATION STATUS */}
              <div className="dashboard-card status-card">

                <div className="card-header">

                  <div>

                    <p>
                      REGISTRATION STATUS
                    </p>

                    <h2>
                      Overview
                    </h2>

                  </div>

                </div>


                <div className="status-circle">

                  <div>

                    <strong>
                      75%
                    </strong>

                    <span>
                      Confirmed
                    </span>

                  </div>

                </div>


                <div className="status-legend">

                  <div>

                    <span className="legend-dot confirmed-dot"></span>

                    <span>
                      Confirmed
                    </span>

                    <strong>
                      96
                    </strong>

                  </div>

                  <div>

                    <span className="legend-dot pending-dot"></span>

                    <span>
                      Pending
                    </span>

                    <strong>
                      32
                    </strong>

                  </div>

                  <div>

                    <span className="legend-dot available-dot"></span>

                    <span>
                      Available
                    </span>

                    <strong>
                      22
                    </strong>

                  </div>

                </div>

              </div>

            </section>

          </>

        )}


        {/* OTHER PAGES - TEMPORARY */}
        {activePage === "registrations" && (
  <div className="registrations-page">

    {/* PAGE HEADER */}
    <div className="dashboard-header">

      <div>
        <p className="dashboard-breadcrumb">
          REGISTRATIONS / PARTICIPANTS
        </p>

        <h1>Registrations</h1>

        <p>
          Manage and monitor all event registrations.
        </p>
      </div>

      <div className="header-actions">

        <button className="secondary-button">
          ↓ Export
        </button>

        <button className="primary-button">
          + Add Participant
        </button>

      </div>

    </div>


    {/* REGISTRATION STATS */}
    <section className="registration-stats">

      <div className="registration-stat-card">

        <div className="registration-stat-icon purple">
          ◉
        </div>

        <div>
          <span>Total Registrations</span>
          <strong>128</strong>
        </div>

      </div>


      <div className="registration-stat-card">

        <div className="registration-stat-icon green">
          ✓
        </div>

        <div>
          <span>Confirmed</span>
          <strong>96</strong>
        </div>

      </div>


      <div className="registration-stat-card">

        <div className="registration-stat-icon orange">
          ◷
        </div>

        <div>
          <span>Pending</span>
          <strong>32</strong>
        </div>

      </div>


      <div className="registration-stat-card">

        <div className="registration-stat-icon blue">
          ₹
        </div>

        <div>
          <span>Revenue</span>
          <strong>₹9,504</strong>
        </div>

      </div>

    </section>


    {/* REGISTRATION TABLE */}
    <div className="dashboard-card full-registration-card">

      {/* TABLE HEADER */}
      <div className="registration-page-toolbar">

        <div>

          <p>
            PARTICIPANT LIST
          </p>

          <h2>
            All Registrations
          </h2>

        </div>


        <div className="registration-tools">

          <div className="registration-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search participants..."
            />

          </div>


          <select className="registration-filter">

            <option>
              All Status
            </option>

            <option>
              Confirmed
            </option>

            <option>
              Pending
            </option>

          </select>

        </div>

      </div>


      {/* TABLE */}
      <div className="full-registration-table">

        {/* HEADER */}
        <div className="full-table-header">

          <span>Participant</span>

          <span>Email</span>

          <span>Registration Date</span>

          <span>Amount</span>

          <span>Status</span>

          <span>Action</span>

        </div>


        {/* ROW 1 */}
        <div className="full-table-row">

          <div className="full-participant">

            <div className="participant-avatar">
              R
            </div>

            <div>
              <strong>Rahul Kumar</strong>
              <small>Participant #001</small>
            </div>

          </div>

          <span>
            rahul@example.com
          </span>

          <span>
            06 Oct 2026
          </span>

          <span>
            ₹99
          </span>

          <span className="status confirmed">
            Confirmed
          </span>

          <div className="table-actions">

            <button title="View">
              👁
            </button>

            <button title="Edit">
              ✎
            </button>

            <button title="Delete">
              🗑
            </button>

          </div>

        </div>


        {/* ROW 2 */}
        <div className="full-table-row">

          <div className="full-participant">

            <div className="participant-avatar">
              S
            </div>

            <div>
              <strong>Sarah John</strong>
              <small>Participant #002</small>
            </div>

          </div>

          <span>
            sarah@example.com
          </span>

          <span>
            06 Oct 2026
          </span>

          <span>
            ₹99
          </span>

          <span className="status confirmed">
            Confirmed
          </span>

          <div className="table-actions">

            <button title="View">
              👁
            </button>

            <button title="Edit">
              ✎
            </button>

            <button title="Delete">
              🗑
            </button>

          </div>

        </div>


        {/* ROW 3 */}
        <div className="full-table-row">

          <div className="full-participant">

            <div className="participant-avatar">
              K
            </div>

            <div>
              <strong>Karthik M</strong>
              <small>Participant #003</small>
            </div>

          </div>

          <span>
            karthik@example.com
          </span>

          <span>
            05 Oct 2026
          </span>

          <span>
            ₹99
          </span>

          <span className="status pending">
            Pending
          </span>

          <div className="table-actions">

            <button title="View">
              👁
            </button>

            <button title="Edit">
              ✎
            </button>

            <button title="Delete">
              🗑
            </button>

          </div>

        </div>


        {/* ROW 4 */}
        <div className="full-table-row">

          <div className="full-participant">

            <div className="participant-avatar">
              A
            </div>

            <div>
              <strong>Ananya R</strong>
              <small>Participant #004</small>
            </div>

          </div>

          <span>
            ananya@example.com
          </span>

          <span>
            05 Oct 2026
          </span>

          <span>
            ₹99
          </span>

          <span className="status confirmed">
            Confirmed
          </span>

          <div className="table-actions">

            <button title="View">
              👁
            </button>

            <button title="Edit">
              ✎
            </button>

            <button title="Delete">
              🗑
            </button>

          </div>

        </div>


        {/* ROW 5 */}
        <div className="full-table-row">

          <div className="full-participant">

            <div className="participant-avatar">
              P
            </div>

            <div>
              <strong>Priya S</strong>
              <small>Participant #005</small>
            </div>

          </div>

          <span>
            priya@example.com
          </span>

          <span>
            04 Oct 2026
          </span>

          <span>
            ₹99
          </span>

          <span className="status pending">
            Pending
          </span>

          <div className="table-actions">

            <button title="View">
              👁
            </button>

            <button title="Edit">
              ✎
            </button>

            <button title="Delete">
              🗑
            </button>

          </div>

        </div>

      </div>


      {/* PAGINATION */}
      <div className="registration-pagination">

        <span>
          Showing <strong>1–5</strong> of <strong>128</strong> registrations
        </span>

        <div>

          <button>
            ‹
          </button>

          <button className="pagination-active">
            1
          </button>

          <button>
            2
          </button>

          <button>
            3
          </button>

          <button>
            ...
          </button>

          <button>
            26
          </button>

          <button>
            ›
          </button>

        </div>

      </div>

    </div>

  </div>
)}

        {activePage === "participants" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">
                PARTICIPANTS
              </p>
              <h1>Participants</h1>
              <p>
                Participant management will be added here.
              </p>
            </div>
          </div>
        )}

        {activePage === "event" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">
                EVENT MANAGEMENT
              </p>
              <h1>Event Details</h1>
              <p>
                Event management will be added here.
              </p>
            </div>
          </div>
        )}

        {activePage === "reports" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">
                EVENT MANAGEMENT
              </p>
              <h1>Reports</h1>
              <p>
                Event reports will be added here.
              </p>
            </div>
          </div>
        )}

        {activePage === "settings" && (
          <div className="dashboard-header">
            <div>
              <p className="dashboard-breadcrumb">
                EVENT MANAGEMENT
              </p>
              <h1>Settings</h1>
              <p>
                Admin settings will be added here.
              </p>
            </div>
          </div>
        )}

      </section>

    </main>
  );
}

export default Admin;