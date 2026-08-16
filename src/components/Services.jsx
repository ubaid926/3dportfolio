import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoneCanvas from './StoneCanvas';
import LightningStorm from './LightningStorm';
import './Services.css';

/* ─────────────────────────────────────────────── */
/*  EXPANDED SERVICES DATA (8 DISTINCT DISCIPLINES)*/
/* ─────────────────────────────────────────────── */
export const SERVICES_DATA = [
  // ── LEFT COLUMN SERVICES ──
  {
    id: 'ai',
    side: 'left',
    title: 'AI & Intelligent Automation',
    category: 'INTELLIGENT AUTOMATION',
    tagline: 'Supercharge workflows with autonomous intelligence and digital workers.',
    description:
      'AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.',
    icon: 'bars',
    deliverables: [
      'Autonomous AI Digital Workers',
      'LLM Fine-Tuning & Custom Agents',
      'Workflow Automation Pipelines',
      'Predictive Analytics & Smart Models',
      'Neural Canvas & Generative Interfaces',
    ],
  },
  {
    id: 'development',
    side: 'left',
    title: 'Custom Web & Software Development',
    category: 'CREATIVE TECH & CODE',
    tagline: 'Transforming visionary concepts into ultra-performant code.',
    description:
      'Scalable web applications, clean code architecture, and high-performance digital solutions engineered for scale.',
    icon: 'radar',
    deliverables: [
      'Full-Stack Cloud Architecture & APIs',
      'Next.js / React Enterprise Frontends',
      'Performance Optimization & Core Vitals',
      'Interactive Micro-Animations & State Systems',
      'Resilient Security & Infrastructure Hardening',
    ],
  },
  {
    id: 'spatial',
    side: 'left',
    title: 'Creative Tech & Spatial 3D',
    category: 'WEBGL & 3D EXPERIENCES',
    tagline: 'Immersive, interactive 3D worlds that captivate audiences.',
    description:
      'Cutting-edge WebGL graphics, custom shader pipelines, and spatial canvas experiences that set brands apart.',
    icon: 'prism',
    deliverables: [
      'Three.js & WebGL Interactive 3D',
      'Custom GLSL Shader Engineering',
      'Spatial Web & 3D Product Configurator',
      'Physics Simulation & Particle Systems',
      'WebXR & Immersive Web Environments',
    ],
  },
  {
    id: 'cloud',
    side: 'left',
    title: 'Autonomous Cloud Architecture',
    category: 'INFRASTRUCTURE & DEVOPS',
    tagline: 'Ultra-reliable distributed systems engineered for global scale.',
    description:
      'High-availability cloud pipelines, containerized microservices, and serverless compute clusters with zero downtime.',
    icon: 'nodes',
    deliverables: [
      'Kubernetes & Serverless Infrastructure',
      'Realtime Telemetry & Microservices',
      'Multi-Region Database Synchronization',
      'Edge Compute & CDN Optimization',
      'Automated CI/CD Delivery Pipelines',
    ],
  },

  // ── RIGHT COLUMN SERVICES ──
  {
    id: 'wordpress',
    side: 'right',
    title: 'WordPress Development',
    category: 'CMS ARCHITECTURE',
    tagline: 'High-speed, scalable CMS solutions built for enterprise reliability.',
    description:
      'WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.',
    icon: 'wave',
    deliverables: [
      'Custom Headless WordPress Architecture',
      'High-Conversion Enterprise CMS',
      'Tailored Gutenberg Blocks & Themes',
      'Speed Optimization & Security Hardening',
      'Seamless Third-Party API Integrations',
    ],
  },
  {
    id: 'design',
    side: 'right',
    title: 'Website & Mobile Design',
    category: 'PRODUCT & SPATIAL UI',
    tagline: 'Crafting digital products that feel intuitive, human, and unforgettable.',
    description:
      'High-quality website and app experiences designed to attract users and keep them coming back.',
    icon: 'arcs',
    deliverables: [
      'Product UI/UX & Interaction Design',
      'Spatial & 3D Web Interface Systems',
      'Multi-Platform Design Systems & Tokens',
      'User Journey Mapping & Wireframing',
      'Interactive Prototypes & Micro-Animations',
    ],
  },
  {
    id: 'branding',
    side: 'right',
    title: 'Brand Strategy & Visual Systems',
    category: 'STRATEGY & IDENTITY',
    tagline: 'Building bold, cohesive brand worlds that command attention.',
    description:
      'Dynamic brand identity systems, typography guidelines, and digital narratives built to stand the test of time.',
    icon: 'compass',
    deliverables: [
      'Brand Strategy & Positioning',
      'Visual Identity & Logo Systems',
      'Custom Typography & Color Palettes',
      'Motion Guidelines & Sound Identity',
      'Comprehensive Brand Design Systems',
    ],
  },
  {
    id: 'interaction',
    side: 'right',
    title: 'Product UI/UX & Interaction Design',
    category: 'HUMAN INTERACTION',
    tagline: 'Every micro-interaction engineered for delight and high conversion.',
    description:
      'Intuitive user flows, behavioral psychology design, and frictionless checkout and onboarding experiences.',
    icon: 'orbit',
    deliverables: [
      'Behavioral UX Research & Usability Testing',
      'Conversion Rate Optimization (CRO)',
      'Design Sprint Prototyping',
      'Design Token Libraries for Figma & Code',
      'Accessibility (WCAG 2.1 AAA) Compliance',
    ],
  },
];

