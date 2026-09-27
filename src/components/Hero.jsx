import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import nexoraCenterImg from '../assets/hero/nexora-center.jpg';
import cardBrandingImg from '../assets/hero/card-branding.jpg';
import cardPosterImg from '../assets/hero/card-poster.jpg';
import cardMotionImg from '../assets/hero/card-motion.jpg';
import cardPhotoImg from '../assets/hero/card-photography.jpg';
import cardSpatialImg from '../assets/hero/card-spatial.jpg';

import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Orbiting Cards Specification ── */
const ORBIT_CARDS = [
  {
    id: 'branding',
    title: 'BRAND',
    category: 'Branding',
    number: '04',
    subtitle: 'Aura Packaging',
    image: cardBrandingImg,
    // Target 3D coordinates for full orbit (Desktop)
    desktop: {
      x: -270,
      y: -175,
      z: 35,
      rotateX: 12,
      rotateY: 18,
      rotateZ: -6,
      scale: 0.85,
    },
    // Tablet coordinates
    tablet: {
      x: -180,
      y: -130,
      z: 20,
      rotateX: 10,
      rotateY: 14,
      rotateZ: -5,
      scale: 0.72,
    },
    // Mobile coordinates
    mobile: {
      x: -110,
      y: -110,
      z: 25,
      rotateX: 8,
      rotateY: 12,
      rotateZ: -4,
      scale: 0.62,
    },
    parallaxFactor: 1.15,
    floatDelay: 0,
  },
  {
    id: 'motion',
    title: 'MOTION',
    category: 'Motion Design',
    number: '03',
    subtitle: 'Kinetic Waves',
    image: cardMotionImg,
    desktop: {
      x: 275,
      y: -165,
      z: -30,
      rotateX: 9,
      rotateY: -17,
      rotateZ: 5,
      scale: 0.82,
    },
    tablet: {
      x: 185,
      y: -125,
      z: -20,
      rotateX: 8,
      rotateY: -14,
      rotateZ: 4,
      scale: 0.70,
    },
    mobile: {
      x: 110,
      y: -105,
      z: -20,
      rotateX: 6,
      rotateY: -10,
      rotateZ: 3,
      scale: 0.60,
    },
    parallaxFactor: 0.95,
    floatDelay: 1.2,
  },
  {
    id: 'poster',
    title: 'POSTER',
    category: 'Poster Design',
    number: '02',
    subtitle: 'Chromatic Orb',
    image: cardPosterImg,
    desktop: {
      x: -285,
      y: 155,
      z: 90,
      rotateX: -11,
      rotateY: 19,
      rotateZ: 6,
      scale: 0.92,
    },
    tablet: {
      x: -190,
      y: 120,
      z: 60,
      rotateX: -9,
      rotateY: 15,
      rotateZ: 5,
      scale: 0.76,
    },
    mobile: {
      x: -105,
      y: 105,
      z: 40,
      rotateX: -6,
      rotateY: 10,
      rotateZ: 4,
      scale: 0.64,
    },
    parallaxFactor: 1.3,
    floatDelay: 2.1,
  },
  {
    id: 'photography',
    title: 'PORTRAIT',
    category: 'Photography',
    number: '05',
    subtitle: 'Editorial Noir',
    image: cardPhotoImg,
    desktop: {
      x: 265,
      y: 140,
      z: 110,
      rotateX: -9,
      rotateY: -16,
      rotateZ: -5,
      scale: 0.94,
    },
    tablet: {
      x: 180,
      y: 115,
      z: 70,
      rotateX: -8,
      rotateY: -13,
      rotateZ: -4,
      scale: 0.78,
    },
    mobile: {
      x: 105,
      y: 100,
      z: 45,
      rotateX: -5,
      rotateY: -9,
      rotateZ: -3,
      scale: 0.65,
    },
    parallaxFactor: 1.35,
    floatDelay: 0.7,
  },
  {
    id: 'spatial',
    title: 'SPATIAL',
    category: 'Spatial Design',
    number: '06',
    subtitle: 'Architectural Form',
    image: cardSpatialImg,
    desktop: {
      x: 40,
      y: 235,
      z: -55,
      rotateX: -14,
      rotateY: 2,
      rotateZ: 2,
      scale: 0.80,
    },
    tablet: {
      x: 30,
      y: 175,
      z: -40,
      rotateX: -12,
      rotateY: 2,
      rotateZ: 2,
      scale: 0.68,
    },
    mobile: {
      x: 0,
      y: 140,
      z: -30,
      rotateX: -10,
      rotateY: 0,
      rotateZ: 1,
      scale: 0.58,
    },
    parallaxFactor: 0.85,
    floatDelay: 1.8,
  },
];

