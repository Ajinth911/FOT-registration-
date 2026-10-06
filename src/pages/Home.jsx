import Header from "../components/Header";
import Hero from "../components/Hero";
import EventInfo from "../components/EventInfo";
import "./Home.css";
import AboutEvent from "../components/AboutEvent";
import ContactInfo from "../components/ContactInfo";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <EventInfo />
        <AboutEvent/>
        <ContactInfo/>
      </main>
      <Footer/>
    </>
  );
}

export default Home;