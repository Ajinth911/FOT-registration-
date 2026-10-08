import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LumaEvent from "./pages/LumaEvent";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./components/AdminLogin";

function ProtectedAdmin() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Admin />;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/luma" element={<LumaEvent />} />
        <Route path="/fk3rbn8c" element={<LumaEvent />} />
        <Route path="/event" element={<LumaEvent />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;