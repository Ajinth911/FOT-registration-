import Header from "./components/Header";
import Hero from "./components/Hero";
import "./App.css";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const path=window.location.pathname;
  if(path=="/admin-login"){
    return <AdminLogin/>;
  }
  return (
    <>

      <Home/>
    </>
  );

}

export default App;