import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useInView, AnimatePresence } from 'framer-motion';
import img1 from '../assets/(1).jpeg';
import img2 from '../assets/(2).jpeg';
import img3 from '../assets/(3).jpeg';
import img4 from '../assets/(4).jpeg';
import img5 from '../assets/(5).jpeg';
import img6 from '../assets/(6).jpeg';
import img7 from '../assets/(7).jpeg';
import img8 from '../assets/(8).jpeg';
import './WorkCards.css';

const PROJECTS = [
  {
    id: 'myworker-ai',
    title: 'MyWorker AI',
    subtitle: 'AI platform simplifying hiring, management, and workforce scaling.',
    category: 'AI Platform',
    year: '2026',
    client: 'MyWorker Global',
    image: img1,
    tagline: 'BOOST YOUR WORKFORCE WITH AI DIGITAL WORKERS',
    heroText: "Hi, I'm Alex.",
    tags: ['AI Digital Workers', 'Automation', 'Enterprise'],
    theme: 'light',
    description: 'An end-to-end artificial intelligence workforce automation platform designed for high-scale enterprise teams.',
  },
  {
    id: 'pulse-studio',
    title: 'Pulse Studio',
    subtitle: 'A motion-led studio website showcasing artists, projects, and culture.',
    category: '3D WebGL',
    year: '2025',
    client: 'Pulse Soundworks',
    image: img2,
    tagline: 'SPATIAL SOUND & REALTIME GRAPHICS',
    heroText: 'Enter the Sound',
    tags: ['Three.js', 'Audio Reactive', 'WebGL'],
    theme: 'dark',
    description: 'Web-based spatial audio visualization engine with procedural shader visuals reacting to live frequency inputs.',
  },
  {
    id: 'luxury-presence',
    title: 'Luxury Presence',
    subtitle: 'Real estate platform crafting immersive property showcases for luxury homes.',
    category: 'Design System',
    year: '2025',
    client: 'Luxury Presence Inc.',
    image: img3,
    tagline: 'LIVE LIFE IN LUXURY',
    heroText: 'Spatial Real Estate',
    tags: ['UI/UX Design', 'Architecture', 'Spatial UI'],
    theme: 'light',
    description: 'High-end architectural spatial interface allowing buyers to explore ultra-luxury properties in interactive 3D.',
  },
  {
    id: 'luminary-web3',
    title: 'Luminary Capital',
    subtitle: 'DeFi dashboard & high-frequency asset visualizer with real-time WebGL analytics.',
    category: 'Fintech',
    year: '2026',
    client: 'Luminary Ltd',
    image: img4,
    tagline: 'DECENTRALIZED ASSET VISUALIZER',
    heroText: 'Realtime Data',
    tags: ['Fintech', 'Dashboard', 'Data Viz'],
    theme: 'dark',
    description: 'Ultra-low latency institutional cryptocurrency trading interface with 3D depth heatmaps and predictive analytics.',
  },
  {
    id: 'vanguard-arch',
    title: 'Vanguard Living',
    subtitle: 'Photorealistic 3D architectural walk-through app for modern urban spaces.',
    category: '3D WebGL',
    year: '2025',
    client: 'Vanguard Dev',
    image: img5,
    tagline: 'SUSTAINABLE FUTURE LIVING',
    heroText: 'Urban Architecture',
    tags: ['Architecture', 'Real-Estate', '3D Walkthrough'],
    theme: 'light',
    description: 'Interactive architectural presentation deck allowing users to customize lighting, materials, and layouts in real time.',
  },
  {
    id: 'cyberverse-fashion',
    title: 'CyberVerse Studio',
    subtitle: 'Hyper-immersive web experience showcasing digital fashion and virtual avatars.',
    category: 'Interactive',
    year: '2026',
    client: 'Cyber Couture',
    image: img6,
    tagline: 'VIRTUAL REALITY & DIGITAL FASHION',
    heroText: 'Cyber Culture',
    tags: ['Digital Fashion', 'WebGL', 'Metaverse'],
    theme: 'dark',
    description: 'Direct-to-avatar digital fashion showroom with realtime cloth simulation and high-fidelity 3D garment rendering.',
  },
  {
    id: 'quantum-ai',
    title: 'Quantum Intelligence',
    subtitle: 'Generative AI suite powering real-time synthetic media and neural canvas creation.',
    category: 'AI Platform',
    year: '2026',
    client: 'Quantum Labs',
    image: img7,
    tagline: 'GENERATIVE NEURAL CANVAS',
    heroText: 'Neural Flow',
    tags: ['Generative AI', 'Canvas', 'Neural Net'],
    theme: 'light',
    description: 'Next-gen node-based generative AI workflow engine enabling creators to manipulate complex latent models effortlessly.',
  },
  {
    id: 'nexus-robotics',
    title: 'Nexus Robotics',
    subtitle: 'Autonomous fleet management console featuring 3D digital twin monitoring.',
    category: 'Interactive',
    year: '2025',
    client: 'Nexus Heavy Tech',
    image: img8,
    tagline: 'AUTONOMOUS FLEET CONTROL',
    heroText: 'Digital Twin OS',
    tags: ['Robotics', 'Digital Twin', 'Telemetry'],
    theme: 'dark',
    description: 'Cloud control portal for robotic industrial fleets with sub-millisecond telemetry stream visualization.',
  },
];

