import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

import avatarTechnis from '../assets/avatar_technis_1786869124435.jpg';
import avatarLuxury from '../assets/avatar_luxury_1786869145501.jpg';
import avatarCredible from '../assets/avatar_credible_1786869168589.jpg';
import avatarFastResume from '../assets/avatar_fastresume_1786869197082.jpg';
import avatarVentigence from '../assets/avatar_ventigence_1786869228454.jpg';

import './ClientStories.css';

/* ── CLIENT STORIES REPERTOIRE DATA ── */
const STORIES = [
  {
    id: 'aura-luxury-maison',
    indexStr: '01',
    name: 'AURA LUXURY MAISON',
    sector: 'Luxury Maison & Bespoke Packaging',
    metric: '+185% Retail Sell-Through',
    metricLabel: 'Bespoke Packaging Impact',
    highlight: 'Custom Embossing & Foil Monogram',
    quote:
      'Their visual architecture transformed Aura into an internationally recognized luxury maison. From the tactile copper-foil boxes to the bespoke logotype, every detail speaks of refined elegance and timeless prestige.',
    author: 'Elena Rostova',
    role: 'Creative Director',
    location: 'Milan, Italy',
    rating: 5,
    avatar: avatarLuxury,
  },
  {
    id: 'apex-design-labs',
    indexStr: '02',
    name: 'APEX DESIGN LABS',
    sector: 'Design Agency & Custom Typography',
    metric: 'Complete Visual Identity System',
    metricLabel: 'Cross-Platform Cohesion',
    highlight: 'Bespoke Geometric Display Typeface',
    quote:
      'Working with them was transformative. They did not just design a logo; they crafted an entire visual vernacular including a bespoke headline typeface that gave our technology agency instant global authority and clarity.',
    author: 'Arthur Vance',
    role: 'Founder & Partner',
    location: 'London, UK',
    rating: 5,
    avatar: avatarCredible,
  },
  {
    id: 'chrono-geneve',
    indexStr: '03',
    name: 'CHRONO GENÈVE',
    sector: 'Luxury Horology & Editorial Design',
    metric: '320-Page Hardcover Monograph',
    metricLabel: 'Museum-Grade Swiss Typography',
    highlight: 'Tactile Cotton Paper & Custom Grids',
    quote:
      'The craftsmanship in our centenary monograph was breathtaking. The mathematical precision of their Swiss typographic grid and exquisite tactile paper curation earned praise from master watchmakers and collectors across Switzerland.',
    author: 'David Chen',
    role: 'Head of Brand Heritage',
    location: 'Geneva, Switzerland',
    rating: 5,
    avatar: avatarFastResume,
  },
  {
    id: 'technis-ventures',
    indexStr: '04',
    name: 'TECHNIS VENTURES',
    sector: 'Venture Capital & Digital Design Systems',
    metric: '400+ Figma Components & Tokens',
    metricLabel: 'System Adoption across 12 Portfolios',
    highlight: 'Modular Responsive Iconography',
    quote:
      'The design system they developed revolutionized how our 12 portfolio companies present themselves. Scalable vector marks, meticulous token architecture, and flawless digital guidelines delivered ahead of schedule.',
    author: 'Jean-Baptiste Biolay',
    role: 'Principal Designer',
    location: 'Tokyo, Japan',
    rating: 5,
    avatar: avatarTechnis,
  },
  {
    id: 'ventigence-festival',
    indexStr: '05',
    name: 'VENTIGENCE FILM FESTIVAL',
    sector: 'Cultural Festival & Spatial Posters',
    metric: '60+ Large-Format Print Assets',
    metricLabel: 'International Festival Identity',
    highlight: 'Silk-Screened Typographic Series',
    quote:
      'The festival visual identity stopped people in the streets of Zurich. Their large-format silk-screened posters and animated kinetic billboard typography brought thousands of film lovers to our screenings.',
    author: 'Viktor Rostov',
    role: 'Festival Art Director',
    location: 'Zurich, Switzerland',
    rating: 5,
    avatar: avatarVentigence,
  },
];

