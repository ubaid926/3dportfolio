import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import StoneCanvas from './StoneCanvas';
import LightningStorm from './LightningStorm';
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
/*  SERVICES VIEW — animated scene                  */
/*  progress: 0 (white) → 1 (dark, stone, glow)    */
/* ─────────────────────────────────────────────── */
export const ServicesView = ({ progress = 0, onOpenModal }) => {
  const [hoveredService, setHoveredService] = useState(null);

  // progress p: 0→1 drives everything smoothly
  const p = Math.max(0, Math.min(1, progress));

  // Phase 1 (0→0.05): Pristine white background, text is black, stone hidden
  // Phase 2 (0.05→0.75): Smooth crossfade from white → deep cinematic dark, text transitions black → luminous white, 3D stone flies in
  // Phase 3 (0.75→1.0): Full dark cinematic scene with stone rotating and monumental glowing typography
  const bgTransition = Math.min(Math.max((p - 0.05) / 0.70, 0), 1);
  const bgOpacity = bgTransition;
  const fogOpacity = bgTransition * 0.75;

  // Smooth RGB interpolation for typography: #111827 (17,24,39) → #f5f5f5 (245,245,245)
  const rWord = Math.round(17 + (245 - 17) * bgTransition);
  const gWord = Math.round(24 + (245 - 24) * bgTransition);
  const bWord = Math.round(39 + (245 - 39) * bgTransition);
  const wordColor = `rgb(${rWord}, ${gWord}, ${bWord})`;

  // Text shadow glow on dark background
  const textShadowStyle = bgTransition > 0.05
    ? `0 2px ${35 * bgTransition}px rgba(0, 0, 0, ${0.9 * bgTransition}), 0 0 ${75 * bgTransition}px rgba(0, 0, 0, ${0.6 * bgTransition})`
    : 'none';

  // Eyebrow: #4b5563 (75,85,99) → rgba(200,200,210,0.85)
  const rEye = Math.round(75 + (200 - 75) * bgTransition);
  const gEye = Math.round(85 + (200 - 85) * bgTransition);
  const bEye = Math.round(99 + (210 - 99) * bgTransition);
  const eyebrowColor = `rgb(${rEye}, ${gEye}, ${bEye})`;

  // Tag text: #374151 (55,65,81) → rgba(200,200,210,0.85)
  const rTag = Math.round(55 + (200 - 55) * bgTransition);
  const gTag = Math.round(65 + (200 - 65) * bgTransition);
  const bTag = Math.round(81 + (210 - 81) * bgTransition);
  const tagColor = `rgb(${rTag}, ${gTag}, ${bTag})`;

  // Sparkle icon: #111827 → rgb(220,220,230)
  const rSpk = Math.round(17 + (220 - 17) * bgTransition);
  const gSpk = Math.round(24 + (220 - 24) * bgTransition);
  const bSpk = Math.round(39 + (230 - 39) * bgTransition);
  const sparkleColor = `rgb(${rSpk}, ${gSpk}, ${bSpk})`;

  // View link CTA: #111827 → rgb(240,240,245)
  const rLnk = Math.round(17 + (240 - 17) * bgTransition);
  const gLnk = Math.round(24 + (240 - 24) * bgTransition);
  const bLnk = Math.round(39 + (245 - 39) * bgTransition);
  const viewLinkColor = `rgb(${rLnk}, ${gLnk}, ${bLnk})`;

  return (
    <div id="services" className="srv__scene-wrap">
      {/* ── White base (always visible, covered by storm clouds video overlay) ── */}
      <div className="srv__white-base" />

      {/* ── Dark Storm Clouds with Lightning Flashing Background Video ── */}
      <div className="srv__storm-video-wrap" style={{ opacity: bgOpacity }}>
        <LightningStorm progress={p} />
        <div className="srv__storm-overlay" />
      </div>
      <div className="srv__fog-overlay" style={{ opacity: fogOpacity }} />

      {/* ── Three.js Stone Canvas ── */}
      <StoneCanvas progress={p} />

      {/* ── Content layer ── */}
      <div className="srv__content-layer">
        {/* Eyebrow */}
        <div className="srv__top-bar">
          <span
            className="srv__eyebrow"
            style={{ color: eyebrowColor }}
          >
            OUR SERVICES
          </span>
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
                  <span
                    className="srv__word"
                    style={{
                      color: hoveredService === svc.id ? '#0284c7' : wordColor,
                      textShadow: textShadowStyle,
                    }}
                  >
                    {svc.title}
                  </span>
                  <span className="srv__dot-indicator">•</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="srv__bottom-bar">
          <div className="srv__tag-wrapper">
            <span className="srv__sparkle" style={{ color: sparkleColor }}>✦</span>
            <span className="srv__tag-text" style={{ color: tagColor }}>
              DESIGN WITH INTENT. BUILT TO WORK.
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
/*  STANDALONE SERVICES WRAPPER                     */
/* ─────────────────────────────────────────────── */
const Services = () => {
  const containerRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = React.useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 24,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    return smoothProgress.on('change', (v) => setProgress(Math.max(0, Math.min(1, v))));
  }, [smoothProgress]);

  const openServiceModal = (service = null) => {
    setSelectedService(service || SERVICES_DATA[0]);
    setModalOpen(true);
  };

  return (
    <section id="services-standalone" ref={containerRef} className="srv__standalone-section">
      <div className="srv__sticky-scene-full">
        <ServicesView progress={progress} onOpenModal={openServiceModal} />
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
