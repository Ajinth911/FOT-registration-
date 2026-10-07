import "./App.css";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const path = window.location.pathname;

  if (path === "/admin-login") {
    return <AdminLogin />;
  }

  if (path === "/admin") {
    return <Admin />;
  }

  return <Home />;
}

export default App;