import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpeg';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Stories', to: '/', hash: '#stories' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleNavClick = (item) => {
    setMenuOpen(false);
    if (item.hash) {
      if (location.pathname === '/') {
        const el = document.querySelector(item.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(item.hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      navigate(item.to);
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <motion.header
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--drawer-open' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="navbar__container">
          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Nexora Studio Home">
            <img src={logoImg} alt="Nexora Studio" className="navbar__logo-img" />
            <span className="navbar__logo-text">NEXORA <span>STUDIO</span><sup>®</sup></span>
          </Link>

          {/* Top Right Action Controls */}
          <div className="navbar__actions">
            {/* Audio Mute/Unmute Toggle */}
            <motion.button
              className={`navbar__icon-btn ${!isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Toggle audio"
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </motion.button>

            {/* Let's Talk CTA Pill */}
            <Link to="/contact" className="navbar__cta-pill">
              START A PROJECT
            </Link>

            {/* Menu Toggle Button */}
            <motion.button
              className={`navbar__menu-pill ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Toggle navigation menu"
            >
              <span>MENU</span>
              <span className="navbar__menu-symbol">
                {menuOpen ? '✕' : '☰'}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Right Side Drawer Panel & Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              className="navbar__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Right Side Drawer */}
            <motion.aside
              className="navbar__drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="navbar__drawer-inner">
                {/* Main Links */}
                <div className="navbar__drawer-main">
                  <nav className="navbar__drawer-nav">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        className="navbar__drawer-link"
                        style={{ textAlign: 'left', width: '100%', background: 'none', border: 'none', padding: 0 }}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + index * 0.07, duration: 0.4 }}
                        onClick={() => handleNavClick(item)}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </nav>

                  {/* Story Badge Button */}
                  <Link
                    to="/about"
                    className="navbar__story-badge"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="navbar__story-sparkle">✦</span> THE NEXORA STUDIO STORY
                  </Link>
                </div>

                {/* Drawer Footer Details */}
                <div className="navbar__drawer-footer">
                  {/* Business Enquiry */}
                  <div className="navbar__footer-block">
                    <div className="navbar__footer-heading">STUDIO ENQUIRY</div>
                    <div className="navbar__footer-content">
                      <p><span className="navbar__prefix">E.</span> <a href="mailto:hello@nexora.studio">hello@nexora.studio</a></p>
                      <p><span className="navbar__prefix">P.</span> <a href="tel:+14158209900">+1 (415) 820-9900</a></p>
                    </div>
                  </div>

                  {/* Social Links Grid */}
                  <div className="navbar__footer-block">
                    <div className="navbar__footer-heading">SOCIAL</div>
                    <div className="navbar__social-grid">
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Linkedin</a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                      <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">Dribbble</a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