/* ─────────────────────────────────────────────── */
/*  CUSTOM ICON PATTERNS (MATCHING REFERENCE)      */
/* ─────────────────────────────────────────────── */
const ServiceIcon = ({ type }) => {
  switch (type) {
    case 'bars':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <line x1="5" y1="4" x2="5" y2="38" />
          <line x1="10" y1="4" x2="10" y2="38" />
          <line x1="15" y1="4" x2="15" y2="38" />
          <line x1="20" y1="4" x2="20" y2="38" />
          <line x1="25" y1="4" x2="25" y2="38" />
          <line x1="30" y1="4" x2="30" y2="38" />
          <line x1="35" y1="4" x2="35" y2="38" />
          <line x1="40" y1="4" x2="40" y2="38" />
        </svg>
      );
    case 'radar':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <circle cx="21" cy="21" r="4" />
          <circle cx="21" cy="21" r="9" />
          <circle cx="21" cy="21" r="14" />
          <circle cx="21" cy="21" r="19" />
        </svg>
      );
    case 'prism':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <polygon points="21,4 38,15 38,27 21,38 4,27 4,15" />
          <line x1="21" y1="4" x2="21" y2="38" />
          <line x1="4" y1="15" x2="38" y2="27" />
          <line x1="38" y1="15" x2="4" y2="27" />
        </svg>
      );
    case 'nodes':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <circle cx="9" cy="12" r="4" />
          <circle cx="33" cy="12" r="4" />
          <circle cx="21" cy="30" r="4" />
          <line x1="12" y1="14" x2="18" y2="27" />
          <line x1="30" y1="14" x2="24" y2="27" />
          <line x1="13" y1="12" x2="29" y2="12" />
        </svg>
      );
    case 'wave':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <path d="M4 14C8 8 13 20 17 14C21 8 26 20 30 14C34 8 39 20 43 14" />
          <path d="M4 21C8 15 13 27 17 21C21 15 26 27 30 21C34 15 39 27 43 21" opacity="0.75" />
          <path d="M4 28C8 22 13 34 17 28C21 22 26 34 30 28C34 22 39 34 43 28" opacity="0.45" />
        </svg>
      );
    case 'arcs':
      return (
        <svg width="40" height="40" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <path d="M6 10C12 16 12 28 6 34" />
          <path d="M12 6C20 14 20 30 12 38" />
          <path d="M18 2C28 12 28 32 18 42" />
          <path d="M38 10C32 16 32 28 38 34" />
          <path d="M32 6C24 14 24 30 32 38" />
          <path d="M26 2C16 12 16 32 26 42" />
        </svg>
      );
    case 'compass':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <circle cx="21" cy="21" r="16" />
          <polygon points="21,9 25,21 21,33 17,21" fill="currentColor" fillOpacity="0.3" />
          <polygon points="9,21 21,25 33,21 21,17" fill="currentColor" fillOpacity="0.3" />
        </svg>
      );
    case 'orbit':
      return (
        <svg width="38" height="38" viewBox="0 0 42 42" fill="none" stroke="currentColor" strokeWidth="1.3" className="srv__card-icon">
          <ellipse cx="21" cy="21" rx="18" ry="7" transform="rotate(-30 21 21)" />
          <ellipse cx="21" cy="21" rx="18" ry="7" transform="rotate(30 21 21)" />
          <circle cx="21" cy="21" r="4" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

/* ─────────────────────────────────────────────── */
/*  SERVICE DETAIL MODAL                           */
/* ─────────────────────────────────────────────── */
export const ServiceDetailModal = ({ selectedService, setSelectedService, onClose }) => {
  if (!selectedService) return null;
  return (
    <AnimatePresence>
      <div className="srv__modal-backdrop" onClick={onClose}>
        <motion.div
          className="srv__modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="srv__modal-close" onClick={onClose} aria-label="Close modal">✕</button>
          <div className="srv__modal-layout">
            <div className="srv__modal-nav">
              <span className="srv__modal-nav-lbl">DISCIPLINES</span>
              <div className="srv__modal-nav-items">
                {SERVICES_DATA.map((srv) => (
                  <button
                    key={srv.id}
                    className={`srv__nav-item ${selectedService?.id === srv.id ? 'active' : ''}`}
                    onClick={() => setSelectedService(srv)}
                  >
                    <span className="srv__nav-item-title">{srv.title}</span>
                    <span className="srv__nav-item-cat">{srv.category}</span>
                  </button>
                ))}
              </div>
            </div>
            <motion.div
              key={selectedService.id}
              className="srv__modal-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="srv__content-header">
                <span className="srv__content-badge">{selectedService.category}</span>
                <h2 className="srv__content-title">{selectedService.title}</h2>
                <p className="srv__content-tagline">{selectedService.tagline}</p>
              </div>
              <p className="srv__content-desc">{selectedService.description}</p>
              <div className="srv__content-deliverables">
                <h4 className="srv__deliverables-lbl">CORE CAPABILITIES</h4>
                <div className="srv__deliverables-list">
                  {selectedService.deliverables?.map((item, idx) => (
                    <div key={idx} className="srv__deliverable-item">
                      <span className="srv__deliv-bullet">✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────── */
/*  SERVICES VIEW — White Phase → 3D Stone → Cards */
/*  progress: 0 (white) → 0.5 (stone) → 1 (cards)  */
/* ─────────────────────────────────────────────── */
export const ServicesView = ({ progress = 0, onOpenModal }) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const p = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── PHASE 1 & 2: Background crossfade from White → Dark Storm (p: 0.08 -> 0.45) ──
  const bgTransition = Math.min(Math.max((p - 0.08) / 0.37, 0), 1);
  const bgOpacity = bgTransition;
  const fogOpacity = bgTransition * 0.85;

  // Initial monumental typography fade-out (visible when white, fades out as storm arrives)
  const monumentalOpacity = Math.max(0, 1 - bgTransition * 1.6);

  // Smooth RGB interpolation for typography & eyebrows during white phase
  const rWord = Math.round(17 + (245 - 17) * bgTransition);
  const gWord = Math.round(24 + (245 - 24) * bgTransition);
  const bWord = Math.round(39 + (245 - 39) * bgTransition);
  const wordColor = `rgb(${rWord}, ${gWord}, ${bWord})`;

  const rEye = Math.round(75 + (200 - 75) * bgTransition);
  const gEye = Math.round(85 + (200 - 85) * bgTransition);
  const bEye = Math.round(99 + (210 - 99) * bgTransition);
  const eyebrowColor = `rgb(${rEye}, ${gEye}, ${bEye})`;

  const rTag = Math.round(55 + (200 - 55) * bgTransition);
  const gTag = Math.round(65 + (200 - 65) * bgTransition);
  const bTag = Math.round(81 + (210 - 81) * bgTransition);
  const tagColor = `rgb(${rTag}, ${gTag}, ${bTag})`;

  const rLnk = Math.round(17 + (240 - 17) * bgTransition);
  const gLnk = Math.round(24 + (240 - 24) * bgTransition);
  const bLnk = Math.round(39 + (245 - 39) * bgTransition);
  const viewLinkColor = `rgb(${rLnk}, ${gLnk}, ${bLnk})`;

  // ── PHASE 3: Cards Activate AFTER the 3D model settles (p: 0.48 -> 1.0) ──
  const cardsPhase = Math.max(0, Math.min(1, (p - 0.46) / 0.54));
  const cardsOpacity = Math.min(cardsPhase * 3.2, 1);
  const cardsScale = 0.94 + cardsOpacity * 0.06;

  // ── MOBILE: Scroll-driven card index & within-card progress ──
  // Each card occupies 1/N of the cardsPhase range
  const N = SERVICES_DATA.length;
  const cardSlot = cardsPhase * N;               // 0 → N (continuous)
  const activeIdx = Math.min(Math.floor(cardSlot), N - 1);
  // How far the current card has progressed into its slot (0 → 1)
  const cardProgress = cardSlot - Math.floor(cardSlot);

  // ── DESKTOP PARALLAX ──
  const leftTranslateY = (0.5 - cardsPhase) * 440;
  const leftSwayX = Math.sin(cardsPhase * Math.PI) * 12;
  const leftRotateZ = -1.2 + cardsPhase * 2.4;

  const rightTranslateY = (cardsPhase - 0.5) * 440;
  const rightSwayX = -Math.sin(cardsPhase * Math.PI) * 12;
  const rightRotateZ = 1.2 - cardsPhase * 2.4;

  const leftCards = SERVICES_DATA.filter((s) => s.side === 'left');
  const rightCards = SERVICES_DATA.filter((s) => s.side === 'right');

  return (
    <div id="services" className="srv__scene-wrap">
      {/* ── 1. Pristine White Base Layer ── */}
      <div className="srv__white-base" />

      {/* ── 2. Dark Storm Background ── */}
      <div className="srv__storm-video-wrap" style={{ opacity: bgOpacity }}>
        <LightningStorm progress={p} />
        <div className="srv__storm-overlay" />
      </div>
      <div className="srv__fog-overlay" style={{ opacity: fogOpacity }} />

      {/* ── 3. Central 3D Stone Canvas ── */}
      <StoneCanvas progress={p} />

      {/* ── 4. Content Layer ── */}
      <div className="srv__content-layer">

        {/* Top Header Bar */}
        <div className="srv__top-bar">
          <span className="srv__eyebrow" style={{ color: eyebrowColor }}>
            OUR SERVICES
          </span>
        </div>

        {/* ── INITIAL MONUMENTAL TYPOGRAPHY ── */}
        <div
          className="srv__center-sculpture"
          style={{
            opacity: monumentalOpacity,
            pointerEvents: monumentalOpacity > 0.15 ? 'all' : 'none',
            transform: `scale(${0.96 + monumentalOpacity * 0.04})`,
            display: monumentalOpacity > 0.01 ? 'flex' : 'none',
          }}
        >
          <div className="srv__typo-grid">
            {['A.I.', 'DESIGN', 'DEVELOPMENT', 'BRANDING'].map((word, idx) => (
              <div key={word} className="srv__typo-row">
                <button
                  className={`srv__word-btn ${hoveredWord === word ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredWord(word)}
                  onMouseLeave={() => setHoveredWord(null)}
                  onClick={() => onOpenModal?.(SERVICES_DATA[idx])}
                  aria-label={`Explore ${word} Services`}
                >
                  <span className="srv__word" style={{ color: wordColor }}>
                    {word}
                  </span>
                  <span className="srv__dot-indicator">•</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARDS STAGE ── */}
        {isMobile ? (
          /* ── MOBILE: Scroll-driven cards rising upward from below, one by one ── */
          <div
            className="srv__mobile-stage"
            style={{
              opacity: cardsOpacity,
              display: cardsOpacity > 0.01 ? 'flex' : 'none',
            }}
          >
            <div className="srv__mobile-cards-viewport">
              {SERVICES_DATA.map((svc, idx) => {
                // Continuous scroll offset: ranges from 0 to SERVICES_DATA.length - 1
                const targetScroll = cardsPhase * (SERVICES_DATA.length - 1);
                const offset = idx - targetScroll;

                // Only render cards within active view window
                if (Math.abs(offset) > 1.3) return null;

                // Animate upward from below:
                // offset > 0: Card is below, rising up into view
                // offset = 0: Card is active in center of viewport
                // offset < 0: Card is moving upward and exiting
                const translateY = offset * 115;
                const scale = 1 - Math.min(0.08, Math.abs(offset) * 0.08);
                const opacity = Math.max(0, 1 - Math.abs(offset) * 1.25);
                const rotateX = offset * -6;
                const isInteractive = Math.abs(offset) < 0.45;

                return (
                  <div
                    key={svc.id}
                    className="srv__mobile-scroll-card"
                    style={{
                      transform: `translate3d(0, ${translateY}%, 0) scale(${scale}) perspective(800px) rotateX(${rotateX}deg)`,
                      opacity,
                      zIndex: Math.round(20 - Math.abs(offset) * 10),
                      pointerEvents: isInteractive ? 'auto' : 'none',
                    }}
                    onClick={() => onOpenModal?.(svc)}
                  >
                    <div className="srv__mobile-card-top">
                      <div className="srv__mobile-badge-group">
                        <span className="srv__mobile-index">
                          {String(idx + 1).padStart(2, '0')} / {String(SERVICES_DATA.length).padStart(2, '0')}
                        </span>
                        <span className="srv__mobile-category">{svc.category}</span>
                      </div>
                      <div className="srv__mobile-icon-wrap">
                        <ServiceIcon type={svc.icon} />
                      </div>
                    </div>

                    <h3 className="srv__mobile-card-title">{svc.title}</h3>
                    <p className="srv__mobile-card-desc">{svc.description}</p>

                    <div className="srv__mobile-card-action">
                      <span>EXPLORE CAPABILITIES</span>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── DESKTOP: Bidirectional dual-column parallax ── */
          <div
            className="srv__cards-stage"
            style={{
              opacity: cardsOpacity,
              transform: `scale(${cardsScale})`,
              display: cardsOpacity > 0.01 ? 'flex' : 'none',
            }}
          >
            {/* LEFT COLUMN */}
            <div
              className="srv__column srv__column--left"
              style={{
                transform: `translate3d(${leftSwayX}px, ${leftTranslateY}px, 0) rotateZ(${leftRotateZ}deg)`,
              }}
            >
              {leftCards.map((svc, idx) => (
                <div
                  key={svc.id}
                  className="srv__card"
                  onClick={() => onOpenModal?.(svc)}
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <div className="srv__card-header">
                    <h3 className="srv__card-title">{svc.title}</h3>
                    <ServiceIcon type={svc.icon} />
                  </div>
                  <p className="srv__card-desc">{svc.description}</p>
                </div>
              ))}
            </div>

            {/* Central spacer */}
            <div className="srv__center-spacer" aria-hidden="true" />

            {/* RIGHT COLUMN */}
            <div
              className="srv__column srv__column--right"
              style={{
                transform: `translate3d(${rightSwayX}px, ${rightTranslateY}px, 0) rotateZ(${rightRotateZ}deg)`,
              }}
            >
              {rightCards.map((svc, idx) => (
                <div
                  key={svc.id}
                  className="srv__card"
                  onClick={() => onOpenModal?.(svc)}
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <div className="srv__card-header">
                    <h3 className="srv__card-title">{svc.title}</h3>
                    <ServiceIcon type={svc.icon} />
                  </div>
                  <p className="srv__card-desc">{svc.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="srv__bottom-bar">
          <div className="srv__tag-wrapper">
            <span className="srv__sparkle">✦</span>
            <span className="srv__tag-text" style={{ color: tagColor }}>
              DIFFERENT DISCIPLINES. ONE STANDARD OF CRAFT.
            </span>
          </div>

          <div className="srv__cta-wrapper">
            <button
              className="srv__view-link"
              style={{
                color: viewLinkColor,
                borderBottomColor: viewLinkColor,
              }}
              onClick={() => onOpenModal?.(SERVICES_DATA[0])}
            >
              <span>VIEW SERVICES</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};


/* ─────────────────────────────────────────────── */

/* ─────────────────────────────────────────────── */
/*  STANDALONE SERVICES WRAPPER                     */
/* ─────────────────────────────────────────────── */
const Services = () => {
  const containerRef = React.useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <section id="services-standalone" ref={containerRef} className="srv__standalone-section">
      <div className="srv__sticky-scene-full">
        <ServicesView
          progress={progress}
          onOpenModal={(svc) => {
            setSelectedService(svc || SERVICES_DATA[0]);
            setModalOpen(true);
          }}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <ServiceDetailModal
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
};

export default Services;
