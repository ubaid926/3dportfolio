import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Model3D from './Model3D';
import './Hero.css';

// Words that rotate in the hero heading
const ROTATING_WORDS = ['texture maps', 'PBR materials', 'lightmaps', 'AO passes', 'normal cages', '3D animations'];

// About section text items — scroll through these
const ABOUT_TEXTS = [
  {
    label: 'BAKING ENGINE',
    heading: 'We build high-performance 3D animation configurators and GPU texture baking pipelines for real-time web and spatial computing.',
    tag1: 'ZERO-LATENCY BAKING\nULTRA COMPACT GLTF ASSETS,\nENGINEERED FOR 120 FPS.',
    tag2: 'Our baking engine bakes complex global illumination, subsurface scattering, and high-poly normal cages directly into lightweight PBR texture maps.',
  },
  {
    label: 'CONFIGURATOR',
    heading: 'From high-to-low poly cage baking to real-time GLSL shader compilation and kinetic skeletal animations.',
    tag1: 'HARDWARE ACCELERATED\nRAY-TRACED AO & RADIOSITY,\nPIXEL-PERFECT UV SYNTHESIS.',
    tag2: 'We empower brands to deploy interactive 3D configurators with instantaneous texture swapping, dynamic lighting, and cinematic motion.',
  },
  {
    label: 'SPATIAL 3D',
    heading: 'Next-generation WebGL and WebXR 3D configuration with zero render lag and photorealistic material fidelity.',
    tag1: 'BUILT FOR SPEED\n60+ FPS WEB ENGINES,\nPRODUCTION ASSETS.',
    tag2: 'We turn heavy offline CGI renders into lightning-fast, baked real-time 3D interactive experiences.',
  },
];

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  // Smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Word rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 2);
      mouseY.set((clientY / innerHeight - 0.5) * 2);
      setMousePos({ x: clientX, y: clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.01;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulsedOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulsedOpacity * 0.4})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2, j) => {
          if (j <= i) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.035 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Animation variants: Blur -> Disable (dip) -> Enable (reveal)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: 'blur(22px)',
      scale: 0.94,
    },
    visible: {
      opacity: [0, 0.45, 0, 1], // 1. Blur -> 2. Disable (fade out) -> 3. Enable (crisp reveal)
      filter: ['blur(22px)', 'blur(14px)', 'blur(18px)', 'blur(0px)'],
      y: [40, 20, 8, 0],
      scale: [0.94, 0.97, 0.98, 1],
      transition: {
        duration: 1.1,
        times: [0, 0.32, 0.52, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      filter: 'blur(22px)',
      scale: 0.9,
    },
    visible: (i) => ({
      opacity: [0, 0.5, 0, 1], // 1. Blur -> 2. Disable -> 3. Enable
      filter: ['blur(22px)', 'blur(12px)', 'blur(16px)', 'blur(0px)'],
      y: [50, 22, 8, 0],
      scale: [0.9, 0.96, 0.97, 1],
      transition: {
        duration: 1.0,
        times: [0, 0.3, 0.5, 1],
        delay: 0.3 + i * 0.03,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const headingLine1 = "Baking procedural";
  const headingLine2 = "into 3D motion";

  return (
    <section className="hero" ref={heroRef} id="hero">
      {/* Particle background */}
      <canvas ref={canvasRef} className="hero__particles" />

      {/* Animated gradient orbs - parallax */}
      <motion.div
        className="hero__orb hero__orb--1"
        style={{ x: smoothX, y: smoothY }}
      />
      <motion.div
        className="hero__orb hero__orb--2"
        style={{
          x: useSpring(mouseX, { stiffness: 30, damping: 15 }),
          y: useSpring(mouseY, { stiffness: 30, damping: 15 }),
        }}
      />
      <motion.div
        className="hero__orb hero__orb--3"
        style={{
          x: useSpring(mouseX, { stiffness: 20, damping: 25 }),
          y: useSpring(mouseY, { stiffness: 20, damping: 25 }),
        }}
      />

      {/* Grid lines */}
      <div className="hero__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="hero__grid-line hero__grid-line--vertical"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.1, duration: 1.2, ease: 'easeOut' }}
            style={{ left: `${(i + 1) * (100 / 7)}%` }}
          />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="hero__grid-line hero__grid-line--horizontal"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.8 + i * 0.1, duration: 1.2, ease: 'easeOut' }}
            style={{ top: `${(i + 1) * 25}%` }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="hero__shapes">
        <motion.div
          className="hero__shape hero__shape--diamond"
          animate={{
            rotate: [0, 360],
            y: [0, -20, 0],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.div
          className="hero__shape hero__shape--ring"
          animate={{
            rotate: [0, -360],
            y: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.div
          className="hero__shape hero__shape--cross"
          animate={{
            rotate: [0, 180],
            y: [0, -25, 0],
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </div>

      {/* Full Screen Centered 3D Model Background */}
      <div className="hero__model-container">
        <Model3D />
      </div>

      {/* Main text content floating over the 3D model */}
      <motion.div
        className="hero__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero__text-col">
          {/* Eyebrow tag */}
          <motion.div className="hero__eyebrow" variants={itemVariants}>
            <span className="hero__eyebrow-dot" />
            <span className="hero__eyebrow-text">3D ANIMATION CONFIGURATOR &amp; TEXTURE BAKING</span>
          </motion.div>

          {/* Main heading */}
          <div className="hero__heading-wrapper">
            <h1 className="hero__heading">
              {/* Line 1: "Baking procedural" */}
              <span className="hero__heading-line">
                {headingLine1.split(' ').map((word, wIdx) => {
                  const prevCharsCount = headingLine1.split(' ').slice(0, wIdx).join(' ').length + (wIdx > 0 ? 1 : 0);
                  return (
                    <span key={`w1-${wIdx}`} className="hero__word">
                      {word.split('').map((char, cIdx) => (
                        <motion.span
                          key={`c1-${wIdx}-${cIdx}`}
                          className="hero__heading-char"
                          variants={letterVariants}
                          custom={prevCharsCount + cIdx}
                        >
                          {char}
                        </motion.span>
                      ))}
                      {wIdx < headingLine1.split(' ').length - 1 && <span className="hero__space">&nbsp;</span>}
                    </span>
                  );
                })}
              </span>

              {/* Line 2: animated rotating word — ALONE on its own line */}
              <span className="hero__heading-line hero__heading-line--rotating">
                <span className="hero__rotating-wrapper">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWord}
                      className="hero__rotating-word"
                    >
                      {ROTATING_WORDS[currentWord].split('').map((char, i) => (
                        <motion.span
                          key={`rc-${currentWord}-${i}`}
                          style={{ display: 'inline-block' }}
                          initial={{ opacity: 0, filter: 'blur(14px)' }}
                          animate={{
                            opacity: 1, filter: 'blur(0px)',
                            transition: { duration: 0.4, delay: i * 0.038, ease: [0.25, 0.46, 0.45, 0.94] },
                          }}
                          exit={{
                            opacity: 0, filter: 'blur(14px)',
                            transition: { duration: 0.25, delay: i * 0.030, ease: [0.55, 0.06, 0.68, 0.19] },
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>

              {/* Line 3: "into 3D motion" */}
              <span className="hero__heading-line">
                {headingLine2.split(' ').map((word, wIdx) => {
                  const prevCharsCount = headingLine1.length + headingLine2.split(' ').slice(0, wIdx).join(' ').length + (wIdx > 0 ? 1 : 0);
                  return (
                    <span key={`w2-${wIdx}`} className="hero__word">
                      {word.split('').map((char, cIdx) => (
                        <motion.span
                          key={`c2-${wIdx}-${cIdx}`}
                          className="hero__heading-char"
                          variants={letterVariants}
                          custom={prevCharsCount + cIdx}
                        >
                          {char}
                        </motion.span>
                      ))}
                      {wIdx < headingLine2.split(' ').length - 1 && <span className="hero__space">&nbsp;</span>}
                    </span>
                  );
                })}
              </span>
            </h1>
          </div>

          {/* CTA Button */}
          <motion.div className="hero__cta-wrapper" variants={itemVariants}>
            <motion.a
              href="#work"
              className="hero__cta"
              whileHover={{ scale: 1.05, gap: '1.2rem' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hero__cta-text">EXPLORE 3D CONFIGURATOR</span>
              <span className="hero__cta-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="hero__scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <motion.div
              className="hero__scroll-line"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="hero__scroll-text">SCROLL</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom info bar */}
      <motion.div
        className="hero__bottom"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="hero__bottom-left">
          <motion.div
            className="hero__cursor-follower"
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
          />
        </div>
        <div className="hero__bottom-right">
          <div className="hero__stat">
            <div className="hero__stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="hero__stat-info">
              <span className="hero__stat-label">120 FPS WEBGL</span>
            </div>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">GPU BAKED</span>
            <span className="hero__stat-label">PBR TEXTURE ENGINE</span>
          </div>
          <div className="hero__stat-desc">
            PBR lightmaps, normal cages,
            <br />
            AO passes, and WebGL animation
            <br />
            pipelines built for hyper-speed.
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
