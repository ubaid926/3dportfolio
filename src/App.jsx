import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import StickyCanvas from './components/StickyCanvas';
import KeyFacts from './components/KeyFacts';
import WorkCards from './components/WorkCards';
import ClientStories from './components/ClientStories';
import DesignMotionSection from './components/DesignMotionSection';
import Footer from './components/Footer';

import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

import './App.css';

/* ── Auto Scroll to Top on Route Change ── */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ── Main Full-Experience Homepage ── */
function HomePage() {
  return (
    <>
      <StickyCanvas />
      <KeyFacts />
      <WorkCards />
      <ClientStories />
      <DesignMotionSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
