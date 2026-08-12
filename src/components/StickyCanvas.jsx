import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Model3D from './Model3D';
import ownerPortrait from '../assets/download.png';
import './StickyCanvas.css';
const ROTATING_WORDS = ['experiences', 'interfaces', 'products', 'solutions', 'visions'];

const SECTIONS = [
  { id: 'hero' },
  {
    id: 'about',
    label: 'ABOUT',
    heading: 'We are an independent digital studio crafting meaningful brand experiences through strategy, design, and technology.',
    tagLeft: 'WE DESIGN FOR LONGEVITY\nCLARITY FIRST, CRAFT ALWAYS,\nBUILT TO SCALE.',
    tagRight: 'Our mission is to make technology feel human by designing digital products that are intuitive, purposeful, and meaningful to people.',
    cta: 'MORE ABOUT US',
  },
  {
    id: 'process',
    label: 'PROCESS',
    heading: 'Every pixel is intentional. Every interaction considered. We build systems that scale and stories that resonate.',
    tagLeft: 'RESEARCH DRIVEN\nSTRATEGY FIRST, DESIGN ALWAYS,\nEXECUTED WITH PRECISION.',
    tagRight: 'We partner with ambitious brands to translate complex ideas into clear, beautiful digital experiences that perform.',
    cta: 'OUR PROCESS',
  },
  {
    id: 'vision',
    label: 'VISION',
  },
  {
    id: 'keyfacts',
    label: 'KEY FACTS',
  },
];

