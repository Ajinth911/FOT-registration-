import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LumaEvent from "./pages/LumaEvent";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/luma" element={<LumaEvent />} />
        <Route path="/fk3rbn8c" element={<LumaEvent />} />
        <Route path="/event" element={<LumaEvent />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;