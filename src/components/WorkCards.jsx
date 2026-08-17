import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';

import img1 from '../assets/(1).jpeg';
import img2 from '../assets/(2).jpeg';
import img3 from '../assets/(3).jpeg';
import img4 from '../assets/(4).jpeg';
import img5 from '../assets/(5).jpeg';
import img6 from '../assets/(6).jpeg';
import img7 from '../assets/(7).jpeg';
import img8 from '../assets/(8).jpeg';
import { ServicesView, ServiceDetailModal } from './Services';

import './WorkCards.css';

const PROJECTS = [
  {
    id: 'aerodynamic-hypercar',
    title: 'AeroDynamic GT Configurator',
    subtitle:
      'Real-time hypercar configurator with raytraced paint baking and carbon fiber anisotropy.',
    category: '3D Configurator',
    year: '2026',
    client: 'AeroDynamic Motors',
    image: img1,
    tagline: 'RAY-TRACED PBR PAINT & ANISOTROPIC BAKING',
    heroText: 'Configure Hypercar',
    tags: ['WebGL', 'PBR Baking', 'Three.js', 'Anisotropy'],
    theme: 'light',
    description:
      'Ultra-high fidelity automotive configurator featuring real-time clearcoat lacquer reflection, baked carbon fiber weave anisotropy, and instant rim swapping.',
  },
  {
    id: 'cybermech-studio',
    title: 'CyberMech Rig & Motion Studio',
    subtitle:
      'Kinematic skeletal rigging and normal cage baking for high-mobility robotic exoskeletons.',
    category: 'Animation & Rigging',
    year: '2025',
    client: 'Apex Robotics',
    image: img2,
    tagline: 'HIGH-TO-LOW CAGE BAKING & SKELETAL RIGS',
    heroText: 'Robotic Motion',
    tags: ['Skeletal Animation', 'Normal Cages', 'Kinematics'],
    theme: 'dark',
    description:
      'Interactive 3D mech configurator with high-poly to low-poly baked normal maps, procedural armor plating detachment, and dynamic hydraulic gait animations.',
  },
  {
    id: 'spatial-archviz',
    title: 'Spatial ArchViz Lightmap Engine',
    subtitle:
      'Radiosity global illumination precomputation for photorealistic browser walkthroughs.',
    category: 'Lightmap Baking',
    year: '2025',
    client: 'Vanguard Architecture',
    image: img3,
    tagline: 'GLOBAL ILLUMINATION & RADIOSITY BAKING',
    heroText: 'Radiant ArchViz',
    tags: ['Lightmap GI', 'Radiosity', '4K HDR', 'Spatial UI'],
    theme: 'light',
    description:
      'Architectural visualizer that pre-computes complex bounce lighting, soft shadow penumbras, and ambient occlusion into lightweight 4K HDR lightmaps for 60+ FPS web walkthroughs.',
  },
  {
    id: 'chronowatch-horology',
    title: 'ChronoWatch Horology Studio',
    subtitle:
      'Micro-displacement normal baking and exploded mechanical escapement gear animation.',
    category: '3D Configurator',
    year: '2026',
    client: 'Chrono Horology Genève',
    image: img4,
    tagline: 'MICRO-DISPLACEMENT & EXPLODED GEAR MOTION',
    heroText: 'Mechanical Precision',
    tags: ['Micro PBR', 'Exploded Animation', 'Jeweled Movement'],
    theme: 'dark',
    description:
      'Luxury timepiece configurator with baked brushed titanium roughness maps, procedural sapphire crystal refraction, and exploded mechanical escapement gear animations.',
  },
  {
    id: 'biosculpt-character',
    title: 'BioSculpt Organic Character Lab',
    subtitle:
      'Subsurface scattering (SSS) texture baking and facial blendshape animation rig.',
    category: 'Texture Baking',
    year: '2025',
    client: 'BioSculpt Media',
    image: img5,
    tagline: 'SUBSURFACE SCATTERING & BLENDSHAPE BAKING',
    heroText: 'Organic Realism',
    tags: ['SSS Baking', 'Blendshapes', 'Facial Rig', 'Skin Shader'],
    theme: 'light',
    description:
      'High-end digital avatar suite featuring baked subsurface scattering irradiance maps, micro-pore normal distribution, and 52 ARKit facial blendshape animations.',
  },
  {
    id: 'exosuit-combat',
    title: 'ExoSuit Armor Customizer',
    subtitle:
      'Multi-channel curvature and procedural weather wear baking with modular attachment rigging.',
    category: '3D Configurator',
    year: '2026',
    client: 'Aegis Armament',
    image: img6,
    tagline: 'CURVATURE WEAR & MODULAR ATTACHMENT RIGS',
    heroText: 'Tactical Armor',
    tags: ['Curvature Baking', 'Modular Attachments', 'Weathering'],
    theme: 'dark',
    description:
      'Military-grade combat exoskeleton configurator allowing users to simulate realistic armor scratch degradation, heat discolouration, and swap modular plating in real time.',
  },
  {
    id: 'quantum-visualizer',
    title: 'Quantum Volumetric Engine',
    subtitle:
      'Volumetric density baking and vector field particle animation visualizer.',
    category: 'Spatial WebGL',
    year: '2026',
    client: 'Quantum Labs',
    image: img7,
    tagline: 'VOLUMETRIC DENSITY & VECTOR FIELD MOTION',
    heroText: 'Vector Fields',
    tags: ['Volumetrics', 'Vector Fields', 'GPU Compute'],
    theme: 'light',
    description:
      'Real-time simulation engine that bakes high-density fluid voxels and electromagnetic vector fields into compact 3D texture lookup tables with zero performance drop.',
  },
  {
    id: 'neurodrone-flight',
    title: 'NeuroDrone Flight Visualizer',
    subtitle:
      'Photogrammetry texture baking and aerodynamic wind tunnel streamline animations.',
    category: 'Animation & Rigging',
    year: '2025',
    client: 'NeuroAero Dynamics',
    image: img8,
    tagline: 'PHOTOGRAMMETRY BAKING & STREAMLINE MOTION',
    heroText: 'Aerodynamic Flow',
    tags: ['Photogrammetry', 'Wind Tunnel', 'Telemetry Twin'],
    theme: 'dark',
    description:
      'Industrial drone configurator with photogrammetric surface baking, live rotor kinematic animations, and interactive aerodynamic airflow streamlines.',
  },
];

