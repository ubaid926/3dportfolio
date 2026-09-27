import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import logoImg from '../assets/logo.svg';
import './Footer.css';

/* =========================================================
   INTERACTIVE WAVEFORM BARS (Bottom of Footer)
   Audio frequency spectrum with reactive neon cyan bloom
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

    const NUM_COLS = 28;
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
          const wave = Math.sin(t * 1.5 + col * 0.45 + row * 0.35) * 0.5 + 0.5;
          const wave2 = Math.sin(t * 0.9 - col * 0.3 + row * 0.5) * 0.5 + 0.5;
          const combined = (wave + wave2) / 2;

          // Mouse proximity influence
          const dx = cx - mouseRef.current.x;
          const dy = cy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 220);

          // Line length: base wave + hover boost
          const baseLen = colW * 0.58 * (0.3 + combined * 0.7);
          const hoverBoost = proximity * colW * 0.8;
          const lineLen = baseLen + hoverBoost;

          // Dynamic colors: when near mouse, turns electric cyan with glowing shadow!
          const isNear = proximity > 0.15;
          const baseOpacity = 0.16 + combined * 0.22;
          const opacity = Math.min(1, baseOpacity + proximity * 0.8);

          ctx.save();
          ctx.globalAlpha = opacity;

          if (isNear) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 1.8;
          } else {
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.lineWidth = 0.9;
          }

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
   ANIMATED BACKGROUND CANVAS (Cosmic Space Nebulae & Stars)
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

    // Glowing cosmic nebulae
    const orbs = [
      { x: 0.18, y: 0.35, r: 0.45, color: '37,99,235', speed: 0.15, phase: 0 },
      { x: 0.72, y: 0.28, r: 0.38, color: '56,189,248', speed: 0.22, phase: 1.6 },
      { x: 0.48, y: 0.65, r: 0.32, color: '124,58,237', speed: 0.18, phase: 3.1 },
      { x: 0.85, y: 0.75, r: 0.28, color: '14,165,233', speed: 0.26, phase: 4.5 },
    ];

    // Star dust particles
    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.45 + 0.12,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      isCyan: Math.random() > 0.6,
    }));

    let startTime = null;

    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) * 0.001;
      const W = canvas.width;
      const H = canvas.height;

      // Deep void background
      ctx.fillStyle = '#02040b';
      ctx.fillRect(0, 0, W, H);

      // Draw cosmic nebulae
      orbs.forEach((orb) => {
        const fx = Math.sin(t * orb.speed + orb.phase) * 0.05;
        const fy = Math.cos(t * orb.speed * 0.7 + orb.phase) * 0.03;
        const ox = (orb.x + fx) * W;
        const oy = (orb.y + fy) * H;
        const radius = orb.r * Math.min(W, H);

        const pulse = 1 + 0.08 * Math.sin(t * orb.speed * 2.2 + orb.phase);
        const finalR = radius * pulse;
        const intensity = 0.085 + 0.035 * Math.sin(t * orb.speed * 1.5 + orb.phase * 0.5);

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, finalR);
        grad.addColorStop(0, `rgba(${orb.color},${intensity * 1.8})`);
        grad.addColorStop(0.4, `rgba(${orb.color},${intensity * 0.7})`);
        grad.addColorStop(0.8, `rgba(${orb.color},${intensity * 0.15})`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, finalR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw twinkling stars
      stars.forEach((star) => {
        star.phase += star.speed;
        const alpha = Math.max(0.05, star.alpha + Math.sin(star.phase) * 0.25);
        ctx.beginPath();
        ctx.arc(star.x * W, star.y * H, star.size, 0, Math.PI * 2);
        if (star.isCyan) {
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 2;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
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
   LIVE CLOCK DISPLAY
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
    <div className="footer__clock-wrap">
      <span className="footer__clock-dot" />
      <span className="footer__clock">GLOBAL RUNTIME // {time}</span>
    </div>
  );
};

/* =========================================================
   CTA LINK ROW (Cybernetic Numbered Arrow Row)
   ========================================================= */
