import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../pages/pages.css';

const TIMELINE = [
  { year: '2019', title: 'Founded the studio', desc: 'Started as a solo creative technologist building WebGL experiences for early-stage startups.' },
  { year: '2020', title: 'First enterprise client', desc: 'Delivered a full-stack AI product interface for a Series-B fintech — establishing our enterprise design process.' },
  { year: '2021', title: 'Expanded into 3D & WebXR', desc: 'Pioneered spatial UI and three-dimensional product configurators as the industry moved toward immersive web.' },
  { year: '2022', title: 'Team of 8 creatives', desc: 'Scaled the studio with senior engineers, motion designers, and brand strategists.' },
  { year: '2023', title: 'Dribbble Top Agency', desc: 'Recognised as a Top Creative Agency on Dribbble with 2.4K+ project saves across our explorations.' },
  { year: '2024', title: 'Global reach: 14 countries', desc: 'Serving clients across North America, Europe, UAE, and Southeast Asia.' },
  { year: '2025–26', title: 'AI-first design studio', desc: 'Leading the industry shift by merging autonomous AI workflows with premium interactive design.' },
];

const VALUES = [
  { icon: '✦', title: 'Craft First', desc: 'Every pixel, motion, and interaction is intentional. We never ship work we aren\'t proud of.' },
  { icon: '◈', title: 'Clarity Always', desc: 'Complexity is the enemy. We simplify without dumbing down — turning big ideas into clear, beautiful forms.' },
  { icon: '⬡', title: 'Built to Scale', desc: 'Everything we build is architecturally sound and engineered for long-term performance.' },
  { icon: '◎', title: 'Human at the Core', desc: 'Technology should feel human. We keep the user\'s experience at the center of every decision.' },
  { icon: '⌖', title: 'Relentlessly Curious', desc: 'We explore emerging tools, formats, and ideas — then bring them to your product before anyone else.' },
  { icon: '▲', title: 'Results-Driven', desc: 'Beautiful design that converts. We merge aesthetics with measurable business outcomes.' },
];

const TEAM = [
  { name: 'Sunny R.', role: 'Founder & Creative Director', specialty: 'Strategy · Brand · 3D WebGL' },
  { name: 'Aria M.',  role: 'Lead UI/UX Designer', specialty: 'Spatial UI · Product Design · Motion' },
  { name: 'Dev K.',   role: 'Senior Full-Stack Engineer', specialty: 'React · Node · Cloud Architecture' },
  { name: 'Priya S.', role: 'AI & Automation Lead', specialty: 'LLMs · Agents · Neural Pipelines' },
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
          <span className="page-hero__tag-dot" /> About the Studio
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          We build <em>digital</em><br />experiences that last.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          An independent digital studio crafting meaningful brand experiences through strategy, design, and cutting-edge technology.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">Est. 2019</span>
          <span className="page-hero__meta-line">14 Countries</span>
          <span className="page-hero__meta-line">1.5K+ Projects Delivered</span>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="page-section about-mission">
        <div className="page-grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div className="page-section__label" variants={fadeUp}>Our Mission</motion.div>
            <motion.h2 className="page-section__heading" variants={fadeUp}>
              Making technology feel human.
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              Our mission is to design digital products that are intuitive, purposeful, and meaningful to people. We believe the best technology disappears into the experience — you only feel the result.
            </motion.p>
            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              From AI-powered automation to spatial 3D interfaces, we partner with ambitious brands to translate complex ideas into clear, beautiful digital experiences that perform at scale.
            </motion.p>
          </motion.div>

          {/* Stats grid */}
          <motion.div className="about-stats-grid"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            {[
              { num: '1.5K+', label: 'Projects Delivered' },
              { num: '98%',   label: 'Client Satisfaction' },
              { num: '14',    label: 'Countries Served' },
              { num: '7+',    label: 'Years of Craft' },
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
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>What we believe</motion.div>
        <motion.h2 className="page-section__heading" style={{ marginBottom: '3rem' }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Principles that guide<br/>every decision.
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
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>Our journey</motion.div>
        <motion.h2 className="page-section__heading" style={{ marginBottom: '3rem' }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Built over time,<br/>refined every year.
        </motion.h2>
        <motion.ul className="page-numbered-list" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {TIMELINE.map((t) => (
            <motion.li key={t.year} className="page-numbered-item" variants={fadeUp}>
              <span className="page-numbered-item__num">{t.year}</span>
              <div>
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
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>The team</motion.div>
        <motion.h2 className="page-section__heading" style={{ marginBottom: '3rem' }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          The people behind<br/>the craft.
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
          <h2 className="about-cta-heading">Ready to work together?</h2>
          <p className="about-cta-sub">Let's create something extraordinary.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/work" className="page-btn page-btn--outline">
              See our work
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