/* =========================================================
   INDIVIDUAL CARD
   ========================================================= */

const CardItem = ({
  project,
  index,
  isActive,
  onSelectCard,
  setSelectedProject,
}) => {
  return (
    <div
      key={`card-${index}`}
      className={`wc__card ${isActive ? 'wc__card--active' : ''}`}
      onClick={() => setSelectedProject(project)}
      onMouseEnter={() => onSelectCard(index)}
    >
      {/* =====================================================
          CARD MEDIA
      ===================================================== */}
      <div className="wc__card-media">
        <img
          src={project.image}
          alt={project.title}
          className="wc__card-img"
          loading="eager"
        />

        {/* Overlay */}
        <div className="wc__media-overlay">
          <div className="wc__media-badge">
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="currentColor"
              className="wc__badge-quote-icon"
            >
              <path d="M0 8.4C0 3.7 2.8 0.6 7.4 0L8 1.8C4.8 2.3 3.6 4.3 3.4 6.2C4 6 4.8 6 5.6 6.4C7 7.1 8 8.6 8 10.4C8 12.4 6.4 14 4.2 14C1.8 14 0 11.8 0 8.4ZM10 8.4C10 3.7 12.8 0.6 17.4 0L18 1.8C14.8 2.3 13.6 4.3 13.4 6.2C14 6 14.8 6 15.6 6.4C17 7.1 18 8.6 18 10.4C18 12.4 16.4 14 14.2 14C11.8 14 10 11.8 10 8.4Z" />
            </svg>
            <span className="wc__badge-text">{project.tagline}</span>
          </div>
          <div className="wc__media-hero-text">{project.heroText}</div>
        </div>

        {/* Hover Action */}
        <div className="wc__card-hover-action">
          <span>EXPLORE CASE STUDY</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      {/* =====================================================
          CARD FOOTER
      ===================================================== */}
      <div className="wc__card-info">
        <div className="wc__card-content-left">
          <h3 className="wc__card-title">{project.title}</h3>
          <p className="wc__card-subtitle">{project.subtitle}</p>
        </div>

        <div className="wc__explore-link">
          <span>EXPLORE PROJECT</span>
          <svg
            width="16"
            height="16"
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
    </div>
  );
};

