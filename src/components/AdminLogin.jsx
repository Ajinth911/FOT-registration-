import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message ||
          (res.status >= 500
            ? "Cannot connect to backend server. Please verify backend is running on port 5000."
            : "Invalid credentials.")
        );
      }

      // Save token in localStorage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      if (onLoginSuccess) {
        onLoginSuccess(data.token, data.user);
      }
    } catch (err) {
      setError(err.message || "Failed to authenticate. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="login-logo-box">
          <div className="login-logo-badge">M9</div>
          <h2>MARK9</h2>
          <span>EVENT ADMIN PORTAL</span>
        </div>

        <div className="login-lock-badge">
          <span>🔒 Authorized Personnel Only</span>
        </div>

        <p className="login-description">
          Enter your administrative credentials to manage registrations, view participant data, and export reports.
        </p>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="admin-username">Admin Username</label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Admin Panel →"}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="back-to-site-link">
            ← Back to Public Event Site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