/* ── Interactive Cosmic Background Canvas ── */
const CosmicStoriesCanvas = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mousePos.current.targetX = x * 35;
      mousePos.current.targetY = y * 35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate particles (stars & glowing cyber dust)
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.45 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.2,
      isCyan: Math.random() > 0.65,
    }));

    const render = () => {
      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render drifting particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.twinklePhase += p.twinkleSpeed;
        const alpha = Math.max(
          0.05,
          p.baseAlpha + Math.sin(p.twinklePhase) * 0.25
        );

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const posX = p.x + mousePos.current.x * (p.size * 0.4);
        const posY = p.y + mousePos.current.y * (p.size * 0.4);

        ctx.beginPath();
        ctx.arc(posX, posY, p.size, 0, Math.PI * 2);

        if (p.isCyan) {
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="cs__space-canvas" />;
};

const ClientStories = () => {
  const [currentIndex, setCurrentIndex] = useState(3); // Start with TECHNIS SPATIAL
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  // Card 3D tilt coordinates
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // 3D Perspective Scroll-Linked Entrance Animation (Matching Key Facts entrance)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [16, 0]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-3, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.85, 1]);
  const translateZ = useTransform(smoothProgress, [0, 1], [-200, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.25, 1], [0, 0.7, 1]);
  const y = useTransform(smoothProgress, [0, 1], [90, 0]);

  const currentStory = STORIES[currentIndex];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? STORIES.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === STORIES.length - 1 ? 0 : prev + 1));
  }, []);

  // Auto-play timer (advances every 7 seconds, pauses on card hover or manual pause)
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, handleNext]);

  // Card Interactive 3D Tilt on Mouse Move
  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -5;
    const ry = ((x - centerX) / centerX) * 5;
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;
    setTilt({ rx, ry, gx, gy });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
    setIsHovered(false);
  };

  return (
    <section id="stories" ref={sectionRef} className="cs__section">
      {/* ── Dynamic Cosmic Particle Canvas ── */}
      <CosmicStoriesCanvas />

      {/* ── Atmospheric Cosmic Nebulae & Radial Glows ── */}
      <div className="cs__ambient-glows" pointer-events="none">
        <div className="cs__glow cs__glow--blue" />
        <div className="cs__glow cs__glow--cyan" />
        <div className="cs__glow cs__glow--violet" />
      </div>

      <div className="cs__perspective-stage">
        <motion.div
          className="cs__animated-container"
          style={{
            rotateX,
            rotateY,
            scale,
            translateZ,
            opacity,
            y,
          }}
        >
          <div className="cs__container">
            {/* ── TOP BADGE & SECTION HEADER ── */}
            <motion.div
              className="cs__header-row"
              initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="cs__title-col">
                <div className="cs__category-pill">
                  <span className="cs__pill-pulse" />
                  <span className="cs__pill-text">04 // CLIENT VOICES & RESULTS</span>
                </div>
                <motion.h2
                  className="cs__main-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  Client <span className="cs__title-gradient">stories</span>
                </motion.h2>
              </div>

              <div className="cs__subtitle-col">
                <p className="cs__subtitle-text">
                  Strategic design direction and unforgettable visual identities built in close collaboration with visionary brands worldwide.
                </p>
                <div className="cs__header-metrics">
                  <div className="cs__metric-chip">
                    <span className="cs__chip-val">48+</span>
                    <span className="cs__chip-lbl">Design Awards</span>
                  </div>
                  <div className="cs__metric-chip">
                    <span className="cs__chip-val">100%</span>
                    <span className="cs__chip-lbl">Client Retention</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── TECHNICAL DIVIDER WITH CENTER CYBER CROSSHAIR ── */}
            <div className="cs__divider-wrap">
              <div className="cs__divider-line" />
              <div className="cs__crosshair-badge">
                <span className="cs__crosshair">+</span>
                <span className="cs__crosshair-code">ST-04 // VERIFIED TESTIMONIALS</span>
                <span className="cs__crosshair">+</span>
              </div>
            </div>

            {/* ── MAIN TWO-COLUMN CONTENT GRID ── */}
            <div className="cs__content-grid">
              {/* ── LEFT COLUMN: Interactive Client Navigation ── */}
              <div className="cs__left-col">
                <div className="cs__list-header">
                  <span className="cs__list-caption">SELECT CLIENT SHOWCASE</span>
                  <span className="cs__list-count">
                    [{String(currentIndex + 1).padStart(2, '0')} / {String(STORIES.length).padStart(2, '0')}]
                  </span>
                </div>

                <div className="cs__client-list" role="tablist">
                  {STORIES.map((item, index) => {
                    const isActive = index === currentIndex;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        className={`cs__client-btn ${
                          isActive ? 'cs__client-btn--active' : ''
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      >
                        {/* Background slider animation */}
                        {isActive && (
                          <motion.div
                            layoutId="csActiveIndicator"
                            className="cs__client-btn-glow"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 32,
                            }}
                          />
                        )}

                        <span className="cs__btn-num">{item.indexStr}</span>
                        <div className="cs__btn-info">
                          <span className="cs__client-name">{item.name}</span>
                          <span className="cs__client-sector">{item.sector}</span>
                        </div>

                        <span className="cs__btn-indicator">
                          {isActive ? (
                            <motion.span
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="cs__btn-arrow"
                            >
                              →
                            </motion.span>
                          ) : (
                            <span className="cs__btn-dot">·</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Interactive Navigation Arrows & Auto-Play Progress */}
                <div className="cs__nav-controls">
                  <div className="cs__nav-buttons">
                    <button
                      className="cs__nav-btn"
                      onClick={handlePrev}
                      aria-label="Previous story"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </button>
                    <button
                      className="cs__nav-btn"
                      onClick={handleNext}
                      aria-label="Next story"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>

                  {/* Auto-Play Toggle & Progress Bar */}
                  <div className="cs__autoplay-wrap">
                    <button
                      className={`cs__autoplay-toggle ${isAutoPlay ? 'cs__autoplay--active' : ''}`}
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      title={isAutoPlay ? 'Pause auto-rotation' : 'Resume auto-rotation'}
                    >
                      {isAutoPlay ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    <div className="cs__progress-track">
                      <motion.div
                        key={`${currentIndex}-${isAutoPlay}`}
                        className="cs__progress-bar"
                        initial={{ width: '0%' }}
                        animate={{ width: isAutoPlay && !isHovered ? '100%' : '0%' }}
                        transition={{
                          duration: 7,
                          ease: 'linear',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: 3D Testimonial Showcase Card ── */}
              <div className="cs__right-col">
                <div
                  ref={cardRef}
                  className="cs__showcase-card"
                  onMouseMove={handleCardMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    '--glare-x': `${tilt.gx}%`,
                    '--glare-y': `${tilt.gy}%`,
                  }}
                >
                  {/* Subtle glare reflection on hover */}
                  <div className="cs__card-glare" />

                  {/* Top Card Meta Row: Quote Glyphs & Impact Metric Pill */}
                  <div className="cs__card-top-row">
                    <div className="cs__quote-badge">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="cs__quote-icon">
                        <path
                          d="M9.13 14.15C9.13 11.23 7.82 9.53 5.48 9.53C5.07 9.53 4.69 9.61 4.38 9.77C4.69 7.03 6.94 4.8 9.74 4.8V2C5.46 2 2 5.46 2 9.74V17.06C2 19.24 3.76 21 5.94 21C8.12 21 9.88 19.24 9.88 17.06C9.88 16.03 9.49 15.08 8.84 14.37C9.02 14.28 9.13 14.21 9.13 14.15ZM21.25 14.15C21.25 11.23 19.94 9.53 17.6 9.53C17.19 9.53 16.81 9.61 16.5 9.77C16.81 7.03 19.06 4.8 21.86 4.8V2C17.58 2 14.12 5.46 14.12 9.74V17.06C14.12 19.24 15.88 21 18.06 21C20.24 21 22 19.24 22 17.06C22 16.03 21.61 15.08 20.96 14.37C21.14 14.28 21.25 14.21 21.25 14.15Z"
                          fill="url(#quoteGrad)"
                        />
                        <defs>
                          <linearGradient id="quoteGrad" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#38bdf8" />
                            <stop offset="1" stopColor="#818cf8" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="cs__quote-verified-pill">
                        <span className="cs__dot-green" />
                        Verified Case Study
                      </span>
                    </div>

                    <div className="cs__impact-pill">
                      <span className="cs__impact-icon">⚡</span>
                      <span className="cs__impact-text">{currentStory.metric}</span>
                    </div>
                  </div>

                  {/* Testimonial Quote Animated Switcher */}
                  <div className="cs__quote-wrapper">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStory.id}
                        className="cs__quote-content"
                        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                        transition={{
                          duration: 0.38,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <p className="cs__quote-text">
                          "{currentStory.quote}"
                        </p>

                        {/* Author Bio & Rating Footer */}
                        <div className="cs__author-block">
                          <div className="cs__avatar-wrap">
                            <img
                              src={currentStory.avatar}
                              alt={currentStory.author}
                              className="cs__avatar-img"
                              loading="lazy"
                            />
                            <div className="cs__avatar-ring" />
                          </div>

                          <div className="cs__author-details">
                            <div className="cs__author-name-row">
                              <span className="cs__author-name">
                                {currentStory.author}
                              </span>
                              <span className="cs__author-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Verified
                              </span>
                            </div>
                            <span className="cs__author-role">
                              {currentStory.role}
                            </span>
                            <span className="cs__author-loc">
                              {currentStory.location}
                            </span>
                          </div>

                          {/* Star Rating & Highlight Metric */}
                          <div className="cs__rating-box">
                            <div className="cs__stars">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="cs__star">★</span>
                              ))}
                            </div>
                            <span className="cs__highlight-tag">
                              {currentStory.highlight}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom Card Footer with Direct Dot Jumpers & CTA */}
                  <div className="cs__card-bottom-row">
                    <div className="cs__dots-indicator">
                      {STORIES.map((_, i) => (
                        <button
                          key={i}
                          className={`cs__dot-jump ${i === currentIndex ? 'cs__dot-jump--active' : ''}`}
                          onClick={() => setCurrentIndex(i)}
                          aria-label={`Go to story ${i + 1}`}
                        />
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className="cs__cta-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('contact') || document.querySelector('.footer');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span className="cs__cta-label">START YOUR PROJECT</span>
                      <span className="cs__cta-arrow-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientStories;
