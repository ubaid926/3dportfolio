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
    id: 'aura-luxury-packaging',
    title: 'Aura Luxury Skincare Architecture',
    subtitle:
      'Minimalist identity, custom geometric vessels, and blind debossed tactile packaging.',
    category: 'Packaging & Brand Identity',
    year: '2026',
    client: 'Aura Laboratories Paris',
    image: img1,
    tagline: 'LUXURY PACKAGING ARCHITECTURE & BESPOKE BRAND IDENTITY',
    tags: ['Brand Identity', 'Packaging Design', 'Gold Foil', 'Custom Vessels'],
    description:
      'A comprehensive visual identity and luxury packaging architecture featuring blind debossed textured cotton papers, custom amber glass vessels, and bespoke typography.',
  },
  {
    id: 'kinetics-poster-triennial',
    title: 'Kinetics Poster Triennial Series',
    subtitle:
      'Expressive kinetic typography, dynamic variable weights, and chromatic silkscreen layouts.',
    category: 'Motion & Typography',
    year: '2025',
    client: 'Type Festival Berlin',
    image: img2,
    tagline: 'KINETIC TYPOGRAPHY & EXPERIMENTAL POSTER ARCHITECTURES',
    tags: ['Kinetic Typography', 'Poster Design', 'Silkscreen', 'Motion Graphics'],
    description:
      'Award-winning identity and silkscreen poster system celebrating expressive letterforms, variable weight transitions, and optical layout vibrations.',
  },
  {
    id: 'vanguard-architecture-monograph',
    title: 'Vanguard Architectural Monograph',
    subtitle:
      'Hardcover publication with rigorous 12-column Swiss grid and natural linen binding.',
    category: 'Editorial & Book Design',
    year: '2025',
    client: 'Vanguard Review',
    image: img3,
    tagline: 'EDITORIAL GRID SYSTEMS & LUXURY BOOK DESIGN',
    tags: ['Editorial Design', 'Book Layout', 'Swiss Grid', 'Linen Binding'],
    description:
      'A 320-page hardcover architectural monograph designed with a rigorous 12-column Swiss grid, curated duo-tone photography plates, and metallic foil debossing.',
  },
  {
    id: 'chrono-geneve-horology',
    title: 'Chrono Genève Haute Horlogerie',
    subtitle:
      'Heritage visual universe, custom display serif typography, and prestige catalog.',
    category: 'Luxury Brand Identity',
    year: '2026',
    client: 'Chrono Genève Horology',
    image: img4,
    tagline: 'HERITAGE BRANDING, CUSTOM SERIF & COLLECTORS CATALOG',
    tags: ['Luxury Branding', 'Custom Typeface', 'Brand Manual', 'Art Direction'],
    description:
      'Complete brand universe for an independent Swiss horologist, including custom crafted serif numerals, leather-bound brand manual, and prestige collectors catalog.',
  },
  {
    id: 'hyperion-soundworks-vinyl',
    title: 'Hyperion Sonic Identity & Vinyl',
    subtitle:
      'Multi-sensory vinyl record packaging with iridescent holographic foil stamping.',
    category: 'Music & Packaging',
    year: '2025',
    client: 'Hyperion Records London',
    image: img5,
    tagline: 'VINYL SLEEVE DESIGN & GENERATIVE BRAND IDENTITY',
    tags: ['Vinyl Packaging', 'Generative Art', 'Sonic Branding', 'Holo Foil'],
    description:
      'Multi-sensory vinyl record packaging featuring generative sound-wave patterns, iridescent holographic foil stamping, and animated audio-reactive social visualizers.',
  },
  {
    id: 'neoflora-botanical-spirits',
    title: 'NeoFlora Botanical Spirits Label',
    subtitle:
      'Intricate botanical linework, micro-embossed cotton stock, and copper foil neck seal.',
    category: 'Packaging & Print',
    year: '2026',
    client: 'NeoFlora Distilleries',
    image: img6,
    tagline: 'BOTANICAL LABEL ARCHITECTURE & TACTILE EMBOSSING',
    tags: ['Packaging Design', 'Botanical Illustration', 'Embossing', 'Copper Foil'],
    description:
      'Craft beverage packaging incorporating intricate hand-drawn botanical linework, micro-embossed textured recycled cotton stock, and copper foil neck bands.',
  },
  {
    id: 'prism-collective-system',
    title: 'Prism Modular Design System',
    subtitle:
      'Adaptive digital brand framework with responsive SVG marks and token libraries.',
    category: 'Digital Brand Systems',
    year: '2026',
    client: 'Prism Network Tokyo',
    image: img7,
    tagline: 'MODULAR BRAND SYSTEMS & KINETIC DIGITAL GUIDELINES',
    tags: ['Design Systems', 'Figma Tokens', 'Responsive Brandmark', 'UI Architecture'],
    description:
      'An adaptive visual identity framework built for digital-first creative agencies, complete with responsive vector marks, dynamic typography scales, and motion tokens.',
  },
  {
    id: 'monolith-museum-identity',
    title: 'Monolith Museum Spatial Identity',
    subtitle:
      'Large-format outdoor banners, modular gallery wayfinding, and exhibition catalogs.',
    category: 'Exhibition & Posters',
    year: '2025',
    client: 'Monolith Foundation Zurich',
    image: img8,
    tagline: 'EXHIBITION SIGNAGE, WAYFINDING & SPATIAL GRAPHICS',
    tags: ['Exhibition Identity', 'Wayfinding', 'Large-Format Print', 'Art Direction'],
    description:
      'Complete spatial and graphic identity for an international modern art exhibition, featuring 15-meter outdoor typographic banners, gallery signage, and merchandise.',
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

              {/* Main Section Heading with Kinetic Entrance */}
              <div className="wc__heading-block">
                <motion.h2
                  className="wc__main-title"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  Brand Identities<br />
                  <span className="wc__title-accent">&amp; Visual Systems</span>
                </motion.h2>
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

              {/* Action Link: View All Design Disciplines */}
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
                  <span>VIEW ALL DESIGN DISCIPLINES</span>
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