/* =========================================================
   MAIN WORK CARDS & SEAMLESS SERVICES REVEAL
   ========================================================= */

const WorkCards = () => {
  const targetRef = useRef(null);
  const trackRef = useRef(null);
  const overflowRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [maxTranslateX, setMaxTranslateX] = useState(0);
  const [maxTranslateY, setMaxTranslateY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [servicesProgress, setServicesProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const calculateTranslate = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!trackRef.current || !overflowRef.current) return;

      // Desktop horizontal translation distance
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = overflowRef.current.clientWidth;
      const maxScrollX = trackWidth - viewportWidth + 80;
      setMaxTranslateX(Math.max(0, maxScrollX));

      // Mobile vertical translation distance for stacked cards
      const trackHeight = trackRef.current.scrollHeight;
      const viewportHeight = overflowRef.current.clientHeight;
      const maxScrollY = trackHeight - viewportHeight;
      setMaxTranslateY(Math.max(0, maxScrollY));
    };

    calculateTranslate();
    const timer = setTimeout(calculateTranslate, 250);
    window.addEventListener('resize', calculateTranslate);

    let ro;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(calculateTranslate);
      ro.observe(trackRef.current);
      if (overflowRef.current) ro.observe(overflowRef.current);
    }

    const handleScroll = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const totalScroll = targetRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const current = -rect.top;
      const progress = Math.max(0, Math.min(1, current / totalScroll));

      // Phase 1 (0 -> 0.58): calculate active card index
      const cardsProgress = Math.min(progress / 0.58, 1);
      const idx = Math.min(
        Math.floor(cardsProgress * PROJECTS.length),
        PROJECTS.length - 1
      );
      setActiveIndex(Math.max(0, idx));

      // Phase 2 & 3 (0.58 -> 1.0): Services animation seamless transition
      const sProgress = Math.max(0, Math.min(1, (progress - 0.58) / 0.42));
      setServicesProgress(sProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', calculateTranslate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));

    // Phase 1 (0 -> 0.58): Active card
    const cardsProgress = Math.min(clamped / 0.58, 1);
    const idx = Math.min(
      Math.floor(cardsProgress * PROJECTS.length),
      PROJECTS.length - 1
    );
    setActiveIndex(idx);

    // Phase 2 & 3 (0.58 -> 1.0): Services background & 3D stone animation
    const sProgress = Math.max(0, Math.min(1, (clamped - 0.58) / 0.42));
    setServicesProgress(sProgress);
  });

  // Phase 1 (0 -> 0.58): Cards scroll (Desktop: horizontal, Mobile: vertical stacked)
  const cardsX = useTransform(smoothProgress, [0, 0.58], [0, -maxTranslateX]);
  const cardsY = useTransform(smoothProgress, [0, 0.58], [0, -maxTranslateY]);

  // Phase 2 (0.58 -> 0.70): Curtain slides out cleanly without dead empty scroll space
  const curtainX = useTransform(smoothProgress, [0.58, 0.70], ['0vw', '-100vw']);
  const curtainY = useTransform(smoothProgress, [0.58, 0.70], ['0vh', '-100vh']);

  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];

  return (
    <div id="work" ref={targetRef} className="wc__outer-wrapper">
      <div className="wc__sticky-scene">

        {/* ── UNDERNEATH LAYER: Full Animated Services Section (Desktop & Mobile) ── */}
        <div className="wc__services-underlay">
          <ServicesView
            progress={servicesProgress}
            onOpenModal={(svc) => setSelectedService(svc)}
          />
        </div>

        {/* ── FOREGROUND LAYER: WORK CARDS CURTAIN (SLIDES OUT TO REVEAL SERVICES) ── */}
        <motion.div
          className="wc__slide-curtain"
          style={isMobile ? { y: curtainY } : { x: curtainX }}
        >
          {/* Full-bleed ambient background image that crossfades with active project */}
          <div className="wc__backdrop-wrap">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeProject.id}
                className="wc__backdrop-image-layer"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="wc__backdrop-img"
                />
              </motion.div>
            </AnimatePresence>
            <div className="wc__backdrop-overlay" />
          </div>

          {/* Top Grid Border Line with Center Crosshair */}
          <div className="wc__top-border-line">
            <span className="wc__crosshair">+</span>
          </div>

          {/* Split Screen Container */}
          <div className="wc__split-layout">
            {/* LEFT SIDE: Heading & Dynamic Active Card Information */}
            <div className="wc__left-panel">
              <div className="wc__title-block">
                {/* Static Section Title - Always Visible in Position */}
                <div className="wc__static-header">
                  <h2 className="wc__main-title">
                    3D Configurators
                    <br />
                    &amp; Baked Renders
                  </h2>
                </div>

                {/* Dynamic Active Card Heading & Category that updates with displayed card */}
                <div className="wc__active-card-info">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProject.id}
                      className="wc__active-info-inner"
                      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="wc__active-badge">
                        <span className="wc__active-index">
                          {String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                        </span>
                        <span className="wc__active-sep">—</span>
                        <span className="wc__active-cat">{activeProject.category}</span>
                      </div>

                      <h3 className="wc__active-title">
                        {activeProject.title}
                      </h3>

                      <p className="wc__active-subtitle">
                        {activeProject.subtitle}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Action Link */}
                <a href="#all-work" className="wc__all-link">
                  <span>VIEW ALL 3D PROJECTS</span>
                  <svg
                    width="16"
                    height="16"
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
                </a>
              </div>
            </div>

            {/* RIGHT SIDE: Scrolling Cards Track (Horizontal on desktop, vertical on mobile) */}
            <div className="wc__right-panel" ref={overflowRef}>
              <motion.div
                ref={trackRef}
                className="wc__track"
                style={isMobile ? { y: cardsY } : { x: cardsX }}
              >
                {PROJECTS.map((project, index) => (
                  <CardItem
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={index === activeIndex}
                    onSelectCard={setActiveIndex}
                    setSelectedProject={setSelectedProject}
                  />
                ))}

                {/* Finale End Card: Discover Our Complete Collection */}
                <div className="wc__finale-card">
                  {/* Media Frame — matches .wc__card-media */}
                  <div className="wc__finale-card-media">
                    <div className="wc__finale-card-inner">
                      {/* Top badge — mirrors .wc__media-badge */}
                      <div className="wc__finale-badge">
                        <span className="wc__finale-badge-dot" />
                        <span>FULL ARCHIVE</span>
                      </div>
                      {/* Hero text — mirrors .wc__media-hero-text */}
                      <p className="wc__finale-hero-text">
                        Explore our full archive
                        <br />
                        of baked 3D&nbsp;models,
                        <br />
                        GLTF&nbsp;&amp;&nbsp;shaders.
                      </p>
                    </div>
                  </div>

                  {/* Footer — mirrors .wc__card-info */}
                  <div className="wc__finale-footer">
                    <div className="wc__finale-footer-left">
                      <h3 className="wc__finale-footer-title">Full 3D Showcase Archive</h3>
                      <p className="wc__finale-footer-sub">Configurators, lightmaps & animations.</p>
                    </div>
                    <a href="#all-work" className="wc__finale-link">
                      <span>VIEW ALL</span>
                      <svg
                        width="16"
                        height="16"
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
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="wc__modal-backdrop"
            onClick={() => setSelectedProject(null)}
          >
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
                  <div className="wc__modal-cat">
                    {selectedProject.category} — {selectedProject.year}
                  </div>

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
                        {selectedProject.tags.map((tag) => (
                          <span key={tag} className="wc__modal-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="wc__modal-btn"
                    onClick={(e) => e.preventDefault()}
                  >
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

      {/* SERVICES MODAL */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default WorkCards;