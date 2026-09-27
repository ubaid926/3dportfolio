import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import './KeyFacts.css';

/* ── Animated Stat Counter ── */
const AnimatedCounter = ({ from = 0, to, suffix = '+', duration = 1.8, trigger }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const shouldAnimate = trigger !== undefined ? trigger : inView;

  useEffect(() => {
    if (!shouldAnimate) return;
    let startTs = null;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / (duration * 1000), 1);
      const ep = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ep * (to - from) + from));
      if (p < 1) requestAnimationFrame(step);
      else setCount(to);
    };
    requestAnimationFrame(step);
  }, [shouldAnimate, from, to, duration]);

  return (
    <span ref={ref} className="kf__counter-num">
      {count}
      <sup className="kf__counter-sup">{suffix}</sup>
    </span>
  );
};

/* ── Animated Decimal Counter ── */
const AnimatedDecimalCounter = ({ to = 2.5, suffix = 'K+', duration = 1.8, trigger }) => {
  const [val, setVal] = useState('0.0');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const shouldAnimate = trigger !== undefined ? trigger : inView;

  useEffect(() => {
    if (!shouldAnimate) return;
    let startTs = null;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / (duration * 1000), 1);
      const ep = 1 - Math.pow(1 - p, 3);
      setVal((ep * to).toFixed(1));
      if (p < 1) requestAnimationFrame(step);
      else setVal(to.toFixed(1));
    };
    requestAnimationFrame(step);
  }, [shouldAnimate, to, duration]);

  return (
    <span ref={ref} className="kf__counter-num">
      {val}
      <sup className="kf__counter-sup">{suffix}</sup>
    </span>
  );
};

/* ── Deep Space Canvas with Stars & Nebula Dust ── */
const SpaceCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create starry particles
    const stars = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'rgba(210, 230, 255,' : 'rgba(255, 235, 210,',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw starry points
      stars.forEach((s) => {
        s.pulsePhase += s.pulseSpeed;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulsePhase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color} ${currentAlpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="kf__space-canvas" />;
};

/* ── 3D Rocket Illustration with Directional Thrust Flame ── */
const RocketIllustration = () => (
  <div className="kf__visual-wrap kf__visual-rocket">
    <div className="kf__rocket-aura" />
    <svg
      className="kf__rocket-svg"
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Flame Gradients */}
        <radialGradient id="flameCore" cx="70%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fffae0" />
          <stop offset="70%" stopColor="#ff9a3c" />
          <stop offset="100%" stopColor="#ff3d00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="flamePlume" x1="140" y1="130" x2="30" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#ffb03a" />
          <stop offset="60%" stopColor="#ff4500" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
        </linearGradient>
        {/* Metallic Chrome Gradients */}
        <linearGradient id="rocketBody" x1="110" y1="150" x2="220" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#f8fafc" />
          <stop offset="65%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="rocketFin" x1="120" y1="130" x2="150" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="windowGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Extended Zero-G Thrust Flame Trail */}
      <g filter="url(#flameGlow)">
        {/* Outer Flame Plume */}
        <path
          d="M135 145 C100 160 65 190 20 215 C60 170 85 140 120 130 Z"
          fill="url(#flamePlume)"
          opacity="0.85"
        />
        {/* Core Intense Fire */}
        <path
          d="M132 142 C105 155 75 180 40 200 C70 165 95 142 122 133 Z"
          fill="url(#flameCore)"
        />
        {/* Inner White-Hot Jet */}
        <path
          d="M130 140 C110 150 90 168 65 182 C85 158 105 142 122 135 Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </g>

      {/* Orbiting Orbital Streak Lines around Rocket */}
      <ellipse
        cx="160"
        cy="120"
        rx="95"
        ry="45"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        transform="rotate(-24 160 120)"
      />

      {/* Metallic Rocket Body */}
      <g className="kf__rocket-fuselage">
        {/* Bottom Fin */}
        <path
          d="M125 152 L105 185 L140 165 Z"
          fill="url(#rocketFin)"
        />
        {/* Top Fin */}
        <path
          d="M152 105 L175 75 L165 120 Z"
          fill="url(#rocketFin)"
        />
        {/* Main Sleek Fuselage */}
        <path
          d="M128 148 C145 158 175 148 205 118 C225 98 238 72 242 58 C228 62 202 75 182 95 C152 125 142 140 128 148 Z"
          fill="url(#rocketBody)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1"
        />
        {/* Center Wing Ridge */}
        <path
          d="M142 140 L120 160 L148 142 Z"
          fill="#475569"
        />
        {/* Chrome Porthole */}
        <circle cx="192" cy="98" r="9" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2.5" />
        <circle cx="192" cy="98" r="6" fill="url(#windowGlass)" />
        <circle cx="190" cy="96" r="2" fill="#ffffff" opacity="0.8" />
        {/* Exhaust Nozzle */}
        <ellipse cx="127" cy="148" rx="5" ry="9" fill="#1e293b" transform="rotate(35 127 148)" />
      </g>
    </svg>
  </div>
);