const Hero = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const stageRef = useRef(null);
  const centerCardRef = useRef(null);
  const orbitCardsRef = useRef([]);
  const orbitLinesRef = useRef(null);
  const leftContentRef = useRef(null);
  const hintRef = useRef(null);
  const dragPlaneRef = useRef(null);

  // Responsive state
  const [deviceType, setDeviceType] = useState('desktop');
  const [isInteractive, setIsInteractive] = useState(false);

  // Parallax / Drag interaction state
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dragPosRef = useRef({ isDragging: false, startX: 0, startY: 0, rotX: 0, rotY: 0, targetRotX: 0, targetRotY: 0 });
  const scrollProgressRef = useRef(0);
  const rafIdRef = useRef(null);

  // Detect responsive tier
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setDeviceType('mobile');
      else if (w < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up GSAP ScrollTrigger timeline
  useEffect(() => {
    const container = containerRef.current;
    const centerCard = centerCardRef.current;
    const orbitCards = orbitCardsRef.current;
    const orbitLines = orbitLinesRef.current;
    const leftContent = leftContentRef.current;
    const hint = hintRef.current;

    if (!container || !centerCard) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const targetMode = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    // Initial positioning of center card
    // On desktop: positioned on the right side of the hero section
    // Initial: large card, slight 3D rotation, prominent
    const centerInitial = isMobile
      ? { x: 0, y: 30, z: 20, scale: 0.92, rotateX: 6, rotateY: -8, rotateZ: -2 }
      : isTablet
      ? { x: 140, y: 0, z: 40, scale: 1.0, rotateX: 6, rotateY: -10, rotateZ: -2.5 }
      : { x: 220, y: 0, z: 50, scale: 1.05, rotateX: 6, rotateY: -12, rotateZ: -3 };

    // Intermediate shrunk & centered position (Phase 2 & 3)
    const centerShrunk = isMobile
      ? { x: 0, y: 0, z: 0, scale: 0.62, rotateX: 2, rotateY: -3, rotateZ: -1 }
      : isTablet
      ? { x: 80, y: 0, z: 10, scale: 0.70, rotateX: 3, rotateY: -4, rotateZ: -1 }
      : { x: 120, y: 0, z: 20, scale: 0.72, rotateX: 4, rotateY: -5, rotateZ: -1.5 };

    // Final exit position (Phase 5)
    const centerExit = {
      y: -140,
      scale: isMobile ? 0.52 : 0.60,
      opacity: 0,
    };

    // Set initial GSAP states
    gsap.set(centerCard, {
      x: centerInitial.x,
      y: centerInitial.y,
      z: centerInitial.z,
      scale: centerInitial.scale,
      rotationX: centerInitial.rotateX,
      rotationY: centerInitial.rotateY,
      rotationZ: centerInitial.rotateZ,
      transformPerspective: 1200,
      transformOrigin: '50% 50%',
      opacity: 1,
    });

    if (orbitLines) {
      gsap.set(orbitLines, {
        opacity: 0,
        scale: 0.7,
        rotationX: 62,
        rotationY: -8,
        rotationZ: -18,
      });
    }

    if (hint) {
      gsap.set(hint, { opacity: 0, y: 15 });
    }

    // Set initial states for surrounding orbit cards
    // They start invisible, small, and tucked near center card
    orbitCards.forEach((cardEl) => {
      if (!cardEl) return;
      gsap.set(cardEl, {
        x: centerInitial.x * 0.5,
        y: centerInitial.y * 0.5,
        z: -120,
        scale: 0.15,
        opacity: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        pointerEvents: 'none',
      });
    });

    // Create Main ScrollTrigger Scrub Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
            // Activate interactive hint and mouse controls during Phase 3 & 4
            if (self.progress >= 0.55 && self.progress <= 0.88) {
              setIsInteractive(true);
            } else {
              setIsInteractive(false);
            }
          },
        },
      });

      /* ── PHASE 1 (0% → 20%): Large Hero Card prominent ── */
      // Initial subtle breathing room
      tl.to(centerCard, {
        duration: 0.20,
        ease: 'power1.inOut',
      });

      /* ── PHASE 2 (20% → 45%): Card Shrinks and moves toward center ── */
      tl.to(centerCard, {
        x: centerShrunk.x,
        y: centerShrunk.y,
        z: centerShrunk.z,
        scale: centerShrunk.scale,
        rotationX: centerShrunk.rotateX,
        rotationY: centerShrunk.rotateY,
        rotationZ: centerShrunk.rotateZ,
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0.20);

      // Orbital lines start softly fading in as center card shrinks
      if (orbitLines) {
        tl.to(orbitLines, {
          opacity: 0.85,
          scale: 1,
          duration: 0.28,
          ease: 'power2.out',
        }, 0.28);
      }

      /* ── PHASE 3 (35% → 72%): Orbiting Cards emerge from behind and reach 3D Orbit ── */
      orbitCards.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const cardData = ORBIT_CARDS[idx];
        const coords = cardData[targetMode];

        // Stagger each card emergence slightly for organic arrival
        const startOffset = 0.28 + idx * 0.05;
        const duration = 0.36;

        tl.to(cardEl, {
          x: coords.x + (isMobile ? 0 : isTablet ? 80 : 120),
          y: coords.y,
          z: coords.z,
          scale: coords.scale,
          rotationX: coords.rotateX,
          rotationY: coords.rotateY,
          rotationZ: coords.rotateZ,
          opacity: 1,
          duration: duration,
          ease: 'power3.out',
          onStart: () => {
            gsap.set(cardEl, { pointerEvents: 'auto' });
          },
        }, startOffset);
      });

      // Left content gently shifts and adapts as orbit expands
      if (leftContent) {
        tl.to(leftContent, {
          x: isMobile ? 0 : -35,
          opacity: 0.85,
          duration: 0.35,
          ease: 'power2.out',
        }, 0.35);
      }

      // Drag / parallax interaction hint fades in during full orbit
      if (hint) {
        tl.to(hint, {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: 'power2.out',
        }, 0.65);
      }

      /* ── PHASE 4 (70% → 84%): Stable Full 3D Orbit & Mouse Exploration ── */
      tl.to({}, { duration: 0.14 });

      /* ── PHASE 5 (84% → 100%): Hero smoothly glides upward and fades to reveal next section ── */
      // Hint fades out first
      if (hint) {
        tl.to(hint, {
          opacity: 0,
          y: -10,
          duration: 0.08,
          ease: 'power1.in',
        }, 0.82);
      }

      // Center card lifts and fades
      tl.to(centerCard, {
        y: centerExit.y,
        scale: centerExit.scale,
        opacity: centerExit.opacity,
        duration: 0.16,
        ease: 'power2.in',
      }, 0.84);

      // Surrounding cards glide upward & fade
      orbitCards.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const cardData = ORBIT_CARDS[idx];
        const coords = cardData[targetMode];
        tl.to(cardEl, {
          y: coords.y - 120,
          scale: coords.scale * 0.85,
          opacity: 0,
          duration: 0.16,
          ease: 'power2.in',
        }, 0.84);
      });

      // Orbital lines dissolve
      if (orbitLines) {
        tl.to(orbitLines, {
          opacity: 0,
          scale: 0.85,
          duration: 0.14,
          ease: 'power2.in',
        }, 0.84);
      }

      // Left text ascends and fades smoothly
      if (leftContent) {
        tl.to(leftContent, {
          y: -70,
          opacity: 0,
          duration: 0.16,
          ease: 'power2.in',
        }, 0.84);
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [deviceType]);

  // Smooth 60FPS Mouse Parallax & 3D Interactive Drift Loop
  useEffect(() => {
    let startTime = performance.now();

    const loop = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001;
      const progress = scrollProgressRef.current;

      // Interpolate mouse parallax
      const m = mousePosRef.current;
      m.x += (m.targetX - m.x) * 0.07;
      m.y += (m.targetY - m.y) * 0.07;

      // Interpolate drag rotation
      const d = dragPosRef.current;
      d.rotX += (d.targetRotX - d.rotX) * 0.08;
      d.rotY += (d.targetRotY - d.rotY) * 0.08;

      // Apply parallax only when in orbit or hero mode (scaled by progress)
      // During phase 3 & 4 (progress 0.45 -> 0.85), mouse parallax is strongest
      const parallaxStrength = progress < 0.2
        ? 0.35 // subtle in initial hero
        : progress >= 0.45 && progress <= 0.85
        ? 1.0  // full strength in orbit
        : Math.max(0, 1 - (progress - 0.85) * 6.5);

      // Subtle zero-gravity floating calculation
      const stage = stageRef.current;
      if (stage) {
        // Overall stage subtle tilt
        const stageTiltX = d.rotX + m.y * 5 * parallaxStrength;
        const stageTiltY = d.rotY + m.x * 7 * parallaxStrength;
        stage.style.setProperty('--stage-rot-x', `${stageTiltX}deg`);
        stage.style.setProperty('--stage-rot-y', `${stageTiltY}deg`);
      }

      // Center card subtle parallax & float
      const centerCard = centerCardRef.current;
      if (centerCard) {
        const floatY = Math.sin(elapsed * 1.5) * 5;
        const centerParallaxX = m.x * 10 * parallaxStrength + d.rotY * 0.4;
        const centerParallaxY = m.y * 8 * parallaxStrength - d.rotX * 0.4;
        centerCard.style.setProperty('--card-float-y', `${floatY}px`);
        centerCard.style.setProperty('--card-para-x', `${centerParallaxX}px`);
        centerCard.style.setProperty('--card-para-y', `${centerParallaxY}px`);
      }

      // Surrounding cards individual depth parallax & float
      const orbitCards = orbitCardsRef.current;
      orbitCards.forEach((cardEl, idx) => {
        if (!cardEl) return;
        const cardData = ORBIT_CARDS[idx];
        const fDelay = cardData.floatDelay || 0;
        const pFactor = cardData.parallaxFactor || 1;

        // Individual float frequency and phase
        const floatY = Math.sin(elapsed * 1.4 + fDelay) * 7;
        const floatRot = Math.cos(elapsed * 1.2 + fDelay) * 1.2;

        // Outer cards move noticeably more than center card
        const cardParallaxX = m.x * 28 * pFactor * parallaxStrength + d.rotY * (0.8 * pFactor);
        const cardParallaxY = m.y * 22 * pFactor * parallaxStrength - d.rotX * (0.8 * pFactor);

        cardEl.style.setProperty('--card-float-y', `${floatY}px`);
        cardEl.style.setProperty('--card-float-rot', `${floatRot}deg`);
        cardEl.style.setProperty('--card-para-x', `${cardParallaxX}px`);
        cardEl.style.setProperty('--card-para-y', `${cardParallaxY}px`);
      });

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalized mouse coordinates: -1 to 1
    const nx = (clientX / innerWidth - 0.5) * 2;
    const ny = (clientY / innerHeight - 0.5) * 2;

    mousePosRef.current.targetX = nx;
    mousePosRef.current.targetY = ny;

    // Drag tracking if mouse is down
    const d = dragPosRef.current;
    if (d.isDragging) {
      const deltaX = clientX - d.startX;
      const deltaY = clientY - d.startY;
      d.targetRotY = Math.max(-25, Math.min(25, d.targetRotY + deltaX * 0.08));
      d.targetRotX = Math.max(-20, Math.min(20, d.targetRotX - deltaY * 0.08));
      d.startX = clientX;
      d.startY = clientY;
    }
  }, []);

  // Pointer drag start
  const handlePointerDown = (e) => {
    const d = dragPosRef.current;
    d.isDragging = true;
    d.startX = e.clientX;
    d.startY = e.clientY;
  };

  // Pointer drag end
  const handlePointerUp = () => {
    const d = dragPosRef.current;
    d.isDragging = false;
    // Gradually return drag tilt towards neutral
    d.targetRotX = 0;
    d.targetRotY = 0;
  };

  return (
    <section
      ref={containerRef}
      className="hero-scroll-container"
      id="hero"
      onMouseMove={handleMouseMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* ── STICKY VIEWPORT FRAME (100VH) ── */}
      <div ref={stickyRef} className="hero-sticky-frame">
        {/* Background Atmosphere & Ambient Lighting */}
        <div className="hero__bg-atmosphere">
          <div className="hero__ambient-radial" />
          <div className="hero__ambient-spotlight" />
          <div className="hero__microgrid" />
        </div>

        {/* ── 3D PERSPECTIVE STAGE ── */}
        <div ref={stageRef} className="hero__3d-stage">
          {/* Subtle 3D Orbital Lines (Concentric Ellipses behind cards) */}
          <div ref={orbitLinesRef} className="hero__orbit-lines-container">
            <svg
              className="hero__orbit-svg"
              viewBox="0 0 1000 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Orbit Ellipse */}
              <ellipse
                cx="500"
                cy="300"
                rx="460"
                ry="210"
                stroke="url(#orbitGradient1)"
                strokeWidth="1.2"
                strokeDasharray="6 8"
                opacity="0.5"
              />
              {/* Mid Orbit Ellipse */}
              <ellipse
                cx="500"
                cy="300"
                rx="350"
                ry="160"
                stroke="url(#orbitGradient2)"
                strokeWidth="1"
                opacity="0.6"
              />
              {/* Inner Orbit Ellipse */}
              <ellipse
                cx="500"
                cy="300"
                rx="240"
                ry="110"
                stroke="url(#orbitGradient3)"
                strokeWidth="0.8"
                strokeDasharray="4 6"
                opacity="0.4"
              />

              {/* Glowing Orbit Nodes */}
              <circle cx="160" cy="240" r="3.5" fill="#3b82f6" filter="url(#glow1)" />
              <circle cx="830" cy="250" r="3" fill="#60a5fa" filter="url(#glow1)" />
              <circle cx="280" cy="410" r="2.5" fill="#38bdf8" filter="url(#glow1)" />
              <circle cx="730" cy="400" r="3.5" fill="#2563eb" filter="url(#glow1)" />
              <circle cx="500" cy="140" r="3" fill="#60a5fa" filter="url(#glow1)" />

              <defs>
                <linearGradient id="orbitGradient1" x1="40" y1="300" x2="960" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" stopOpacity="0.05" />
                  <stop offset="0.3" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="0.7" stopColor="#60a5fa" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="orbitGradient2" x1="150" y1="300" x2="850" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563eb" stopOpacity="0.1" />
                  <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#2563eb" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="orbitGradient3" x1="260" y1="300" x2="740" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" stopOpacity="0.1" />
                  <stop offset="0.5" stopColor="#60a5fa" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#60a5fa" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow1" x="-10" y="-10" width="30" height="30" filterUnits="userSpaceOnUse">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* ── CARDS WRAPPER (In 3D Space) ── */}
          <div className="hero__cards-3d-wrap">

            {/* ── 1. CENTER NEXORA HERO CARD ── */}
            <div
              ref={centerCardRef}
              className="hero__card hero__card--center"
              aria-label="Nexora Brand Identity & Visual Design Portfolio Piece"
            >
              {/* Glass Specular Glint */}
              <div className="hero__card-glint" />

              {/* Ambient Blue Backlight Aura */}
              <div className="hero__card-aura" />

              {/* Card Inner Content */}
              <div className="hero__card-inner">
                {/* Header Brand */}
                <div className="hero__card-header">
                  <span className="hero__card-brand-logo">NEXORA</span>
                  <span className="hero__card-chip">2026</span>
                </div>

                {/* Central Visual Artwork (Electric blue fluid loop) */}
                <div className="hero__card-media hero__card-media--center">
                  <img
                    src={nexoraCenterImg}
                    alt="Nexora 3D Visual Design Artwork"
                    className="hero__card-img"
                    loading="eager"
                  />
                  <div className="hero__card-media-overlay" />
                </div>

                {/* Card Footer Metadata */}
                <div className="hero__card-footer">
                  <div className="hero__card-footer-info">
                    <span className="hero__card-cat-title">Brand Identity</span>
                    <span className="hero__card-cat-sub">&amp; Visual Design</span>
                  </div>
                  <div className="hero__card-num">01</div>
                </div>
              </div>
            </div>

            {/* ── 2. SURROUNDING 5 ORBITING PORTFOLIO CARDS ── */}
            {ORBIT_CARDS.map((card, idx) => (
              <div
                key={card.id}
                ref={(el) => (orbitCardsRef.current[idx] = el)}
                className={`hero__card hero__card--orbit hero__card--${card.id}`}
                aria-label={`${card.title} - ${card.category}`}
              >
                {/* Specular Edge Highlight */}
                <div className="hero__card-glint" />

                {/* Card Inner Frame */}
                <div className="hero__card-inner">
                  {/* Card Top Label */}
                  <div className="hero__card-header">
                    <span className="hero__card-title-sm">{card.title}</span>
                    <span className="hero__card-num">{card.number}</span>
                  </div>

                  {/* Artwork Showcase */}
                  <div className="hero__card-media">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="hero__card-img"
                      loading="lazy"
                    />
                    <div className="hero__card-media-overlay" />
                  </div>

                  {/* Card Footer */}
                  <div className="hero__card-footer">
                    <span className="hero__card-meta-cat">{card.category}</span>
                    <span className="hero__card-meta-dot">●</span>
                    <span className="hero__card-meta-sub">{card.subtitle}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>{/* .hero__cards-3d-wrap */}
        </div>{/* .hero__3d-stage */}

        {/* ── LEFT — INTRO CONTENT (Clean HTML/UI, NOT part of 3D Scene) ── */}
        <div ref={leftContentRef} className="hero__left-content">
          {/* Small Category Label */}
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            <span className="hero__eyebrow-text">Graphic Designer</span>
          </div>

          {/* Main Display Heading */}
          <h1 className="hero__heading">
            <span className="hero__heading-line">Turning Ideas</span>
            <span className="hero__heading-line">
              into <span className="hero__heading-accent">Visual</span>
            </span>
            <span className="hero__heading-line">Experiences</span>
          </h1>

          {/* Supporting Statement */}
          <p className="hero__desc">
            I'm a graphic designer focused on creating bold visuals, clean designs and memorable brand experiences.
          </p>

          {/* Bottom Scroll Indicator */}
          <div className="hero__scroll-indicator" aria-hidden="true">
            <div className="hero__scroll-pill">
              <span className="hero__scroll-dot" />
            </div>
            <span className="hero__scroll-text">Scroll to explore</span>
          </div>
        </div>

        {/* ── INTERACTION HINT (Drag to rotate / Mouse parallax) ── */}
        <div
          ref={hintRef}
          className={`hero__interaction-hint ${isInteractive ? 'hero__interaction-hint--active' : ''}`}
        >
          <svg
            className="hero__hint-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9l6 6-6 6" />
            <path d="M4 4v7a4 4 0 0 0 4 4h11" />
          </svg>
          <span>Drag to rotate</span>
        </div>

      </div>{/* .hero-sticky-frame */}
    </section>
  );
};

export default Hero;
