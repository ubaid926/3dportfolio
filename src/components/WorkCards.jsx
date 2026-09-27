import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  motion,
  useScroll,
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
    tags: ['WebGL', 'PBR Baking', 'Three.js', 'Anisotropy'],
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
    tags: ['Skeletal Animation', 'Normal Cages', 'Kinematics'],
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
    tags: ['Lightmap GI', 'Radiosity', '4K HDR', 'Spatial UI'],
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
    tags: ['Micro PBR', 'Exploded Animation', 'Jeweled Movement'],
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
    tags: ['SSS Baking', 'Blendshapes', 'Facial Rig', 'Skin Shader'],
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
    tags: ['Curvature Baking', 'Modular Attachments', 'Weathering'],
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
    tags: ['Volumetrics', 'Vector Fields', 'GPU Compute'],
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
    tags: ['Photogrammetry', 'Wind Tunnel', 'Telemetry Twin'],
    description:
      'Industrial drone configurator with photogrammetric surface baking, live rotor kinematic animations, and interactive aerodynamic airflow streamlines.',
  },
];

/* ─────────────────────────────────────────────────────────
   MAIN 3D WORK CARDS SHOWCASE
   ───────────────────────────────────────────────────────── */

const WorkCards = () => {
  const targetRef = useRef(null);
  const stageRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [floatIndex, setFloatIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [servicesProgress, setServicesProgress] = useState(0);
  const [curtainTransform, setCurtainTransform] = useState('0vw');

  // Mouse Parallax Ref
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.0005,
  });

  // Calculate card progress and curtain reveal
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));

    // Phase 1 (0.0 -> 0.80): Carousel scroll through all projects
    const carouselLimit = 0.80;
    const cardsRatio = Math.min(clamped / carouselLimit, 1);
    const continuousIdx = cardsRatio * (PROJECTS.length - 1);
    setFloatIndex(continuousIdx);

    const intIdx = Math.min(Math.round(continuousIdx), PROJECTS.length - 1);
    setActiveIndex(intIdx);

    // Phase 2 (0.80 -> 1.0): Slide curtain out cleanly to reveal Services section
    if (clamped >= carouselLimit) {
      const sProgress = (clamped - carouselLimit) / (1 - carouselLimit);
      setServicesProgress(sProgress);
      // Curtain slides to the left
      const isMobile = window.innerWidth <= 768;
      const slidePercent = sProgress * 100;
      setCurtainTransform(isMobile ? `0 -${slidePercent}vh` : `-${slidePercent}vw 0`);
    } else {
      setServicesProgress(0);
      setCurtainTransform('0vw');
    }
  });

  // Smooth 60FPS Mouse Parallax Loop
  useEffect(() => {
    const loop = () => {
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      const stage = stageRef.current;
      if (stage) {
        stage.style.setProperty('--mouse-rot-x', `${-m.y * 4.5}deg`);
        stage.style.setProperty('--mouse-rot-y', `${m.x * 5.5}deg`);
        stage.style.setProperty('--mouse-move-x', `${m.x * 9}px`);
        stage.style.setProperty('--mouse-move-y', `${m.y * 7}px`);
        stage.style.setProperty('--outer-para-x', `${m.x * 20}px`);
        stage.style.setProperty('--outer-para-y', `${m.y * 14}px`);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseRef.current.targetX = (clientX / innerWidth - 0.5) * 2;
    mouseRef.current.targetY = (clientY / innerHeight - 0.5) * 2;
  }, []);

  // Programmatic scroll to a specific project index
  const scrollToProject = useCallback((index) => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScroll = targetRef.current.offsetHeight - window.innerHeight;
    const carouselLimit = 0.80;
    const targetProgress = (index / (PROJECTS.length - 1)) * carouselLimit;
    const scrollTarget = scrollTop + targetProgress * totalScroll;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }, []);

  const prevProject = () => {
    if (activeIndex > 0) scrollToProject(activeIndex - 1);
  };

  const nextProject = () => {
    if (activeIndex < PROJECTS.length - 1) scrollToProject(activeIndex + 1);
  };

  const activeProject = PROJECTS[activeIndex] || PROJECTS[0];

  // Helper to compute continuous 3D transform for any card at delta = i - floatIndex
  const getCardTransform = (index) => {
    const delta = index - floatIndex;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth > 768 && window.innerWidth <= 1024;

    // Spacing constants based on viewport
    const stepX = isMobile ? 220 : isTablet ? 340 : 420;
    const curveX = isMobile ? 25 : isTablet ? 35 : 45;

    // Calculate X translation
    let x = 0;
    if (delta > 0) {
      x = delta * stepX + Math.pow(Math.min(delta, 3), 1.15) * curveX;
    } else if (delta < 0) {
      const absD = Math.abs(delta);
      x = -(absD * stepX + Math.pow(Math.min(absD, 3), 1.15) * curveX);
    }

    // Scale: 1 at delta=0, drops to ~0.76 at ±1, ~0.62 at ±2
    const absDelta = Math.abs(delta);
    const scale = Math.max(0.48, 1 - absDelta * (isMobile ? 0.26 : 0.22));

    // RotateY: 0 at delta=0, -22deg at delta=+1, +22deg at delta=-1
    const rotateY = -Math.max(-30, Math.min(30, delta * (isMobile ? 18 : 22)));

    // TranslateZ: 0 at center, drops to background as distance increases
    const translateZ = -absDelta * (isMobile ? 65 : 90);

    // Opacity: 1 at 0, ~0.55 at ±1, ~0.26 at ±2, 0 at |delta| >= 2.6
    let opacity = 1 - absDelta * 0.44;
    if (absDelta > 2.2) opacity = Math.max(0, 1 - absDelta * 0.55);
    opacity = Math.max(0, Math.min(1, opacity));

    // Z-Index: Active card has highest z-index
    const zIndex = Math.round(20 - Math.min(absDelta * 4, 18));

    return {
      transform: `translate3d(${x}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: opacity < 0.2 ? 'none' : 'auto',
    };
  };

  return (
    <div id="work" ref={targetRef} className="wc__outer-wrapper">
      <div className="wc__sticky-scene" onMouseMove={handleMouseMove}>

        {/* ── UNDERNEATH LAYER: Full Animated Services Section ── */}
        <div className="wc__services-underlay">
          <ServicesView
            progress={servicesProgress}
            onOpenModal={(svc) => setSelectedService(svc)}
          />
        </div>

        {/* ── FOREGROUND LAYER: WORK CARDS CURTAIN (SLIDES OUT TO REVEAL SERVICES) ── */}
        <div
          className="wc__slide-curtain"
          style={{
            transform: curtainTransform.includes('vh')
              ? `translateY(${curtainTransform.split(' ')[1]})`
              : `translateX(${curtainTransform})`,
          }}
        >
          {/* Subtle Blurred Background Image (Active Project) */}
          <div className="wc__backdrop-wrap">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeProject.id}
                className="wc__backdrop-image-layer"
                initial={{ opacity: 0, scale: 1.18 }}
                animate={{ opacity: 1, scale: 1.12 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={activeProject.image}
                  alt=""
                  aria-hidden="true"
                  className="wc__backdrop-img"
                />
              </motion.div>
            </AnimatePresence>
            <div className="wc__backdrop-overlay" />
            <div className="wc__backdrop-vignette" />
          </div>

          {/* Top Hairline Divider & Accent Crosshair */}
          <div className="wc__top-hairline">
            <span className="wc__crosshair">+</span>
          </div>

          {/* Main Two-Part Split Layout */}
          <div className="wc__split-layout">

            {/* =====================================================
                LEFT PANEL: Section Heading & Dynamic Project Information
            ===================================================== */}
            <div className="wc__left-panel">
              {/* Eyebrow with Section Label & Project Nav Counter */}
              <div className="wc__eyebrow-row">
                <div className="wc__section-badge">
                  <span className="wc__badge-dot" />
                  <span className="wc__badge-title">SELECTED WORK</span>
                </div>
                <div className="wc__hairline-sep" />
                <div className="wc__counter-box">
                  <span className="wc__counter-curr">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="wc__counter-slash">/</span>
                  <span className="wc__counter-max">
                    {String(PROJECTS.length).padStart(2, '0')}
                  </span>
                  {/* Arrow Buttons for Direct Carousel Nav */}
                  <div className="wc__nav-arrows">
                    <button
                      className="wc__nav-btn"
                      onClick={prevProject}
                      disabled={activeIndex === 0}
                      aria-label="Previous project"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      className="wc__nav-btn"
                      onClick={nextProject}
                      disabled={activeIndex === PROJECTS.length - 1}
                      aria-label="Next project"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Section Heading */}
              <div className="wc__heading-block">
                <h2 className="wc__main-title">
                  3D Configurators<br />
                  <span className="wc__title-accent">&amp; Baked Renders</span>
                </h2>
              </div>

              {/* Dynamic Project Details (Number, Category, Title, Subtitle) */}
              <div className="wc__dynamic-info-block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    className="wc__info-content"
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="wc__project-meta-tag">
                      <span className="wc__meta-idx">
                        {String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                      </span>
                      <span className="wc__meta-dash">—</span>
                      <span className="wc__meta-category">{activeProject.category}</span>
                    </div>

                    <h3 className="wc__project-heading">
                      {activeProject.title}
                    </h3>

                    <p className="wc__project-desc">
                      {activeProject.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Link: View All 3D Projects */}
              <div className="wc__left-action-row">
                <a
                  href="#services"
                  className="wc__explore-all-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to the services reveal portion of this section
                    if (targetRef.current) {
                      const rect = targetRef.current.getBoundingClientRect();
                      const scrollTop = window.scrollY + rect.top;
                      const totalScroll = targetRef.current.offsetHeight - window.innerHeight;
                      window.scrollTo({ top: scrollTop + totalScroll * 0.88, behavior: 'smooth' });
                    }
                  }}
                >
                  <span>VIEW ALL 3D PROJECTS</span>
                  <svg
                    width="15"
                    height="15"
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

              {/* Scroll To Explore Pill */}
              <div className="wc__scroll-pill-wrap" aria-hidden="true">
                <div className="wc__scroll-pill">
                  <span className="wc__scroll-dot" />
                </div>
                <span className="wc__scroll-label">Scroll to explore</span>
              </div>
            </div>

            {/* =====================================================
                RIGHT PANEL: 3D Floating Project Boards Carousel
            ===================================================== */}
            <div className="wc__right-panel">
              <div ref={stageRef} className="wc__3d-stage">
                <div className="wc__3d-carousel-track">
                  {PROJECTS.map((project, idx) => {
                    const style = getCardTransform(idx);
                    const isActive = idx === activeIndex;

                    return (
                      <div
                        key={project.id}
                        className={`wc__3d-card ${isActive ? 'wc__3d-card--active' : ''}`}
                        style={style}
                        onClick={() => {
                          if (isActive) {
                            setSelectedProject(project);
                          } else {
                            scrollToProject(idx);
                          }
                        }}
                      >
                        {/* Specular Edge Highlight */}
                        <div className="wc__card-specular" />

                        {/* Card Top Header */}
                        <div className="wc__card-top-bar">
                          <span className="wc__card-cat-badge">{project.category}</span>
                          <span className="wc__card-num-badge">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Image Showcase (Clean visual focus, NO repeating title overlay) */}
                        <div className="wc__card-visual-frame">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="wc__card-image"
                            loading={idx <= 2 ? 'eager' : 'lazy'}
                          />
                          <div className="wc__card-image-gradient" />
                        </div>

                        {/* Card Bottom Meta & Direct Action */}
                        <div className="wc__card-bottom-bar">
                          <div className="wc__card-client-wrap">
                            <span className="wc__card-client-title">{project.title}</span>
                            <span className="wc__card-client-sub">{project.client} // {project.year}</span>
                          </div>

                          <button
                            className="wc__card-arrow-btn"
                            aria-label={`Open ${project.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Card Bottom Under-Title & Explore Project Link */}
                <div className="wc__active-card-caption">
                  <div className="wc__caption-text-block">
                    <span className="wc__caption-cat">{activeProject.category}</span>
                    <h4 className="wc__caption-title">{activeProject.title}</h4>
                    <p className="wc__caption-desc">{activeProject.subtitle}</p>
                  </div>

                  <button
                    className="wc__explore-project-action"
                    onClick={() => setSelectedProject(activeProject)}
                  >
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
                  </button>
                </div>
              </div>

              {/* Minimal Progress Dots Indicator */}
              <div className="wc__progress-dots-bar">
                {PROJECTS.map((_, i) => (
                  <button
                    key={i}
                    className={`wc__dot-indicator ${i === activeIndex ? 'wc__dot-indicator--active' : ''}`}
                    onClick={() => scrollToProject(i)}
                    aria-label={`Jump to project ${i + 1}`}
                  >
                    <span className="wc__dot-core" />
                  </button>
                ))}
              </div>
            </div>

          </div>{/* .wc__split-layout */}
        </div>{/* .wc__slide-curtain */}
      </div>{/* .wc__sticky-scene */}

      {/* PROJECT CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="wc__modal-backdrop"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="wc__modal-content"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
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
                    href="#contact"
                    className="wc__modal-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProject(null);
                      const el = document.getElementById('contact') || document.querySelector('.footer');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>START SIMILAR PROJECT</span>
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