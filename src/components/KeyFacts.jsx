import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import lionTrophy from '../assets/lion_trophy.png';
import lionTeam from '../assets/lion_team.png';
import './KeyFacts.css';

/* ── Animated Stat Counters ── */
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

  return <span ref={ref} className="kf__counter-num">{count}<sup>{suffix}</sup></span>;
};

const AnimatedDecimalCounter = ({ to = 1.5, suffix = 'K+', duration = 1.8, trigger }) => {
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

  return <span ref={ref} className="kf__counter-num">{val}<sup>{suffix}</sup></span>;
};

/* ══════════════════════════════════════════════════════
   Scroll-linked 3D Perspective Tilt Cards (Desktop)
   Left card  : rotateY  -58 → 0, scale 0.76 → 1, z -280 → 0
   Right card : rotateY   58 → 0, scale 0.76 → 1, z -280 → 0
   Centre card stays flat.
══════════════════════════════════════════════════════ */
const usePerspectiveTilt = (sectionRef, direction) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  });

  const sign = direction === 'left' ? -1 : 1;

  const rotateY    = useTransform(smoothProgress, [0, 1], [sign * 58, 0]);
  const rotateZ    = useTransform(smoothProgress, [0, 1], [sign * 4,  0]);
  const scale      = useTransform(smoothProgress, [0, 1], [0.76, 1]);
  const translateZ = useTransform(smoothProgress, [0, 1], [-280, 0]);
  const opacity    = useTransform(smoothProgress, [0, 0.25, 1], [0, 0.6, 1]);

  return { rotateY, rotateZ, scale, translateZ, opacity };
};

/* ── Partners Logo Strip Component ── */
const PartnersLogos = () => (
  <div className="kf__partners-logos">
    <div className="kf__partner-logo kf__logo-credible"><span>UNREAL ENGINE</span></div>
    <div className="kf__partner-divider" />
    <div className="kf__partner-logo kf__logo-yellowtail"><span>THREE.JS</span></div>
    <div className="kf__partner-divider" />
    <div className="kf__partner-logo kf__logo-luxury">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
      <div className="kf__luxury-text">
        <span className="kf__luxury-top">BLENDER</span>
        <span className="kf__luxury-bot">PIPELINE</span>
      </div>
    </div>
    <div className="kf__partner-divider" />
    <div className="kf__partner-logo kf__logo-technis">
      <span className="kf__technis-dot">●</span><span>WEBGL 2.0</span>
    </div>
    <div className="kf__partner-divider" />
    <div className="kf__partner-logo kf__logo-ockto">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
      </svg>
      <span>glTF / USDZ</span>
    </div>
  </div>
);