/* ── 3D Chrome Globe with Rotating Magnetic Field Arcs ── */
const GlobeIllustration = () => (
  <div className="kf__visual-wrap kf__visual-globe">
    <div className="kf__globe-aura" />
    <svg
      className="kf__globe-svg"
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="chromeSphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#e2e8f0" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="85%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <linearGradient id="arcGlow1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="arcGlow2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#f472b6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Swirling Magnetic Field Arcs (Multiple Inclinations) */}
      <ellipse
        cx="140"
        cy="120"
        rx="115"
        ry="48"
        stroke="url(#arcGlow1)"
        strokeWidth="1.8"
        strokeDasharray="6 4"
        transform="rotate(-20 140 120)"
        className="kf__magnetic-arc kf__magnetic-arc--1"
      />
      <ellipse
        cx="140"
        cy="120"
        rx="98"
        ry="65"
        stroke="url(#arcGlow2)"
        strokeWidth="1.5"
        transform="rotate(35 140 120)"
        className="kf__magnetic-arc kf__magnetic-arc--2"
      />
      <ellipse
        cx="140"
        cy="120"
        rx="125"
        ry="36"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.2"
        strokeDasharray="12 8"
        transform="rotate(-55 140 120)"
        className="kf__magnetic-arc kf__magnetic-arc--3"
      />

      {/* Luminous Particle Sparks along Orbit */}
      <circle cx="60" cy="100" r="2.5" fill="#38bdf8" />
      <circle cx="225" cy="140" r="3" fill="#f472b6" />
      <circle cx="170" cy="65" r="2" fill="#ffffff" />
      <circle cx="110" cy="175" r="2.5" fill="#93c5fd" />

      {/* Central 3D Chrome Planet / Globe */}
      <circle cx="140" cy="120" r="44" fill="url(#chromeSphere)" />

      {/* Stylized Chrome Landmass Silhouettes */}
      <path
        d="M125 95 C132 90 145 92 152 98 C158 104 165 106 160 114 C155 120 146 122 142 128 C138 135 128 140 122 135 C118 130 116 118 120 110 Z"
        fill="#ffffff"
        opacity="0.25"
      />
      <path
        d="M142 128 C148 132 155 130 162 135 C158 144 148 146 140 142 Z"
        fill="#ffffff"
        opacity="0.2"
      />

      {/* Specular Glint */}
      <ellipse cx="126" cy="102" rx="14" ry="9" fill="#ffffff" opacity="0.65" transform="rotate(-30 126 102)" />
    </svg>
  </div>
);