/* ── Individual Card Component ──
   All cards except the final one are rendered fully static (no entrance transform).
   The last (rightmost) card uses useInView with the overflow container as the root so the
   slide-up fires exactly when it physically enters the visible track window.
── */
const CardItem = ({ project, index, totalCards, overflowRef, setSelectedProject }) => {
  const isLastCard = index === totalCards - 1;

  // Ref & intersection observer — only wired up for the final card
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    root: isLastCard ? overflowRef : null,
    amount: 0.15,
    once: false,
  });

  return (
    <motion.div
      ref={isLastCard ? cardRef : null}
      className={`wc__card ${project.theme === 'light' ? 'wc__card--light' : 'wc__card--dark'}`}
      animate={
        isLastCard
          ? { y: isInView ? 0 : 90, opacity: isInView ? 1 : 0.08, scale: isInView ? 1 : 0.92 }
          : { y: 0, opacity: 1, scale: 1 }
      }
      transition={isLastCard ? { duration: 0.85, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
      onClick={() => setSelectedProject(project)}
    >
      {/* Card Media Preview Frame */}
      <div className="wc__card-media">
        <img
          src={project.image}
          alt={project.title}
          className="wc__card-img"
          loading="lazy"
        />

        {/* Overlaid Badges & Typography inside Card Image */}
        <div className="wc__media-overlay">
          <div className="wc__media-badge">
            <span className="wc__badge-sparkle">✦</span>
            <span className="wc__badge-text">{project.tagline}</span>
          </div>

          <div className="wc__media-hero-text">
            {project.heroText}
          </div>
        </div>

        {/* Hover Quick Action */}
        <div className="wc__card-hover-action">
          <span>EXPLORE CASE STUDY</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      {/* Card Footer Information */}
      <div className="wc__card-info">
        <div className="wc__info-header">
          <h3 className="wc__card-title">{project.title}</h3>
          <span className="wc__card-year">{project.year}</span>
        </div>

        <p className="wc__card-subtitle">{project.subtitle}</p>

        <div className="wc__card-footer-row">
          <div className="wc__card-tags">
            {project.tags.slice(0, 2).map((t) => (
              <span key={t} className="wc__tag-pill">{t}</span>
            ))}
          </div>

          <div className="wc__explore-link">
            <span>EXPLORE PROJECT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const WorkCards = () => {
  const targetRef = useRef(null);
  const trackRef = useRef(null);
  const overflowRef = useRef(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgressVal, setScrollProgressVal] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  // Vertical scroll tracking via Framer Motion
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out scroll progress for butter-smooth horizontal translation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  // Calculate the horizontal scroll range on mount & window resize
  useEffect(() => {
    const calculateTranslate = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxScroll = trackWidth - viewportWidth + 120;
        setMaxTranslate(Math.max(0, maxScroll));
      }
    };

    calculateTranslate();
    const timer = setTimeout(calculateTranslate, 400);
    window.addEventListener('resize', calculateTranslate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateTranslate);
    };
  }, []);

  // Update active counter index & progress bar value on scroll
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setScrollProgressVal(latest);
    const index = Math.min(
      Math.floor(latest * PROJECTS.length),
      PROJECTS.length - 1
    );
    setActiveIndex(Math.max(0, index));
  });

  // Motion transform: Map vertical scroll progress (0 → 1) to horizontal X translation (0 → -maxTranslate)
  const x = useTransform(smoothProgress, [0, 1], [0, -maxTranslate]);

  return (
    <div id="work" ref={targetRef} className="wc__outer-wrapper">
      <div className="wc__sticky-scene">
        {/* Ambient background glow */}
        <div className="wc__ambient-glow" />

        <div className="wc__container">

          {/* ── SECTION HEADER ── */}
          <div className="wc__header">

            {/* Left Title & View Link */}
            <motion.div
              className="wc__title-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="wc__eyebrow">
                <span className="wc__eyebrow-dot" />
                <span>PORTFOLIO SHOWCASE</span>
              </div>

              <h2 className="wc__main-title">
                Selected work<br />
                &amp; explorations
              </h2>

              <a href="#all-work" className="wc__all-link">
                <span>VIEW ALL PROJECTS</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </motion.div>

            {/* Header Info & Live Counter */}
            <div className="wc__header-info">
              <div className="wc__counter">
                <span className="wc__counter-current">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="wc__counter-sep">/</span>
                <span className="wc__counter-total">
                  {String(PROJECTS.length).padStart(2, '0')}
                </span>
              </div>
              <div className="wc__scroll-instruction">
                [ SCROLL DOWN TO EXPLORE ]
              </div>
            </div>

          </div>

          {/* ── PINNED HORIZONTAL TRACK ── */}
          <div className="wc__track-overflow" ref={overflowRef}>
            <motion.div
              ref={trackRef}
              className="wc__track"
              style={{ x }}
            >
              {PROJECTS.map((project, idx) => (
                <CardItem
                  key={project.id}
                  project={project}
                  index={idx}
                  totalCards={PROJECTS.length}
                  overflowRef={overflowRef}
                  setSelectedProject={setSelectedProject}
                />
              ))}
            </motion.div>
          </div>

          {/* ── SCROLL PROGRESS BAR ── */}
          <div className="wc__progress-bar-wrap">
            <div
              className="wc__progress-bar-fill"
              style={{ width: `${Math.max(scrollProgressVal * 100, 5)}%` }}
            />
          </div>

        </div>
      </div>

      {/* ── PROJECT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <div className="wc__modal-backdrop" onClick={() => setSelectedProject(null)}>
            <motion.div
              className="wc__modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="wc__modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="wc__modal-grid">
                <div className="wc__modal-image-wrap">
                  <img src={selectedProject.image} alt={selectedProject.title} />
                </div>

                <div className="wc__modal-details">
                  <div className="wc__modal-cat">{selectedProject.category} — {selectedProject.year}</div>
                  <h2 className="wc__modal-title">{selectedProject.title}</h2>
                  <p className="wc__modal-desc">{selectedProject.description}</p>

                  <div className="wc__modal-meta">
                    <div className="wc__meta-item">
                      <span className="wc__meta-lbl">Client</span>
                      <span className="wc__meta-val">{selectedProject.client}</span>
                    </div>
                    <div className="wc__meta-item">
                      <span className="wc__meta-lbl">Services</span>
                      <div className="wc__modal-tags">
                        {selectedProject.tags.map(t => (
                          <span key={t} className="wc__modal-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a href="#" className="wc__modal-btn" onClick={(e) => e.preventDefault()}>
                    <span>LAUNCH PROJECT CASE</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WorkCards;
