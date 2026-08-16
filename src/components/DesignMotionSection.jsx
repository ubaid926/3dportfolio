import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import cardOrangeAi from '../assets/card_orange_ai.jpg';
import avatarLuxury from '../assets/avatar_luxury_1786869145501.jpg';
import avatarCredible from '../assets/avatar_credible_1786869168589.jpg';
import avatarFastResume from '../assets/avatar_fastresume_1786869197082.jpg';
import avatarVentigence from '../assets/avatar_ventigence_1786869228454.jpg';
import avatarTechnis from '../assets/avatar_technis_1786869124435.jpg';
import lionTrophy from '../assets/lion_trophy.png';
import './DesignMotionSection.css';

/* =========================================================
   EXPLORATIONS DATA (HIGH-FIDELITY EDITORIAL CARDS)
   ========================================================= */
const EXPLORATION_CARDS = [
  {
    id: 'exp-headphone',
    type: 'headphone',
    number: '02',
    title: 'DESIGNED FOR EVERY NOISE',
    subtitle: 'Acoustic Engineering & Spatial UI',
    tagline: 'ACOUSTIC FIDELITY',
    category: 'Spatial Audio / 3D',
    year: '2025',
    client: 'Aether Soundworks',
    description:
      'A spatial sound visualizer that translates acoustic frequency sweeps into real-time WebGL mesh deformation with custom audio-reactive shaders.',
    tags: ['WebGL', 'Spatial Audio', 'Three.js', 'Shader Graph'],
    bgType: 'dark',
  },
  {
    id: 'exp-novaglam',
    type: 'novaglam',
    number: '03',
    title: 'NOVAGLAM VINTAGE FASHION STUDIO',
    subtitle: 'Direct-to-Avatar Editorial',
    tagline: 'VINTAGE EDITORIAL',
    category: 'Fashion & Identity',
    year: '2026',
    client: 'NovaGlam Paris',
    image: avatarLuxury,
    description:
      'An interactive digital fashion house blending vintage 1970s couture aesthetics with generative neural rendering and realtime fabric physics.',
    tags: ['Digital Couture', 'Generative AI', 'Lookbook UI'],
    bgType: 'pink',
  },
  {
    id: 'exp-orange-ai',
    type: 'orange-ai',
    number: '04',
    title: 'LOOSE SKETCHES TO VISUALIZATIONS',
    subtitle: 'Generative Latent Workspace',
    tagline: 'AI LATENT PIPELINE',
    category: 'Generative AI & Interface',
    year: '2026',
    client: 'Trionn Creative Lab',
    image: cardOrangeAi,
    description:
      'A multi-modal AI design tool that transforms raw hand-drawn wireframes and loose napkin sketches into high-fidelity 3D spatial renders in real time.',
    tags: ['Generative AI', 'Latent Diffusion', 'Creative Suite', 'React 19'],
    bgType: 'orange-editorial',
  },
  {
    id: 'exp-imagination',
    type: 'beige-sculpture',
    number: '05',
    title: 'WE BRING IMAGINATION TO LIFE',
    subtitle: 'Spatial Architectural Deck',
    tagline: 'SPATIAL ARCHITECTURE',
    category: 'Spatial 3D & WebXR',
    year: '2025',
    client: 'Studio Morph',
    image: avatarCredible,
    description:
      'Immersive digital showcase exploring organic architectural forms, volumetric natural lighting, and tactile material interactions on the web.',
    tags: ['Three.js', 'Spatial UI', 'Architecture', 'WebXR'],
    bgType: 'beige',
  },
  {
    id: 'exp-cyberverse',
    type: 'cyberverse',
    number: '06',
    title: 'CYBERVERSE DIGITAL AVATAR RUNWAY',
    subtitle: 'Real-time Cloth Simulation & Metaverse',
    tagline: 'DIGITAL IDENTITY',
    category: 'Virtual Runway',
    year: '2026',
    client: 'CyberVerse Lab',
    image: avatarVentigence,
    description:
      'Interactive 3D runway presentation featuring high-density cloth simulation and procedural lighting choreography for next-gen digital fashion.',
    tags: ['GLSL Shaders', 'Cloth Sim', 'Avatar Tech', 'WebGL'],
    bgType: 'dark',
  },
  {
    id: 'exp-quantum',
    type: 'quantum',
    number: '07',
    title: 'QUANTUM NEURAL GRAPH ENGINE',
    subtitle: 'Node-Based Autonomous Intelligence',
    tagline: 'NEURAL WORKFLOWS',
    category: 'AI Platform',
    year: '2026',
    client: 'Quantum AI Systems',
    image: avatarFastResume,
    description:
      'Node-based generative engine empowering creative teams to orchestrate autonomous AI agents, latent pipelines, and real-time inference graphs.',
    tags: ['Autonomous Agents', 'Node Graph', 'Data Visualization'],
    bgType: 'dark',
  },
  {
    id: 'exp-vanguard',
    type: 'vanguard',
    number: '08',
    title: 'VANGUARD SUSTAINABLE HABITAT',
    subtitle: '3D Photorealistic Interactive Deck',
    tagline: 'BIOPHILIC DESIGN',
    category: 'Sustainable Tech',
    year: '2025',
    client: 'Vanguard Group',
    image: avatarTechnis,
    description:
      'Photorealistic WebGL walkthrough of zero-emission biophilic urban habitats with daylight simulation and live energy telemetry.',
    tags: ['Interactive 3D', 'Sustainability', 'Digital Twin'],
    bgType: 'beige',
  },
];

