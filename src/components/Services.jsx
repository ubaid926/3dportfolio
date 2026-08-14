import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import StoneCanvas from './StoneCanvas';
import './Services.css';

/* ─────────────────────────────────────────────── */
/*  DATA                                            */
/* ─────────────────────────────────────────────── */
export const SERVICES_DATA = [
  {
    id: 'ai',
    title: 'A.I.',
    category: 'INTELLIGENT AUTOMATION',
    tagline: 'Supercharge workflows with autonomous intelligence and digital workers.',
    description:
      'We architect state-of-the-art artificial intelligence platforms, custom LLM integrations, and autonomous digital workers that redefine how enterprise teams operate and scale.',
    deliverables: [
      'Autonomous AI Digital Workers',
      'LLM Fine-Tuning & Prompt Engineering',
      'Workflow Automation Pipelines',
      'Synthetic Media & Neural Canvas Tools',
      'Realtime Analytics & Predictive AI',
    ],
  },
  {
    id: 'design',
    title: 'DESIGN',
    category: 'PRODUCT & SPATIAL UI',
    tagline: 'Crafting digital products that feel intuitive, human, and unforgettable.',
    description:
      'Every pixel is intentional. We create immersive user interfaces, 3D spatial design systems, and seamless product architectures that captivate audiences and elevate brand prestige.',
    deliverables: [
      'Product UI/UX & Interaction Design',
      'Spatial & 3D Web Interface Design',
      'Multi-Platform Design Systems & Tokens',
      'Interactive Micro-Animations & Prototypes',
      'User Research & Information Architecture',
    ],
  },
  {
    id: 'development',
    title: 'DEVELOPMENT',
    category: 'CREATIVE TECH & WEBGL',
    tagline: 'Transforming visionary concepts into ultra-performant code.',
    description:
      'From photorealistic Three.js shaders to blazing-fast React and Next.js applications, we build resilient, scalable digital products engineered for modern browsers and devices.',
    deliverables: [
      'Three.js & WebGL Interactive 3D',
      'Next.js / React Enterprise Frontends',
      'Framer Motion & GSAP Animation Systems',
      'Full-Stack Cloud Architecture & APIs',
      'Performance & Web Vitals Optimization',
    ],
  },
  {
    id: 'branding',
    title: 'BRANDING',
    category: 'STRATEGY & IDENTITY',
    tagline: 'Building bold, cohesive brand worlds that command attention.',
    description:
      'We partner with ambitious founders to crystallize their core story, developing dynamic brand identity systems, typography guidelines, and digital narratives built to stand the test of time.',
    deliverables: [
      'Brand Strategy & Positioning',
      'Visual Identity & Logo Systems',
      'Custom Typography & Color Systems',
      'Motion Design & Sound Identity',
      'Comprehensive Brand Guidelines',
    ],
  },
];