/* ── Exploded 3D Asset Layers in Zero-G ── */
const ExplodedAssetsIllustration = () => (
  <div className="kf__visual-wrap kf__visual-assets">
    <div className="kf__assets-aura" />
    <svg
      className="kf__assets-svg"
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="layerGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="layerGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="layerGrad3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Exploded Floating Isometric Sheets */}
      {/* Layer 4 (Bottom-most) */}
      <polygon
        points="140,165 195,140 140,115 85,140"
        fill="rgba(15, 23, 42, 0.7)"
        stroke="rgba(255, 255, 255, 0.18)"
        strokeWidth="1.2"
        className="kf__asset-sheet kf__asset-sheet--4"
      />

      {/* Layer 3 */}
      <polygon
        points="140,140 195,115 140,90 85,115"
        fill="url(#layerGrad3)"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1.2"
        className="kf__asset-sheet kf__asset-sheet--3"
      />

      {/* Layer 2 */}
      <polygon
        points="140,115 195,90 140,65 85,90"
        fill="url(#layerGrad2)"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.2"
        className="kf__asset-sheet kf__asset-sheet--2"
      />

      {/* Layer 1 (Top-most) */}
      <polygon
        points="140,90 195,65 140,40 85,65"
        fill="url(#layerGrad1)"
        stroke="#ffffff"
        strokeWidth="1.5"
        className="kf__asset-sheet kf__asset-sheet--1"
      />

      {/* Floating Design Tokens & App Chips floating in Zero-G */}
      {/* Ps chip */}
      <g className="kf__floating-chip kf__floating-chip--1" transform="translate(60, 68)">
        <rect width="26" height="26" rx="6" fill="#001e36" stroke="#00c8ff" strokeWidth="1.2" />
        <text x="13" y="17" fill="#00c8ff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Ps</text>
      </g>
      {/* Color Swatch Chip */}
      <g className="kf__floating-chip kf__floating-chip--2" transform="translate(200, 62)">
        <rect width="24" height="24" rx="5" fill="#18181b" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <circle cx="8" cy="8" r="3" fill="#ec4899" />
        <circle cx="16" cy="8" r="3" fill="#8b5cf6" />
        <circle cx="8" cy="16" r="3" fill="#3b82f6" />
        <circle cx="16" cy="16" r="3" fill="#10b981" />
      </g>
      {/* Component Chip */}
      <g className="kf__floating-chip kf__floating-chip--3" transform="translate(55, 145)">
        <rect width="24" height="24" rx="5" fill="rgba(30, 41, 59, 0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <polygon points="12,5 19,12 12,19 5,12" fill="#38bdf8" />
      </g>
      {/* Figma icon chip */}
      <g className="kf__floating-chip kf__floating-chip--4" transform="translate(205, 140)">
        <rect width="26" height="26" rx="6" fill="#111827" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="10" cy="10" r="3" fill="#f87171" />
        <circle cx="16" cy="10" r="3" fill="#fb923c" />
        <circle cx="10" cy="16" r="3" fill="#a78bfa" />
        <circle cx="16" cy="16" r="3" fill="#38bdf8" />
      </g>
    </svg>
  </div>
);

/* ── Kinetic Belt of Floating Glass Cubes ── */
const FloatingGlassCubesBelt = () => {
  // Pre-generate positions on an ellipse
  const cubes = useMemo(() => {
    const list = [];
    const count = 26;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const rx = 440; // width radius
      const ry = 85;  // height radius
      const x = Math.cos(angle) * rx;
      const y = Math.sin(angle) * ry;
      // Front cubes larger, back cubes smaller
      const zScale = 0.55 + 0.45 * ((Math.sin(angle) + 1) / 2);
      const size = Math.round(14 * zScale + 4);
      const opacity = 0.25 + 0.55 * zScale;
      const delay = (i * 0.15) % 3;
      list.push({ id: i, x, y, size, opacity, delay, zScale });
    }
    return list;
  }, []);

  return (
    <div className="kf__cubes-belt-container">
      {/* Glowing Orbital Trajectory Line */}
      <div className="kf__belt-orbit-ring" />

      {/* Floating 3D Cubes */}
      {cubes.map((c) => (
        <div
          key={c.id}
          className="kf__glass-cube"
          style={{
            transform: `translate3d(${c.x}px, ${c.y}px, 0px) scale(${c.zScale})`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            opacity: c.opacity,
            animationDelay: `${c.delay}s`,
          }}
        >
          <div className="kf__cube-facet kf__cube-front" />
          <div className="kf__cube-facet kf__cube-top" />
          <div className="kf__cube-facet kf__cube-side" />
        </div>
      ))}
    </div>
  );
};