const StickyCanvas = () => {
  const [active, setActive] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [word, setWord] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef(null);
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const sY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const sX2 = useSpring(mouseX, { stiffness: 30, damping: 15 });
  const sY2 = useSpring(mouseY, { stiffness: 30, damping: 15 });

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const onScroll = ({ scroll }) => {
      const vh = window.innerHeight;
      const totalScroll = vh * (SECTIONS.length - 1);
      // progress 0 → 1 across all sections
      const progress = Math.min(Math.max(scroll / totalScroll, 0), 1);
      setScrollProgress(progress);
      const idx = Math.round(scroll / vh);
      setActive(Math.max(0, Math.min(idx, SECTIONS.length - 1)));
    };
    lenis.on('scroll', onScroll);

    const raf = (time) => { lenis.raf(time); rafRef.current = requestAnimationFrame(raf); };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Scroll to section ── */
  const scrollTo = (i) => {
    if (i === 4) {
      const el = document.getElementById('keyfacts');
      if (el) {
        lenisRef.current?.scrollTo(el, { duration: 1.4 });
        return;
      }
    }
    lenisRef.current?.scrollTo(i * window.innerHeight, { duration: 1.2 });
  };

  /* ── Mouse tracking ── */
  useEffect(() => {
    const h = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mouseX, mouseY]);

  /* ── Rotating words ── */
  useEffect(() => {
    if (active !== 0) return;
    const id = setInterval(() => setWord(p => (p + 1) % ROTATING_WORDS.length), 3000);
    return () => clearInterval(id);
  }, [active]);

  const sec = SECTIONS[active];

  // Calculate fade-out ratio as user scrolls towards KeyFacts
  const sceneOpacity = scrollProgress > 0.82 ? Math.max(0, 1 - (scrollProgress - 0.82) * 5.5) : 1;
  const sceneScale = scrollProgress > 0.82 ? Math.max(0.92, 1 - (scrollProgress - 0.82) * 0.4) : 1;

  return (
    /* wrapper gives total scroll height */
    <div ref={wrapperRef} className="sc__wrapper">

      {/* ── STICKY SCENE — always visible ── */}
      <div 
        className="sc__scene"
        style={{
          opacity: sceneOpacity,
          transform: `scale(${sceneScale})`,
          transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
          pointerEvents: sceneOpacity < 0.1 ? 'none' : 'auto',
        }}
      >

        {/* background */}
        <div className="sc__bg">
          <ParticlesCanvas />
          <motion.div className="sc__orb sc__orb--1" style={{ x: sX, y: sY }} />
          <motion.div className="sc__orb sc__orb--2" style={{ x: sX2, y: sY2 }} />
        </div>

        {/* ── 3D MODEL — absolute center ── */}
        <div className="sc__model-wrap">
          <Model3D scrollProgress={scrollProgress} portfolioImage={ownerPortrait} />
        </div>

        {/* ── TEXT LAYER — full viewport, over model ── */}
        <div className="sc__text-layer">

          {/* dots */}
          <div className="sc__dots">
            {SECTIONS.map((_, i) => (
              <button
                key={i}
                className={`sc__dot${i === active ? ' sc__dot--active' : ''}`}
                onClick={() => scrollTo(i)}
                aria-label={`Section ${i + 1}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* HERO (0) */}
            {active === 0 && (
              <motion.div key="hero" className="sc__hero-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } }}
                exit={{ opacity: 0, y: -60, transition: { duration: 0.4, ease: [0.55, 0.06, 0.68, 0.19] } }}
              >
                <div className="sc__eyebrow">
                  <span className="sc__eyebrow-dot" />
                  <span className="sc__eyebrow-txt">CREATIVE DEVELOPER &amp; DESIGNER</span>
                </div>

                <h1 className="sc__h1">
                  <span className="sc__h1-line">Crafting digital</span>
                  <span className="sc__h1-line sc__h1-word">
                    <AnimatePresence mode="wait">
                      <motion.span key={word} className="sc__word">
                        {ROTATING_WORDS[word].split('').map((ch, i) => (
                          <motion.span key={`w${word}-${i}`} style={{ display: 'inline-block' }}
                            initial={{ opacity: 0, filter: 'blur(14px)' }}
                            animate={{
                              opacity: 1, filter: 'blur(0px)',
                              transition: { duration: 0.4, delay: i * 0.038, ease: [0.25, 0.46, 0.45, 0.94] }
                            }}
                            exit={{
                              opacity: 0, filter: 'blur(14px)',
                              transition: { duration: 0.24, delay: i * 0.028, ease: [0.55, 0.06, 0.68, 0.19] }
                            }}
                          >{ch}</motion.span>
                        ))}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="sc__h1-line">that inspire</span>
                </h1>

                <a href="#work" className="sc__cta">
                  START A PROJECT
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>

                <div className="sc__scroll-hint">
                  <motion.div className="sc__scroll-bar"
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
                  <span className="sc__scroll-lbl">SCROLL</span>
                </div>
              </motion.div>
            )}

            {/* MARQUEE / VISION (3) - TRIONN STYLE */}
            {active === 3 && (
              <motion.div key="marquee" className="sc__marquee-content"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }}
                exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.42, ease: [0.55, 0.06, 0.68, 0.19] } }}
              >
                <div className="sc__marquee-topleft">
                  <span>FOCUSED VISION.</span>
                  <span>MEASURED EXECUTION.</span>
                </div>

                <div className="sc__marquee-container">
                  <div className="sc__marquee-track">
                    {[...Array(6)].map((_, i) => (
                      <span key={i} className="sc__marquee-item">
                        <span className="sc__marquee-word">IMPACT</span>
                        <span className="sc__marquee-plus">+</span>
                        <span className="sc__marquee-word">INSPIRE</span>
                        <span className="sc__marquee-plus">+</span>
                        <span className="sc__marquee-word">INNOVATE</span>
                        <span className="sc__marquee-plus">+</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sc__marquee-bottomtag">
                  ✦ FROM IDEA TO OUTCOME.
                </div>
              </motion.div>
            )}

            {/* ABOUT (1) / PROCESS (2) TEXT BLOCKS */}
            {(active === 1 || active === 2) && sec.heading && (
              <motion.div key={`sec-${active}`} className="sc__about-content"
                initial={{ opacity: 0, y: 55 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }}
                exit={{ opacity: 0, y: -50, transition: { duration: 0.42, ease: [0.55, 0.06, 0.68, 0.19] } }}
              >
                <span className="sc__alabel">
                  <span className="sc__alabel-gem">◆</span> {sec.label}
                </span>

                <h2 className="sc__ah2">{sec.heading}</h2>

                <div className="sc__adivider" />

                <div className="sc__arow">
                  <p className="sc__atag-left">
                    {sec.tagLeft.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
                  </p>
                  <p className="sc__atag-right">{sec.tagRight}</p>
                  <a href="#" className="sc__acta">
                    {sec.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>{/* text-layer */}

        {/* stat bar */}
        <div className="sc__statbar">
          <div className="sc__sdiv" />
          <div className="sc__stat">
            <span className="sc__sval">5+ YEARS</span>
            <span className="sc__slbl">SHAPING DIGITAL DIRECTION</span>
          </div>
          <div className="sc__sdiv" />
          <p className="sc__sdesc">
            Websites, AI products, brands,<br />and systems built for clarity,<br />scale and impact.
          </p>
        </div>

        {/* cursor */}
        <div className="sc__cursor" style={{ left: mousePos.x, top: mousePos.y }} />

      </div>{/* scene */}

      {/* Scroll spacer — creates the scrollable distance */}
      <div className="sc__spacer" />

    </div>
  );
};

/* ── Particles ── */
const ParticlesCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    let id;
    const pts = [];
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 65; i++) pts.push({
      x: Math.random() * c.width, y: Math.random() * c.height,
      sz: Math.random() * 1.4 + 0.4, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      op: Math.random() * .32 + .06, ph: Math.random() * Math.PI * 2,
    });
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.ph += .01;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        const a = p.op * (.5 + .5 * Math.sin(p.ph));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
        pts.forEach((q, j) => {
          if (j <= i) return;
          const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,255,255,${.025 * (1 - d / 110)})`; ctx.lineWidth = .4; ctx.stroke();
          }
        });
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="sc__particles" />;
};

export default StickyCanvas;