/* ─────────────────────────────────────────────── */
/*  SERVICE DETAIL MODAL                            */
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
                <ul className="srv__deliverables-list">
                  {selectedService.deliverables.map((item, idx) => (
                    <li key={idx} className="srv__deliverable-item">
                      <span className="srv__check-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="srv__modal-cta" onClick={onClose}>
                <span>START A PROJECT WITH {selectedService.title}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────── */
/*  SERVICES CONTENT — light/white underlay preview */
/*  Used inside WorkCards curtain underlay only.    */
/*  Always white background, no stone, no dark bg.  */
/* ─────────────────────────────────────────────── */
export const ServicesContent = ({ onOpenModal }) => {
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <div className="srv__scene-inner">
      <div className="srv__bg-ambient" />

      {/* Top Label */}
      <div className="srv__top-bar">
        <span className="srv__eyebrow">OUR SERVICES</span>
      </div>

      {/* Monumental Typography */}
      <div className="srv__center-sculpture">
        <div className="srv__typo-grid">
          {SERVICES_DATA.map((svc) => (
            <div key={svc.id} className="srv__typo-row">
              <button
                className={`srv__word-btn ${hoveredService === svc.id ? 'active' : ''}`}
                onMouseEnter={() => setHoveredService(svc.id)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() => onOpenModal?.(svc)}
                aria-label={`Explore ${svc.title} Services`}
              >
                <span className="srv__word">{svc.title}</span>
                <span className="srv__dot-indicator">•</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="srv__bottom-bar">
        <div className="srv__tag-wrapper">
          <span className="srv__sparkle">✦</span>
          <span className="srv__tag-text">DIFFERENT DISCIPLINES. ONE STANDARD OF CRAFT.</span>
        </div>
        <div className="srv__cta-wrapper">
          <button className="srv__view-link" onClick={() => onOpenModal?.(SERVICES_DATA[0])}>
            <span>VIEW SERVICES</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────── */
/*  STANDALONE SERVICES — full scroll-driven scene  */
/*  Starts white → dark bg → stone → text reveal   */
/* ─────────────────────────────────────────────── */
const Services = () => {
  const containerRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 55, damping: 20 });

  React.useEffect(() => {
    return smoothProgress.on('change', (v) => setProgress(Math.max(0, Math.min(1, v))));
  }, [smoothProgress]);

  const openServiceModal = (service = null) => {
    setSelectedService(service || SERVICES_DATA[0]);
    setModalOpen(true);
  };

  // ── Scroll-phase calculations ──────────────────────────
  // p: 0→1 drives everything
  const p = progress;

  // Phase 1 (0→0.25): background starts white, stays white
  // Phase 2 (0.25→0.55): background crossfades from white → deep dark
  const bgOpacity = Math.min(Math.max((p - 0.22) / 0.30, 0), 1);
  const fogOpacity = bgOpacity * 0.7;

  // Eyebrow: appears at 0.35
  const eyebrowOpacity = Math.min(Math.max((p - 0.32) / 0.14, 0), 1);

  // Text lines: cascade in starting 0.42
  const lineProgress = (start) => ({
    opacity: Math.min(Math.max((p - start) / 0.13, 0), 1),
    transform: `translateY(${(1 - Math.min(Math.max((p - start) / 0.15, 0), 1)) * 55}px)`,
  });

  // Bottom bar: 0.80
  const bottomOpacity = Math.min(Math.max((p - 0.78) / 0.15, 0), 1);

  // Text color: white once background is >50% dark
  const textDark = bgOpacity > 0.5;

  return (
    <section id="services" ref={containerRef} className="srv__standalone-section">
      <div className="srv__sticky-scene-full">
        {/* ── White base (always visible, covered by dark overlay) ── */}
        <div className="srv__white-base" />

        {/* ── Dark atmospheric overlay (fades in on scroll) ── */}
        <div className="srv__dark-bg" style={{ opacity: bgOpacity }} />
        <div className="srv__fog-overlay" style={{ opacity: fogOpacity }} />

        {/* ── Three.js Stone Canvas ── */}
        <StoneCanvas progress={p} />

        {/* ── Content layer ── */}
        <div className="srv__content-layer">
          {/* Eyebrow */}
          <div className="srv__top-bar">
            <span
              className={`srv__eyebrow ${textDark ? 'srv__eyebrow-dark' : ''}`}
              style={{ opacity: eyebrowOpacity }}
            >
              OUR SERVICES
            </span>
          </div>

          {/* Monumental Typography */}
          <div className="srv__center-sculpture">
            <div className="srv__typo-grid">
              {[
                { svc: SERVICES_DATA[0], start: 0.40 },
                { svc: SERVICES_DATA[1], start: 0.51 },
                { svc: SERVICES_DATA[2], start: 0.62 },
                { svc: SERVICES_DATA[3], start: 0.73 },
              ].map(({ svc, start }) => (
                <div key={svc.id} className="srv__typo-row">
                  <button
                    className="srv__word-btn"
                    style={lineProgress(start)}
                    onClick={() => openServiceModal(svc)}
                    aria-label={`Explore ${svc.title} Services`}
                  >
                    <span className={`srv__word ${textDark ? 'srv__word-dark' : ''}`}>
                      {svc.title}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="srv__bottom-bar" style={{ opacity: bottomOpacity }}>
            <div className="srv__tag-wrapper">
              <span className="srv__sparkle" style={{ color: textDark ? 'rgba(200,200,210,0.8)' : '#111827' }}>✦</span>
              <span className={`srv__tag-text ${textDark ? 'srv__tag-dark' : ''}`}>
                DIFFERENT DISCIPLINES. ONE STANDARD OF CRAFT.
              </span>
            </div>
            <div className="srv__cta-wrapper">
              <button
                className={`srv__view-link ${textDark ? 'srv__view-link-dark' : ''}`}
                onClick={() => openServiceModal(SERVICES_DATA[0])}
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
