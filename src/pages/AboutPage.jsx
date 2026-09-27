import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../pages/pages.css';

const TIMELINE = [
  { year: '2019', title: 'Founded Nexora Design Studio', desc: 'Established an independent graphic design and visual identity practice focusing on boutique luxury and tech brands.' },
  { year: '2020', title: 'First International Design Award', desc: 'Recognized at the European Design Awards for luxury cosmetic packaging and bespoke logotype craft.' },
  { year: '2021', title: 'Editorial & Book Arts Division', desc: 'Expanded into museum-grade monographs, high-fashion lookbooks, and hardcover publication design.' },
  { year: '2022', title: 'Kinetic Typography & Motion Lab', desc: 'Integrated dynamic type animation and variable font development into our core studio capabilities.' },
  { year: '2023', title: 'Global Brand Systems for Enterprises', desc: 'Engineered scalable Figma design systems and digital visual frameworks for international venture portfolios.' },
  { year: '2024', title: 'Sustainable Packaging Innovation', desc: 'Pioneered zero-plastic luxury packaging solutions featuring biodegradable cotton substrates and vegetable inks.' },
  { year: '2025–26', title: 'Spatial Signage & Art Direction', desc: 'Directing global exhibitions, large-format typographic installations, and holistic brand world experiences.' },
];

const VALUES = [
  { icon: '✦', title: 'Typographic Mastery', desc: 'Every letterform, grid alignment, and typographic hierarchy is mathematically balanced with Swiss clarity.' },
  { icon: '◈', title: 'Tactile Materiality', desc: 'Curation of specialty cotton stocks, multi-level blind embossing, metallic foil stamping, and sustainable packaging substrates.' },
  { icon: '⬡', title: 'Scalable Architecture', desc: 'Future-proof design systems codifying Figma tokens, responsive logomarks, and comprehensive guidelines.' },
  { icon: '◎', title: 'Kinetic Motion', desc: 'Transforming static graphics into fluid, captivating visual narratives through 2D/3D motion graphics and animated idents.' },
  { icon: '⌖', title: 'Cultural Resonance', desc: 'Deep contextual research into brand heritage, art history, and contemporary visual culture to create meaningful resonance.' },
  { icon: '▲', title: 'Commercial Impact', desc: 'Aesthetic distinction that drives tangible business growth, retail sell-through, and premium market authority.' },
];

const TEAM = [
  { name: 'Alex Vance', role: 'Creative Director & Founder', specialty: 'Brand Strategy · Type Design · Art Direction' },
  { name: 'Elena Rostova', role: 'Lead Packaging & Print Designer', specialty: 'Structural Packaging · Foil Stamping · Pre-Flight' },
  { name: 'Marcus Chen', role: 'Senior Typographer & System Architect', specialty: 'Variable Fonts · Swiss Grids · Figma Tokens' },
  { name: 'Sophia Dubois', role: 'Motion Design & Kinetic Lead', specialty: '2D/3D Motion · Brand Idents · After Effects' },
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
          Crafting bold <em>visual identities</em><br />and enduring design systems.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          We blend Swiss typographic precision, tactile materiality, and kinetic motion to build iconic brand languages for visionary founders and global enterprises.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">Est. 2019</span>
          <span className="page-hero__meta-line">150+ Brand Systems</span>
          <span className="page-hero__meta-line">48+ Design Awards</span>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="page-section about-mission">
        <div className="about-mission-grid">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div className="page-section__label" variants={fadeUp}>Our Studio Philosophy</motion.div>
            <motion.h2 className="page-section__heading" variants={fadeUp}>
              Design with purpose, form with soul.
            </motion.h2>
            <motion.p className="about-mission-lead" variants={fadeUp}>
              We believe that remarkable graphic design is not merely decorative styling—it is the strategic cornerstone of how a brand communicates its ethos, commands attention, and creates emotional connection in a crowded world.
            </motion.p>
            <motion.p className="about-mission-text" variants={fadeUp}>
              From luxury packaging finishes and bespoke typographic glyphs to large-scale exhibition signage and digital design tokens, our multidisciplinary studio crafts visual ecosystems that stand the test of time.
            </motion.p>
          </motion.div>

          {/* Stats grid */}
          <motion.div className="about-stats-grid"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            {[
              { num: '150+',  label: 'Brand Systems Delivered' },
              { num: '48+',   label: 'Design Awards & Honors' },
              { num: '98%',   label: 'Client Retention Rate' },
              { num: '2.5K+', label: 'Custom Typographic Marks' },
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
          Principles that guide<br/>our creative craft.
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
          Pioneering graphic design<br/>and typographic motion.
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
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>The Creative Team</motion.div>
        <motion.h2 className="page-section__heading page-section__heading--spaced" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Designers &amp; art directors<br/>behind Nexora Studio.
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
          <h2 className="about-cta-heading">Ready to elevate your visual identity?</h2>
          <p className="about-cta-sub">Let's craft a distinctive brand architecture that elevates your business.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/work" className="page-btn page-btn--outline">
              See design portfolio
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
