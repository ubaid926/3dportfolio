import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import './Footer.css';

/* =========================================================
   INTERACTIVE WAVEFORM BARS (Bottom of Footer)
   Lines that animate autonomously AND react to mouse hover
   ========================================================= */
const WaveformBars = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const NUM_COLS = 22;
    const NUM_ROWS = 8;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (ts) => {
      timeRef.current = ts * 0.001;
      const t = timeRef.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const colW = W / NUM_COLS;
      const rowH = H / NUM_ROWS;

      for (let col = 0; col < NUM_COLS; col++) {
        for (let row = 0; row < NUM_ROWS; row++) {
          const cx = col * colW + colW / 2;
          const cy = row * rowH + rowH / 2;

          // Organic wave motion
          const wave = Math.sin(t * 1.4 + col * 0.55 + row * 0.3) * 0.5 + 0.5;
          const wave2 = Math.sin(t * 0.8 - col * 0.4 + row * 0.6) * 0.5 + 0.5;
          const combined = (wave + wave2) / 2;

          // Mouse proximity influence
          const dx = cx - mouseRef.current.x;
          const dy = cy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 200);

          // Line length: base wave + hover glow
          const baseLen = colW * 0.55 * (0.3 + combined * 0.7);
          const hoverBoost = proximity * colW * 0.6;
          const lineLen = baseLen + hoverBoost;

          // Opacity: dimmer far from mouse, brighter near
          const baseOpacity = 0.18 + combined * 0.22;
          const hoverOpacity = proximity * 0.75;
          const opacity = Math.min(1, baseOpacity + hoverOpacity);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = proximity > 0.2 ? 1.5 : 0.85;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - lineLen / 2, cy);
          ctx.lineTo(cx + lineLen / 2, cy);
          ctx.stroke();
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="footer__waveform-canvas" />;
};

/* =========================================================
   ANIMATED BACKGROUND CANVAS (Floating glowing orbs)
   ========================================================= */
const FooterBackground = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Define glowing orbs
    const orbs = [
      { x: 0.22, y: 0.45, r: 0.42, color: '255,255,255', speed: 0.18, phase: 0 },
      { x: 0.65, y: 0.3,  r: 0.28, color: '200,210,255', speed: 0.27, phase: 1.4 },
      { x: 0.5,  y: 0.7,  r: 0.22, color: '180,200,255', speed: 0.22, phase: 2.8 },
      { x: 0.12, y: 0.15, r: 0.18, color: '255,255,255', speed: 0.15, phase: 0.7 },
      { x: 0.85, y: 0.6,  r: 0.20, color: '210,220,255', speed: 0.32, phase: 4.2 },
    ];

    let startTime = null;

    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) * 0.001;
      const W = canvas.width;
      const H = canvas.height;

      // Clear with deep black
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);

      // Draw each glowing orb
      orbs.forEach((orb) => {
        // Gentle floating motion
        const fx = Math.sin(t * orb.speed + orb.phase) * 0.06;
        const fy = Math.cos(t * orb.speed * 0.7 + orb.phase) * 0.04;
        const ox = (orb.x + fx) * W;
        const oy = (orb.y + fy) * H;
        const radius = orb.r * Math.min(W, H);

        // Breathing pulse
        const pulse = 1 + 0.08 * Math.sin(t * orb.speed * 2.5 + orb.phase);
        const finalR = radius * pulse;

        // Intensity fluctuation
        const intensity = 0.055 + 0.025 * Math.sin(t * orb.speed * 1.8 + orb.phase * 0.5);

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, finalR);
        grad.addColorStop(0,   `rgba(${orb.color},${intensity * 2.2})`);
        grad.addColorStop(0.3, `rgba(${orb.color},${intensity})`);
        grad.addColorStop(0.7, `rgba(${orb.color},${intensity * 0.3})`);
        grad.addColorStop(1,   `rgba(${orb.color},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, finalR, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="footer__bg-canvas" />;
};

/* =========================================================
   CLOCK DISPLAY (IST → HH:MM live clock)
   ========================================================= */
const LiveClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="footer__clock">
      IST → {time}
    </span>
  );
};

/* =========================================================
   CTA LINK ROW (bordered arrow row)
   ========================================================= */
const CtaRow = ({ label, href = '#contact', delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      className={`footer__cta-row ${hovered ? 'footer__cta-row--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="footer__cta-label">{label}</span>
      <span className="footer__cta-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </motion.a>
  );
};

/* =========================================================
   MAIN FOOTER COMPONENT
   ========================================================= */
const Footer = () => {
  const footerRef = useRef(null);
  const headingRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-60px' });

  // Split "Ready to build something bold?" into chars for stagger animation
  const headingLine1 = 'Ready to build';
  const headingLine2 = 'something bold?';

  return (
    <footer id="contact" ref={footerRef} className="footer">
      {/* ── Animated Background Canvas ── */}
      <FooterBackground />

      {/* ── Top Micro Strip ── */}
      <div className="footer__top-strip">
        <span className="footer__tagline">LET'S BUILD WORK THAT INSPIRES.</span>
        <LiveClock />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="footer__main-grid">
        {/* LEFT: Hero Heading */}
        <div className="footer__left">
          <h2 ref={headingRef} className="footer__hero-heading">
            <span className="footer__heading-line">
              {headingLine1.split('').map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  className="footer__heading-char"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.028, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="footer__heading-line">
              {headingLine2.split('').map((char, i) => (
                <motion.span
                  key={`l2-${i}`}
                  className="footer__heading-char"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.028, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h2>
        </div>

        {/* RIGHT: CTA Rows */}
        <div className="footer__right">
          <CtaRow label="DISCUSS YOUR PROJECT" href="#contact" delay={0.2} />
          <CtaRow label="BOOK A 30-MINUTE CALL" href="https://cal.com" delay={0.32} />
        </div>
      </div>

      {/* ── Divider Line ── */}
      <motion.div
        className="footer__divider"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Lower Info Bar ── */}
      <div className="footer__info-bar">
        {/* Left: Copyright + Sound Notice */}
        <div className="footer__info-left">
          <motion.div
            className="footer__copyright"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            ◆STUDIO<sup>®</sup> 2026
          </motion.div>
          <motion.div
            className="footer__sound-notice"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="footer__sound-dot" />
            SOUND ON ♪ HOVER THE LINES.
          </motion.div>
        </div>

        {/* Center: empty spacer on desktop */}
        <div className="footer__info-center" />

        {/* Right: Business Enquiry + Social */}
        <div className="footer__info-right">
          <motion.div
            className="footer__contact-col"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="footer__col-heading">BUSINESS ENQUIRY</div>
            <a href="mailto:hello@studio.com" className="footer__contact-link">
              <span className="footer__prefix">E.</span> hello@studio.com
            </a>
            <a href="tel:+919824182099" className="footer__contact-link">
              <span className="footer__prefix">P.</span> +91 98241 82099
            </a>
          </motion.div>

          <motion.div
            className="footer__social-col"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="footer__col-heading">SOCIAL</div>
            <div className="footer__social-grid">
              <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer" className="footer__social-link">Linkedin</a>
              <a href="https://facebook.com"  target="_blank" rel="noopener noreferrer" className="footer__social-link">Facebook</a>
              <a href="https://dribbble.com"  target="_blank" rel="noopener noreferrer" className="footer__social-link">Dribbble</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">Instagram</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Interactive Waveform Lines ── */}
      <div className="footer__waveform-section">
        <WaveformBars />
      </div>
    </footer>
  );
};

export default Footer;
