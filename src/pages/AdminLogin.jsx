import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin123") {
      alert("Login successful!");

      window.location.href = "/admin-dashboard";
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1>Admin Login</h1>

        <p>Login to manage the event</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        <button
          className="back-home-btn"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;