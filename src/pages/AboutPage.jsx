import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../pages/pages.css';

const TIMELINE = [
  { year: '2019', title: 'Founded Nexora Studio Lab', desc: 'Started with custom WebGL shader development and procedural normal map synthesis.' },
  { year: '2020', title: 'First GPU Texture Baking Engine', desc: 'Engineered hardware-accelerated ambient occlusion and radiosity lightmap baking for real-time web.' },
  { year: '2021', title: '3D Configurator Suite', desc: 'Launched full-scale interactive 3D product configurators with live part attachment and material swapping.' },
  { year: '2022', title: 'High-to-Low Poly Cage Pipeline', desc: 'Automated 100M+ polygon decimation and tangent cage projection with zero seam artifacts.' },
  { year: '2023', title: 'Dribbble & WebGL Award Winners', desc: 'Recognised as a premier spatial 3D studio with 50M+ texture map pixels baked for global brands.' },
  { year: '2024', title: 'Automated Headless Cloud Baking', desc: 'Deployed cloud-native baking APIs generating production-ready glTF and USDZ models in under 5 seconds.' },
  { year: '2025–26', title: 'Spatial Computing & WebXR', desc: 'Pioneering next-gen Apple Vision Pro and WebXR 3D animation configurators with raytraced lightmaps.' },
];

const VALUES = [
  { icon: '✦', title: 'Zero Draw-Call Lag', desc: 'Every model is baked and consolidated into optimized texture atlases engineered for 120 FPS WebGL.' },
  { icon: '◈', title: 'Photorealistic PBR', desc: 'True-to-life physical materials: anisotropic carbon fibers, brushed metals, clearcoats, and SSS diffusion.' },
  { icon: '⬡', title: 'Production Ready', desc: 'Assets generated comply strictly with glTF 2.0, USDZ, and WebXR standards ready for instant deployment.' },
  { icon: '◎', title: 'Hardware Accelerated', desc: 'GPU compute shaders execute multi-pass raytraced AO, curvature, and radiosity baking in seconds.' },
  { icon: '⌖', title: 'Kinetic Rigging', desc: 'Dual-quaternion skeletal bone weights and blendshape facial animations calibrated for smooth browser motion.' },
  { icon: '▲', title: 'High Conversion', desc: 'Interactive 3D configurators proven to boost customer engagement and purchase confidence by over 40%.' },
];

const TEAM = [
  { name: 'Sunny R.', role: 'Founder & Lead 3D Technologist', specialty: 'WebGL · GLSL Shaders · Three.js' },
  { name: 'Marcus M.', role: 'Senior PBR Material Artist', specialty: 'Texture Synthesis · Cage Baking · UVs' },
  { name: 'Dev K.',   role: '3D Pipeline & Engine Architect', specialty: 'glTF 2.0 · Draco · Cloud Baking APIs' },
  { name: 'Patrick S.', role: 'Character & Rigging Director', specialty: 'Kinematic Rigs · Blendshapes · Motion' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="page-hero__noise" />
        <div className="page-hero__glow" />

        <motion.div className="page-hero__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="page-hero__tag-dot" /> About NEXORA STUDIO
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          Engineering <em>real-time 3D</em><br />and spatial experiences.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          We bridge the gap between heavy offline VFX renders and lightweight, interactive 3D web configurators through GPU texture baking.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">Est. 2019</span>
          <span className="page-hero__meta-line">50M+ Baked Pixels</span>
          <span className="page-hero__meta-line">1.5K+ Configurators</span>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="page-section about-mission">
        <div className="about-mission-grid">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div className="page-section__label" variants={fadeUp}>Our Mission</motion.div>
            <motion.h2 className="page-section__heading" variants={fadeUp}>
              Zero-lag 3D everywhere.
            </motion.h2>
            <motion.p className="about-mission-lead" variants={fadeUp}>
              Our mission is to make 3D animation configurators instantaneously fast and stunningly realistic on any browser or mobile device. By pre-computing heavy physical lighting and micro-surface details into baked PBR textures, Nexora Studio delivers photorealism with zero GPU bottleneck.
            </motion.p>
            <motion.p className="about-mission-text" variants={fadeUp}>
              From automotive customizers to luxury horology and robotic digital twins, we build the real-time graphics pipelines that define the future of interactive 3D web commerce.
            </motion.p>
          </motion.div>

          {/* Stats grid */}
          <motion.div className="about-stats-grid"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            {[
              { num: '50M+',  label: 'Baked Texture Pixels' },
              { num: '120',   label: 'FPS Target Framerate' },
              { num: '90%',   label: 'Draw Call Reduction' },
              { num: '1.5K+', label: '3D Assets Deployed' },
            ].map((s) => (
              <motion.div key={s.label} className="about-stat-card" variants={fadeUp}>
                <span className="about-stat-num">{s.num}</span>
                <span className="about-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="page-divider" />

      {/* ── VALUES ── */}
      <section className="page-section page-section--mid">
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>Our Principles</motion.div>
        <motion.h2 className="page-section__heading page-section__heading--spaced" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Principles that guide<br/>our 3D pipeline.
        </motion.h2>
        <motion.div className="page-grid-3" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {VALUES.map((v) => (
            <motion.div key={v.title} className="about-value-card" variants={fadeUp}>
              <span className="about-value-icon">{v.icon}</span>
              <h3 className="about-value-title">{v.title}</h3>
              <p className="about-value-desc">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="page-divider" />

      {/* ── TIMELINE ── */}
      <section className="page-section">
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>Our Evolution</motion.div>
        <motion.h2 className="page-section__heading page-section__heading--spaced" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Pioneering GPU baking<br/>and WebGL motion.
        </motion.h2>
        <motion.ul className="page-numbered-list" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {TIMELINE.map((t) => (
            <motion.li key={t.year} className="page-numbered-item" variants={fadeUp}>
              <span className="page-numbered-item__num">{t.year}</span>
              <div className="page-numbered-item__body">
                <h4 className="page-numbered-item__title">{t.title}</h4>
                <p className="page-numbered-item__desc">{t.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <div className="page-divider" />

      {/* ── TEAM ── */}
      <section className="page-section page-section--mid">
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>The Specialists</motion.div>
        <motion.h2 className="page-section__heading page-section__heading--spaced" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Technical artists behind<br/>Nexora Studio.
        </motion.h2>
        <motion.div className="about-team-grid" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {TEAM.map((m) => (
            <motion.div key={m.name} className="about-team-card" variants={fadeUp}>
              <div className="about-team-avatar">
                {m.name.charAt(0)}
              </div>
              <div>
                <div className="about-team-name">{m.name}</div>
                <div className="about-team-role">{m.role}</div>
                <div className="about-team-specialty">{m.specialty}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="page-section about-cta-section">
        <motion.div className="about-cta-inner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="about-cta-heading">Ready to configure your 3D product?</h2>
          <p className="about-cta-sub">Let's transform your 3D models into lightning-fast interactive web experiences.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/work" className="page-btn page-btn--outline">
              See 3D configurators
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