/* ── Core Design Tools Icons Array ── */
const CoreDesignTools = () => {
  return (
    <div className="kf__core-tools-container">
      {/* Title */}
      <div className="kf__tools-header">
        <span className="kf__tools-line" />
        <span className="kf__tools-label">CORE DESIGN TOOLS</span>
        <span className="kf__tools-line" />
      </div>

      {/* Interactive Tool Floating Tiles */}
      <div className="kf__tools-row">
        {/* Photoshop */}
        <div className="kf__tool-badge kf__tool--ps" title="Adobe Photoshop">
          <span className="kf__tool-text">Ps</span>
        </div>

        {/* Illustrator */}
        <div className="kf__tool-badge kf__tool--ai" title="Adobe Illustrator">
          <span className="kf__tool-text">Ai</span>
        </div>

        {/* InDesign */}
        <div className="kf__tool-badge kf__tool--in" title="Adobe InDesign">
          <span className="kf__tool-text">In</span>
        </div>

        {/* InDesign ID */}
        <div className="kf__tool-badge kf__tool--id" title="InDesign Layouts">
          <span className="kf__tool-text">Id</span>
        </div>

        {/* After Effects */}
        <div className="kf__tool-badge kf__tool--afe" title="Adobe After Effects">
          <span className="kf__tool-text">Afe</span>
        </div>

        {/* Figma */}
        <div className="kf__tool-badge kf__tool--figma" title="Figma UI / Vector">
          <div className="kf__figma-mark">
            <span className="kf__figma-dot kf__figma-r1" />
            <span className="kf__figma-dot kf__figma-r2" />
            <span className="kf__figma-dot kf__figma-m1" />
            <span className="kf__figma-dot kf__figma-m2" />
            <span className="kf__figma-dot kf__figma-b1" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN ANTI-GRAVITY KEY FACTS COMPONENT
   ══════════════════════════════════════════════════════ */
const KeyFacts = () => {
  const sectionRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse Parallax for Zero-G Levitation
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const nx = (clientX / innerWidth - 0.5) * 2;
    const ny = (clientY / innerHeight - 0.5) * 2;
    setMouseOffset({ x: nx, y: ny });
  };

  return (
    <section
      id="keyfacts"
      className="kf__section kf__section--space"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Deep Space Background Particle Canvas */}
      <SpaceCanvas />

      {/* Cosmic Nebula Backlight Atmosphere */}
      <div className="kf__nebula-wrap">
        <div className="kf__nebula kf__nebula--blue" />
        <div className="kf__nebula kf__nebula--purple" />
        <div className="kf__nebula kf__nebula--cyan" />
      </div>

      <div className="kf__container">
        {/* Section Header */}
        <motion.div
          className="kf__header"
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="kf__title">Key Facts</h2>
          <p className="kf__subtitle">A snapshot of our creative impact</p>
        </motion.div>

        {/* 3 Levitating Glass Cards Stage */}
        <div className="kf__cards-stage">
          {/* ── CARD 1: ROCKET (Projects Delivered) ── */}
          <motion.div
            className="kf__card kf__card--glass kf__card--float1"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              x: mouseOffset.x * -10,
              y: mouseOffset.y * -8,
            }}
          >
            <div className="kf__card-glint" />
            <RocketIllustration />

            <div className="kf__card-content">
              <div className="kf__stat-number">
                <AnimatedCounter to={150} suffix="+" />
              </div>
              <h3 className="kf__card-heading">Projects Delivered</h3>
              <p className="kf__card-sub">Complete Identities.</p>
            </div>
          </motion.div>

          {/* ── CARD 2: CHROME GLOBE (Satisfied Clients) ── */}
          <motion.div
            className="kf__card kf__card--glass kf__card--float2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.22, ease: 'easeOut' }}
            style={{
              x: mouseOffset.x * -5,
              y: mouseOffset.y * -4,
            }}
          >
            <div className="kf__card-glint" />
            <GlobeIllustration />

            <div className="kf__card-content">
              <div className="kf__stat-number">
                <AnimatedCounter to={98} suffix="%" />
              </div>
              <h3 className="kf__card-heading">Satisfied Clients</h3>
              <p className="kf__card-sub">&amp; Visual Design</p>
            </div>
          </motion.div>

          {/* ── CARD 3: EXPLODED ASSETS (Custom Assets Created) ── */}
          <motion.div
            className="kf__card kf__card--glass kf__card--float3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.34, ease: 'easeOut' }}
            style={{
              x: mouseOffset.x * -12,
              y: mouseOffset.y * -10,
            }}
          >
            <div className="kf__card-glint" />
            <ExplodedAssetsIllustration />

            <div className="kf__card-content">
              <div className="kf__stat-number">
                <AnimatedDecimalCounter to={2.5} suffix="K+" />
              </div>
              <h3 className="kf__card-heading">Custom Assets Created</h3>
              <p className="kf__card-sub">and motifs crafted.</p>
            </div>
          </motion.div>
        </div>

        {/* Kinetic Belt of Floating Glass Cubes */}
        <div className="kf__orbit-belt-wrapper">
          <FloatingGlassCubesBelt />
          <CoreDesignTools />
        </div>
      </div>
    </section>
  );
};

export default KeyFacts;