const CtaRow = ({ number = '01', label, subtitle = '', href = '#contact', delay = 0 }) => {
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
      <div className="footer__cta-left">
        <span className="footer__cta-num">{number}</span>
        <div className="footer__cta-titles">
          <span className="footer__cta-label">{label}</span>
          {subtitle && <span className="footer__cta-sub">{subtitle}</span>}
        </div>
      </div>
      <span className="footer__cta-arrow-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

  const headingLine1 = 'Ready to elevate';
  const headingLine2 = 'your brand identity?';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHeadingLine = (text, lineKey, baseDelay, isAccent = false) => {
    let charOffset = 0;
    const words = text.split(' ');

    return (
      <span className={`footer__heading-line ${isAccent ? 'footer__heading-line--accent' : ''}`}>
        {words.map((word, wIdx) => {
          const chars = word.split('');
          const currentWordOffset = charOffset;
          charOffset += chars.length + 1;

          return (
            <span key={`${lineKey}-w-${wIdx}`} className="footer__heading-word">
              {chars.map((char, cIdx) => (
                <motion.span
                  key={`${lineKey}-c-${wIdx}-${cIdx}`}
                  className="footer__heading-char"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: baseDelay + (currentWordOffset + cIdx) * 0.028,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
              {wIdx < words.length - 1 && <span className="footer__heading-space">&nbsp;</span>}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <footer id="contact" ref={footerRef} className="footer">
      {/* ── Animated Background Cosmic Nebulae & Stars Canvas ── */}
      <FooterBackground />

      {/* ── Top Micro Strip ── */}
      <div className="footer__top-strip">
        <div className="footer__strip-left">
          <span className="footer__strip-badge">SYSTEM 05</span>
          <span className="footer__tagline">NEXORA STUDIO™ // BRAND IDENTITIES, LUXURY PACKAGING &amp; VISUAL SYSTEMS</span>
        </div>
        <div className="footer__strip-right">
          <LiveClock />
          <button className="footer__top-btn" onClick={scrollToTop} aria-label="Scroll to top of page">
            <span>TOP</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="footer__main-grid">
        {/* LEFT: Hero Heading & Guarantee Chip */}
        <div className="footer__left">
          <div className="footer__category-pill">
            <span className="footer__pill-pulse" />
            <span className="footer__pill-text">BESPOKE VISUAL DIRECTION</span>
          </div>

          <h2 ref={headingRef} className="footer__hero-heading">
            {renderHeadingLine(headingLine1, 'l1', 0.1, false)}
            {renderHeadingLine(headingLine2, 'l2', 0.25 + headingLine1.length * 0.028, true)}
          </h2>

          <div className="footer__guarantee-row">
            <span className="footer__guarantee-chip">
              <span className="footer__chip-icon">⚡</span>
              24H Rapid Discovery
            </span>
            <span className="footer__guarantee-chip">
              <span className="footer__chip-icon">🛡️</span>
              Full IP &amp; Font Rights
            </span>
            <span className="footer__guarantee-chip">
              <span className="footer__chip-icon">✦</span>
              Swiss Typographic Precision
            </span>
          </div>
        </div>

        {/* RIGHT: High-Impact Cyber CTA Rows */}
        <div className="footer__right">
          <CtaRow
            number="01"
            label="START A BRAND PROJECT"
            subtitle="Custom visual identity, packaging & typography"
            href="#contact"
            delay={0.2}
          />
          <CtaRow
            number="02"
            label="SCHEDULE A CONSULTATION"
            subtitle="Direct creative session with our art directors"
            href="https://cal.com"
            delay={0.32}
          />
          <CtaRow
            number="03"
            label="EXPLORE DESIGN ARCHIVES"
            subtitle="Browse identity case studies and print collections"
            href="#work"
            delay={0.42}
          />
        </div>
      </div>

      {/* ── Cyber Hairline Divider with Crosshairs ── */}
      <div className="footer__divider-wrap">
        <motion.div
          className="footer__divider"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* ── Lower Info Bar ── */}
      <div className="footer__info-bar">
        {/* Left: Copyright + Engine Status */}
        <div className="footer__info-left">
          <motion.div
            className="footer__copyright"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <img src={logoImg} alt="Nexora Studio" className="footer__logo-img" />
            <div className="footer__brand-text">
              <span className="footer__brand-name">NEXORA STUDIO<sup>®</sup></span>
              <span className="footer__brand-copy">© 2026 GRAPHIC DESIGN &amp; ART DIRECTION STUDIO</span>
            </div>
          </motion.div>

          <motion.div
            className="footer__sound-notice"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="footer__sound-dot" />
            <span>NEXORA AUDIO MATRIX ACTIVE · HOVER FREQUENCY SPECTRUM BELOW</span>
          </motion.div>
        </div>

        {/* Center: Location Nodes */}
        <div className="footer__info-center">
          <div className="footer__col-heading">STUDIO NODES</div>
          <div className="footer__location-list">
            <span className="footer__location-item">SAN FRANCISCO · CA</span>
            <span className="footer__location-item">LONDON · UK</span>
            <span className="footer__location-item">ZURICH · SWITZERLAND</span>
          </div>
        </div>

        {/* Right: Studio Enquiry + Social Grid */}
        <div className="footer__info-right">
          <motion.div
            className="footer__contact-col"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="footer__col-heading">DIRECT ENQUIRY</div>
            <a href="mailto:hello@nexora.studio" className="footer__contact-link">
              <span className="footer__prefix">E.</span> hello@nexora.studio
            </a>
            <a href="tel:+14158209900" className="footer__contact-link">
              <span className="footer__prefix">P.</span> +1 (415) 820-9900
            </a>
          </motion.div>

          <motion.div
            className="footer__social-col"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="footer__col-heading">CHANNELS</div>
            <div className="footer__social-grid">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">LinkedIn</a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">Dribbble</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">GitHub</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">Instagram</a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Interactive Waveform Section Header & Canvas ── */}
      <div className="footer__waveform-section">
        <div className="footer__waveform-header">
          <span className="footer__waveform-title">
            <span className="footer__wave-pulse" />
            AUDIO &amp; FREQUENCY MATRIX // 44.1 kHz SPATIAL HARMONICS
          </span>
          <span className="footer__waveform-hint">INTERACTIVE REAL-TIME SPECTRUM</span>
        </div>
        <WaveformBars />
      </div>
    </footer>
  );
};

export default Footer;