/* ── KeyFacts Component ── */
const KeyFacts = () => {
  const sectionRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const mobileTrackWrapRef = useRef(null);

  const [maxTranslate, setMaxTranslate] = useState(0);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  // Measure track width on mobile for right-to-left horizontal scroll
  useEffect(() => {
    const calculateTranslate = () => {
      if (!mobileTrackRef.current || !mobileTrackWrapRef.current) return;
      const trackWidth = mobileTrackRef.current.scrollWidth;
      const viewportWidth = mobileTrackWrapRef.current.clientWidth;
      // Bring Card 3 fully into view with symmetrical margin
      const maxScroll = trackWidth - viewportWidth + 32;
      setMaxTranslate(Math.max(0, maxScroll));
    };

    calculateTranslate();
    const timer = setTimeout(calculateTranslate, 350);
    window.addEventListener('resize', calculateTranslate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateTranslate);
    };
  }, []);

  // Desktop perspective hooks
  const leftTilt  = usePerspectiveTilt(sectionRef, 'left');
  const rightTilt = usePerspectiveTilt(sectionRef, 'right');

  const { scrollYProgress: centreProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const centreScale   = useTransform(centreProgress, [0, 0.6, 1], [0.7, 1.06, 1]);
  const centreOpacity = useTransform(centreProgress, [0, 0.3, 1], [0, 0, 1]);
  const smoothCentreScale = useSpring(centreScale, { stiffness: 80, damping: 20 });

  // Mobile scroll-driven horizontal translation (like WorkCards desktop)
  const { scrollYProgress: mobileScrollProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothMobileProgress = useSpring(mobileScrollProgress, {
    stiffness: 75,
    damping: 24,
    restDelta: 0.001,
  });

  // Moves cards right-to-left across vertical scroll
  const mobileCardsX = useTransform(smoothMobileProgress, [0.05, 0.88], [0, -maxTranslate]);

  // Track active card index for counter triggers
  useMotionValueEvent(smoothMobileProgress, 'change', (latest) => {
    if (latest < 0.35) setActiveCardIdx(0);
    else if (latest < 0.65) setActiveCardIdx(1);
    else setActiveCardIdx(2);
  });

  return (
    <section id="keyfacts" className="kf__section" ref={sectionRef}>
      
      {/* =====================================================
          1. DESKTOP VIEW (3D PERSPECTIVE STAGE GRID)
          Standard full-width 3-column layout
      ===================================================== */}
      <div className="kf__desktop-wrapper">
        <div className="kf__container">

          {/* ── Section Header ── */}
          <motion.div
            className="kf__header"
            initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="kf__title">Key facts</h2>
            <p className="kf__subtitle">
              A snapshot of our<br />
              experience and impact.
            </p>
          </motion.div>

          {/* ── Cards Grid — 3D Perspective Stage ── */}
          <div className="kf__cards-grid kf__perspective-stage">

            {/* ── Card 1: Featured & Awards ── */}
            <motion.div
              className="kf__card kf__card--dark kf__card--side"
              style={{
                rotateY:    leftTilt.rotateY,
                rotateZ:    leftTilt.rotateZ,
                scale:      leftTilt.scale,
                translateZ: leftTilt.translateZ,
                opacity:    leftTilt.opacity,
                transformOrigin: 'right center',
              }}
              whileHover={{ y: -6, transition: { duration: 0.28, ease: 'easeOut' } }}
            >
              <div className="kf__card-label">TEXTURE MAPS BAKED</div>

              <div className="kf__card-img-wrap">
                <motion.img
                  src={lionTrophy}
                  alt="Featured and awards lion"
                  className="kf__card-img"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>

              <div className="kf__card-footer">
                <div className="kf__footer-left">
                  <div className="kf__icon-v">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 6L12 18L20 6" /><path d="M7 6L12 14L17 6" />
                    </svg>
                  </div>
                  <p className="kf__footer-desc">
                    4K PBR lightmaps &amp; normal<br />cages baked flawlessly.
                  </p>
                </div>
                <div className="kf__stat-number">
                  <AnimatedCounter to={50} suffix="M+" />
                </div>
              </div>
            </motion.div>

            {/* ── Card 2: Projects Completed ── */}
            <motion.div
              className="kf__card kf__card--light kf__card--centre"
              style={{
                scale:   smoothCentreScale,
                opacity: centreOpacity,
              }}
              whileHover={{ y: -6, transition: { duration: 0.28, ease: 'easeOut' } }}
            >
              <div className="kf__card-label kf__card-label--dark">3D CONFIGURATORS DEPLOYED</div>

              <div className="kf__circle-wrap">
                <motion.div
                  className="kf__circle"
                  initial={{ scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <span className="kf__circle-val">
                    <AnimatedDecimalCounter to={1.5} suffix="K+" />
                  </span>
                </motion.div>
              </div>

              <div className="kf__card-footer">
                <p className="kf__footer-desc kf__footer-desc--dark">
                  90% reduction in runtime draw<br />calls with pre-baked radiance.
                </p>
              </div>
            </motion.div>

            {/* ── Card 3: Our Team Members ── */}
            <motion.div
              className="kf__card kf__card--dark kf__card--side"
              style={{
                rotateY:    rightTilt.rotateY,
                rotateZ:    rightTilt.rotateZ,
                scale:      rightTilt.scale,
                translateZ: rightTilt.translateZ,
                opacity:    rightTilt.opacity,
                transformOrigin: 'left center',
              }}
              whileHover={{ y: -6, transition: { duration: 0.28, ease: 'easeOut' } }}
            >
              <div className="kf__card-label">BAKING CHANNELS &amp; FORMATS</div>

              <div className="kf__card-img-wrap">
                <motion.img
                  src={lionTeam}
                  alt="Team member lion mask"
                  className="kf__card-img"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>

              <div className="kf__card-footer">
                <div className="kf__footer-left">
                  <p className="kf__footer-desc">
                    Albedo, AO, Normal,<br />Roughness, GLTF, USDZ.
                  </p>
                </div>
                <div className="kf__stat-number">
                  <AnimatedCounter to={20} suffix="+" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── Desktop Business Partners Bar ── */}
          <motion.div
            className="kf__partners"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="kf__partners-label">SUPPORTED ENGINES &amp; ECOSYSTEM</div>
            <PartnersLogos />
          </motion.div>

        </div>
      </div>

      {/* =====================================================
          2. MOBILE VIEW (PINNED RIGHT-TO-LEFT HORIZONTAL SCROLL)
          Clean centered header, balanced cards, right-to-left motion
      ===================================================== */}
      <div className="kf__mobile-wrapper">
        <div className="kf__mobile-sticky-scene">
          
          {/* Centered Mobile Header matching reference */}
          <div className="kf__mobile-header">
            <h2 className="kf__mobile-title">Key facts</h2>
            <p className="kf__mobile-subtitle">
              A snapshot of our<br />baking power and scale.
            </p>
          </div>

          {/* Horizontal Track Viewport */}
          <div className="kf__mobile-track-wrap" ref={mobileTrackWrapRef}>
            <motion.div
              className="kf__mobile-track"
              ref={mobileTrackRef}
              style={{ x: mobileCardsX }}
            >

              {/* ── Card 1: Featured & Awards ── */}
              <div className="kf__card kf__card--dark kf__mobile-card">
                <div className="kf__card-label">TEXTURE MAPS BAKED</div>

                <div className="kf__card-img-wrap">
                  <img
                    src={lionTrophy}
                    alt="Featured and awards lion"
                    className="kf__card-img"
                    loading="lazy"
                  />
                </div>

                <div className="kf__card-footer">
                  <div className="kf__footer-left">
                    <div className="kf__icon-v">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 6L12 18L20 6" /><path d="M7 6L12 14L17 6" />
                      </svg>
                    </div>
                    <p className="kf__footer-desc">
                      4K PBR lightmaps &amp; normal<br />cages baked flawlessly.
                    </p>
                  </div>
                  <div className="kf__stat-number">
                    <AnimatedCounter to={50} suffix="M+" trigger={activeCardIdx === 0} />
                  </div>
                </div>
              </div>

              {/* ── Card 2: Projects Completed ── */}
              <div className="kf__card kf__card--light kf__mobile-card">
                <div className="kf__card-label kf__card-label--dark">3D CONFIGURATORS DEPLOYED</div>

                <div className="kf__circle-wrap">
                  <div className="kf__circle">
                    <span className="kf__circle-val">
                      <AnimatedDecimalCounter to={1.5} suffix="K+" trigger={activeCardIdx === 1} />
                    </span>
                  </div>
                </div>

                <div className="kf__card-footer">
                  <p className="kf__footer-desc kf__footer-desc--dark">
                    90% reduction in runtime draw<br />calls with pre-baked radiance.
                  </p>
                </div>
              </div>

              {/* ── Card 3: Our Team Members ── */}
              <div className="kf__card kf__card--dark kf__mobile-card">
                <div className="kf__card-label">BAKING CHANNELS &amp; FORMATS</div>

                <div className="kf__card-img-wrap">
                  <img
                    src={lionTeam}
                    alt="Team member lion mask"
                    className="kf__card-img"
                    loading="lazy"
                  />
                </div>

                <div className="kf__card-footer">
                  <div className="kf__footer-left">
                    <p className="kf__footer-desc">
                      Albedo, AO, Normal,<br />Roughness, GLTF, USDZ.
                    </p>
                  </div>
                  <div className="kf__stat-number">
                    <AnimatedCounter to={20} suffix="+" trigger={activeCardIdx === 2} />
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Centered Mobile Business Partners Bar */}
          <div className="kf__mobile-partners">
            <div className="kf__mobile-partners-label">OUR BUSINESS PARTNERS</div>
            <PartnersLogos />
          </div>

        </div>
      </div>

    </section>
  );
};

export default KeyFacts;