/* =========================================================
   3D RIBBON PARAMETRIC CURVE MATHEMATICS
   ========================================================= */
const calculateCard3D = (u, isMobile) => {
  // u: Normalized position along ribbon (-1.2 = left offscreen, 0 = center focal point, +1.2 = right offscreen)
  const mobileFactor = isMobile ? 0.78 : 1.0;

  // 1. Horizontal X translation
  const x = u * (isMobile ? 38 : 46); // vw

  // 2. Vertical Y translation: Swooping upward arch
  // Left is lower (+16vh), center is elevated (-4vh), right is (+12vh)
  const y = -Math.cos(u * 1.5) * (14 * mobileFactor) + u * (6 * mobileFactor) + (8 * mobileFactor); // vh

  // 3. Z-Depth: Center card punches forward, edges recede
  // Gaussian bell curve peak at u = 0
  const z = Math.max(-550, 200 * Math.exp(-Math.pow(u / 0.62, 2)) - 320 * Math.abs(u)); // px

  // 4. Rotations (Twisted spatial arc)
  // rotateY (Yaw): Cards on left face right, center faces front, cards on right face left
  const rotateY = -u * (isMobile ? 36 : 42) - 4; // deg
  
  // rotateX (Pitch): Slight backward tilt on left, forward on right
  const rotateX = -u * 10 - 2; // deg
  
  // rotateZ (Roll): Swooping ribbon twist
  const rotateZ = u * (isMobile ? 12 : 15) - 3; // deg

  // 5. Scale: Center focal card is 1.16x, edges 0.65x
  const scale = Math.max(0.56, 1.15 - 0.48 * Math.pow(Math.min(Math.abs(u), 1.25), 1.4));

  // 6. Opacity: Smooth falloff at extremes
  const absU = Math.abs(u);
  let opacity = 1;
  if (absU > 0.85) {
    opacity = Math.max(0, 1 - (absU - 0.85) / 0.35);
  }

  // 7. Z-Index: Proportional to Z-depth for perfect layering
  const zIndex = Math.round(z + 1000);

  return {
    transform: `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
    opacity,
    zIndex,
  };
};

/* =========================================================
   INDIVIDUAL 3D CARD COMPONENT
   ========================================================= */
const RibbonCard = ({ card, index, progress, isMobile, onSelectCard }) => {
  // Spacing between consecutive cards along the ribbon
  const cardSpacing = isMobile ? 0.36 : 0.32;
  // Focus offset: card #2 (Orange AI) starts centered near progress 0.3 - 0.5
  const centerIndex = 2.0;
  // Total scroll travel multiplier
  const scrollRange = isMobile ? 2.6 : 2.8;

  const u = (index - centerIndex) * cardSpacing - (progress - 0.45) * scrollRange;
  const style3D = calculateCard3D(u, isMobile);

  const isFocal = Math.abs(u) < 0.22;

  return (
    <div
      className={`dm__card-anchor ${isFocal ? 'dm__card-anchor--active' : ''}`}
      style={{
        transform: style3D.transform,
        opacity: style3D.opacity,
        zIndex: style3D.zIndex,
      }}
      onClick={() => onSelectCard(card)}
      role="button"
      tabIndex={0}
    >
      <div className="dm__card-body">
        {/* Render Customized Card Content Based on Type */}
        {card.type === 'orange-ai' ? (
          /* Signature Orange AI Editorial Card Matching Reference */
          <div className="dm__card-content--orange">
            <div className="dm__orange-col-left">
              <div className="dm__orange-ai-badge">
                <span>AI</span>
                <span className="dm__orange-ai-line" />
              </div>
              <div className="dm__orange-quote-box">
                <span className="dm__quote-mark">“</span>
                <p className="dm__orange-quote-text">
                  CREATIVE EXPERIMENTS &amp; LATENT WORKFLOWS
                </p>
              </div>
            </div>

            <div className="dm__orange-col-center">
              <img
                src={card.image}
                alt={card.title}
                className="dm__orange-img"
                loading="eager"
              />
            </div>

            <div className="dm__orange-col-right">
              <div className="dm__orange-bold-heading">
                LOOSE
                <br />
                SKETCHES
                <br />
                TO
                <br />
                VISUALIZATIONS
              </div>
              <div className="dm__orange-meta-bottom">
                <span>2026</span>
                <span className="dm__copyright-icon">©</span>
              </div>
            </div>
          </div>
        ) : card.type === 'headphone' ? (
          /* Spatial Headphone Card */
          <div className="dm__card-headphone-layout">
            <div className="dm__hp-top-badge">
              <span>{card.number}</span>
              <span>—</span>
              <span>{card.tagline}</span>
            </div>
            <div className="dm__hp-hero-title">{card.title}</div>
            <div className="dm__hp-bottom">
              <span className="dm__hp-tag">3D WEBGL</span>
              <span>{card.year}</span>
            </div>
          </div>
        ) : card.type === 'novaglam' ? (
          /* NovaGlam Pink Studio Card */
          <div className="dm__card-novaglam-layout">
            <div className="dm__ng-year">2026</div>
            <div className="dm__ng-title">{card.title}</div>
            <div className="dm__hp-bottom">
              <span className="dm__hp-tag" style={{ background: '#331522', color: '#ffffff' }}>
                DIGITAL FASHION
              </span>
              <span>COUTURE</span>
            </div>
          </div>
        ) : card.type === 'beige-sculpture' ? (
          /* Beige Sculptural Card */
          <div className="dm__card-beige-layout">
            <div className="dm__hp-top-badge" style={{ color: '#6b5e54' }}>
              <span>{card.number}</span>
              <span>—</span>
              <span>{card.tagline}</span>
            </div>
            <div className="dm__beige-title">{card.title}</div>
            <div className="dm__hp-bottom" style={{ color: '#6b5e54' }}>
              <span className="dm__hp-tag" style={{ background: '#2b2520', color: '#ffffff' }}>
                SPATIAL 3D
              </span>
              <span>{card.year}</span>
            </div>
          </div>
        ) : (
          /* Generic Media Card Layout with High-res Visuals */
          <div className="dm__card-visual">
            <img
              src={card.image || cardOrangeAi}
              alt={card.title}
              className="dm__card-img"
              loading="eager"
            />
            <div className="dm__card-editorial-overlay">
              <div className="dm__hp-top-badge">
                <span>{card.number}</span>
                <span>—</span>
                <span>{card.category}</span>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {card.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.85 }}>
                  {card.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hover Pill Action */}
        <div className="dm__card-hover-pill">
          <span>EXPLORE</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN DESIGN MOTION SECTION COMPONENT
   ========================================================= */
const DesignMotionSection = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cookiesDismissed, setCookiesDismissed] = useState(false);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Framer Motion Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Spring physics for ultra-smooth cinematic interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 24,
    restDelta: 0.0005,
  });

  // Real-time progress updates to drive continuous ribbon calculations
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setCurrentProgress(Math.max(0, Math.min(1, latest)));
  });

  // Typography Motion Transforms
  // DESIGN moves left-to-right: starts at -32vw and glides to +48vw
  const designTranslateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? ['-38vw', '38vw'] : ['-32vw', '48vw']
  );

  // MOTION moves right-to-left: starts at +32vw and glides to -48vw
  const motionTranslateX = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? ['38vw', '-38vw'] : ['32vw', '-48vw']
  );

  // Ambient SVG path dash offset animation
  const svgDashOffset = useTransform(smoothProgress, [0, 1], [0, 600]);

  return (
    <section id="explorations" ref={containerRef} className="dm__outer-container">
      {/* ── 100vh Sticky Viewport Stage ── */}
      <div className="dm__sticky-stage">
        
        {/* ── Ambient Background Vector Lines (Trionn-style curved pencil loops) ── */}
        <svg className="dm__ambient-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          {/* Main looping arc */}
          <motion.path
            d="M-100,200 C300,50 600,450 1100,180 C1350,50 1550,300 1600,650"
            className="dm__ambient-path"
            style={{ strokeDashoffset: svgDashOffset }}
          />
          {/* Secondary counter arc */}
          <motion.path
            d="M-50,750 C400,600 750,850 1200,520 C1400,380 1500,200 1600,100"
            className="dm__ambient-path dm__ambient-path--secondary"
          />
        </svg>



        {/* ── Typography Stage (DESIGN & MOTION in Opposing Directions) ── */}
        <div className="dm__typo-stage">
          {/* Top Word: DESIGN (Moves Left -> Right) */}
          <div className="dm__typo-row">
            <motion.span
              className="dm__typo-word dm__typo-word--design"
              style={{ x: designTranslateX }}
            >
              DESIGN
            </motion.span>
          </div>

          {/* Centered Subtitle Tagline */}
          <div className="dm__tagline-center">
            <span className="dm__tagline-text">
              EXPLORING IDEAS THROUGH
              <br />
              DAILY DESIGN PRACTICE
            </span>
          </div>

          {/* Bottom Word: MOTION (Moves Right -> Left) */}
          <div className="dm__typo-row">
            <motion.span
              className="dm__typo-word dm__typo-word--motion"
              style={{ x: motionTranslateX }}
            >
              MOTION
            </motion.span>
          </div>
        </div>

        {/* ── 3D Twisted Card Ribbon Gallery ── */}
        <div className="dm__ribbon-stage">
          {EXPLORATION_CARDS.map((card, idx) => (
            <RibbonCard
              key={card.id}
              card={card}
              index={idx}
              progress={currentProgress}
              isMobile={isMobile}
              onSelectCard={(c) => setSelectedCard(c)}
            />
          ))}
        </div>

        {/* ── Bottom Section Metadata (Reference Style) ── */}
        <footer className="dm__bottom-bar">
          {/* Left Description */}
          <div className="dm__bottom-left-desc">
            Concepts, explorations, and interface experiments shared openly as part of our creative process.
          </div>

          {/* Center Interactive Cookie Notification Banner */}
          {!cookiesDismissed && (
            <div className="dm__bottom-center-cookie">
              <span className="dm__cookie-text">
                WE USE COOKIES TO ENHANCE YOUR EXPERIENCE.
              </span>
              <div className="dm__cookie-actions">
                <button
                  className="dm__cookie-btn"
                  onClick={() => setCookiesDismissed(true)}
                >
                  DECLINE
                </button>
                <button
                  className="dm__cookie-btn dm__cookie-btn--accept"
                  onClick={() => setCookiesDismissed(true)}
                >
                  ACCEPT
                </button>
              </div>
            </div>
          )}

          {/* Right Action CTA */}
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noopener noreferrer"
            className="dm__bottom-right-cta"
          >
            <span>VIEW ON DRIBBBLE</span>
            <svg
              className="dm__cta-arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </footer>
      </div>

      {/* ── Interactive Modal / QuickView Drawer ── */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="dm__modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="dm__modal-card"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="dm__modal-close-btn"
                onClick={() => setSelectedCard(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="dm__modal-visual">
                <img
                  src={selectedCard.image || cardOrangeAi}
                  alt={selectedCard.title}
                  className="dm__modal-img"
                />
              </div>

              <div className="dm__modal-info">
                <div>
                  <div className="dm__modal-header-tag">
                    {selectedCard.number} · {selectedCard.category}
                  </div>
                  <h3 className="dm__modal-title">{selectedCard.title}</h3>
                  <p className="dm__modal-desc">{selectedCard.description}</p>
                  
                  <div className="dm__modal-tags">
                    {selectedCard.tags.map((t) => (
                      <span key={t} className="dm__modal-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dm__modal-footer">
                  <span style={{ fontSize: '0.8rem', color: '#777777', fontWeight: 600 }}>
                    CLIENT: {selectedCard.client} ({selectedCard.year})
                  </span>
                  <a
                    href="#contact"
                    className="dm__pill-btn"
                    onClick={() => setSelectedCard(null)}
                  >
                    DISCUSS PROJECT →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DesignMotionSection;
