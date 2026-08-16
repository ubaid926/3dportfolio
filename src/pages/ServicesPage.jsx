import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../pages/pages.css';

const SERVICES = [
  {
    id: 'ai',
    number: '01',
    title: 'AI & Intelligent Automation',
    category: 'INTELLIGENT AUTOMATION',
    tagline: 'Supercharge workflows with autonomous intelligence.',
    description: 'AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.',
    icon: 'bars',
    deliverables: ['Autonomous AI Digital Workers', 'LLM Fine-Tuning & Custom Agents', 'Workflow Automation Pipelines', 'Predictive Analytics & Smart Models', 'Neural Canvas & Generative Interfaces'],
    pricing: 'From $12,000',
    timeline: '4–8 weeks',
  },
  {
    id: 'development',
    number: '02',
    title: 'Custom Web & Software Development',
    category: 'CREATIVE TECH & CODE',
    tagline: 'Transforming visionary concepts into ultra-performant code.',
    description: 'Scalable web applications, clean code architecture, and high-performance digital solutions engineered for scale.',
    icon: 'radar',
    deliverables: ['Full-Stack Cloud Architecture & APIs', 'Next.js / React Enterprise Frontends', 'Performance Optimization & Core Vitals', 'Interactive Micro-Animations & State Systems', 'Resilient Security & Infrastructure Hardening'],
    pricing: 'From $8,000',
    timeline: '6–12 weeks',
  },
  {
    id: 'spatial',
    number: '03',
    title: 'Creative Tech & Spatial 3D',
    category: 'WEBGL & 3D EXPERIENCES',
    tagline: 'Immersive, interactive 3D worlds that captivate audiences.',
    description: 'Cutting-edge WebGL graphics, custom shader pipelines, and spatial canvas experiences that set brands apart.',
    icon: 'prism',
    deliverables: ['Three.js & WebGL Interactive 3D', 'Custom GLSL Shader Engineering', 'Spatial Web & 3D Product Configurator', 'Physics Simulation & Particle Systems', 'WebXR & Immersive Web Environments'],
    pricing: 'From $15,000',
    timeline: '8–14 weeks',
  },
  {
    id: 'cloud',
    number: '04',
    title: 'Autonomous Cloud Architecture',
    category: 'INFRASTRUCTURE & DEVOPS',
    tagline: 'Ultra-reliable distributed systems engineered for global scale.',
    description: 'High-availability cloud pipelines, containerized microservices, and serverless compute clusters with zero downtime.',
    icon: 'nodes',
    deliverables: ['Kubernetes & Serverless Infrastructure', 'Realtime Telemetry & Microservices', 'Multi-Region Database Synchronization', 'Edge Compute & CDN Optimization', 'Automated CI/CD Delivery Pipelines'],
    pricing: 'From $10,000',
    timeline: '5–10 weeks',
  },
  {
    id: 'design',
    number: '05',
    title: 'Website & Mobile Design',
    category: 'PRODUCT & SPATIAL UI',
    tagline: 'Crafting digital products that feel intuitive, human, and unforgettable.',
    description: 'High-quality website and app experiences designed to attract users and keep them coming back.',
    icon: 'arcs',
    deliverables: ['Product UI/UX & Interaction Design', 'Spatial & 3D Web Interface Systems', 'Multi-Platform Design Systems & Tokens', 'User Journey Mapping & Wireframing', 'Interactive Prototypes & Micro-Animations'],
    pricing: 'From $6,000',
    timeline: '3–6 weeks',
  },
  {
    id: 'branding',
    number: '06',
    title: 'Brand Strategy & Visual Systems',
    category: 'STRATEGY & IDENTITY',
    tagline: 'Building bold, cohesive brand worlds that command attention.',
    description: 'Dynamic brand identity systems, typography guidelines, and digital narratives built to stand the test of time.',
    icon: 'compass',
    deliverables: ['Brand Strategy & Positioning', 'Visual Identity & Logo Systems', 'Custom Typography & Color Palettes', 'Motion Guidelines & Sound Identity', 'Comprehensive Brand Design Systems'],
    pricing: 'From $9,000',
    timeline: '4–8 weeks',
  },
  {
    id: 'wordpress',
    number: '07',
    title: 'WordPress Development',
    category: 'CMS ARCHITECTURE',
    tagline: 'High-speed, scalable CMS solutions built for enterprise reliability.',
    description: 'WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.',
    icon: 'wave',
    deliverables: ['Custom Headless WordPress Architecture', 'High-Conversion Enterprise CMS', 'Tailored Gutenberg Blocks & Themes', 'Speed Optimization & Security Hardening', 'Seamless Third-Party API Integrations'],
    pricing: 'From $5,000',
    timeline: '3–5 weeks',
  },
  {
    id: 'interaction',
    number: '08',
    title: 'Product UI/UX & Interaction Design',
    category: 'HUMAN INTERACTION',
    tagline: 'Every micro-interaction engineered for delight and high conversion.',
    description: 'Intuitive user flows, behavioral psychology design, and frictionless checkout and onboarding experiences.',
    icon: 'orbit',
    deliverables: ['Behavioral UX Research & Usability Testing', 'Conversion Rate Optimization (CRO)', 'Design Sprint Prototyping', 'Design Token Libraries for Figma & Code', 'Accessibility (WCAG 2.1 AAA) Compliance'],
    pricing: 'From $7,000',
    timeline: '4–7 weeks',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function ServiceRow({ service }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`srv-row ${expanded ? 'srv-row--expanded' : ''}`}
      variants={fadeUp}
      layout
    >
      <button className="srv-row__header" onClick={() => setExpanded(!expanded)}>
        <div className="srv-row__left">
          <span className="srv-row__num">{service.number}</span>
          <div className="srv-row__titles">
            <span className="srv-row__category">{service.category}</span>
            <h3 className="srv-row__title">{service.title}</h3>
          </div>
        </div>
        <div className="srv-row__right">
          <span className="srv-row__pricing">{service.pricing}</span>
          <span className="srv-row__timeline">{service.timeline}</span>
          <span className={`srv-row__toggle ${expanded ? 'srv-row__toggle--open' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              {!expanded && <line x1="12" y1="5" x2="12" y2="19" />}
            </svg>
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="srv-row__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="srv-row__content">
              <div className="srv-row__desc-col">
                <p className="srv-row__tagline">{service.tagline}</p>
                <p className="srv-row__desc">{service.description}</p>
                <Link to="/contact" className="page-btn page-btn--primary" style={{ marginTop: '1.5rem', display: 'inline-flex', fontSize: '0.76rem' }}>
                  Get a quote →
                </Link>
              </div>
              <div className="srv-row__deliverables-col">
                <div className="srv-row__deliv-label">WHAT'S INCLUDED</div>
                <ul className="srv-row__deliv-list">
                  {service.deliverables.map((d) => (
                    <li key={d} className="srv-row__deliv-item">
                      <span className="srv-row__deliv-dot">→</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ServicesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="page-hero__noise" />
        <div className="page-hero__glow" />

        <motion.div className="page-hero__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="page-hero__tag-dot" /> What We Do
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          Services built<br/>for <em>scale</em>.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          From autonomous AI systems to immersive 3D experiences — a full-spectrum digital studio with an obsession for quality.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">{SERVICES.length} Disciplines</span>
          <span className="page-hero__meta-line">End-to-End</span>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="page-section">
        <div className="page-rule" style={{ marginBottom: '0' }}>
          <div className="page-rule__line" />
          <span className="page-rule__text">All Services</span>
          <div className="page-rule__line" />
        </div>
        <motion.div
          className="srv-accordion"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {SERVICES.map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
        </motion.div>
      </section>

      <div className="page-divider" />

      {/* ── PROCESS ── */}
      <section className="page-section page-section--mid">
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>How we work</motion.div>
        <motion.h2 className="page-section__heading" style={{ marginBottom: '3rem' }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Our proven<br/>process.
        </motion.h2>
        <motion.ul className="page-numbered-list" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {[
            { n: '01', title: 'Discovery & Strategy', desc: 'We dive deep into your goals, users, and competition to build a watertight creative brief before a single pixel is touched.' },
            { n: '02', title: 'Design & Prototype', desc: 'Rapid high-fidelity design sprints with interactive Figma prototypes — aligned to your brand system and tested with real users.' },
            { n: '03', title: 'Engineering & Development', desc: 'Clean, scalable code built on modern stacks. Every line serves a purpose. Performance is a feature, not an afterthought.' },
            { n: '04', title: 'QA & Launch', desc: 'Rigorous cross-device and performance testing before go-live. We launch on your timeline, not ours.' },
            { n: '05', title: 'Post-Launch Growth', desc: 'Ongoing partnership for iteration, optimization, and feature expansion as your product scales.' },
          ].map((step) => (
            <motion.li key={step.n} className="page-numbered-item" variants={fadeUp}>
              <span className="page-numbered-item__num">{step.n}</span>
              <div>
                <h4 className="page-numbered-item__title">{step.title}</h4>
                <p className="page-numbered-item__desc">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ── CTA ── */}
      <section className="page-section about-cta-section">
        <motion.div className="about-cta-inner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="about-cta-heading">Let's build something great.</h2>
          <p className="about-cta-sub">Tell us what you need — we'll tailor a plan.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project →
            </Link>
            <Link to="/work" className="page-btn page-btn--outline">
              See case studies
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
