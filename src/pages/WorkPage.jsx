import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import img1 from '../assets/(1).jpeg';
import img2 from '../assets/(2).jpeg';
import img3 from '../assets/(3).jpeg';
import img4 from '../assets/(4).jpeg';
import img5 from '../assets/(5).jpeg';
import img6 from '../assets/(6).jpeg';
import img7 from '../assets/(7).jpeg';
import img8 from '../assets/(8).jpeg';
import '../pages/pages.css';

const ALL_PROJECTS = [
  { id: 'myworker-ai',      title: 'MyWorker AI',          category: 'AI Platform',    year: '2026', client: 'MyWorker Global',    image: img1, tags: ['AI', 'Automation', 'Enterprise'],         description: 'An end-to-end AI workforce automation platform designed for high-scale enterprise teams.' },
  { id: 'pulse-studio',     title: 'Pulse Studio',         category: '3D WebGL',       year: '2025', client: 'Pulse Soundworks',   image: img2, tags: ['Three.js', 'Audio Reactive', 'WebGL'],    description: 'Spatial audio visualization engine with procedural shader visuals reacting to live inputs.' },
  { id: 'luxury-presence',  title: 'Luxury Presence',      category: 'Design System',  year: '2025', client: 'Luxury Presence Inc.',image: img3, tags: ['UI/UX', 'Architecture', 'Spatial UI'],  description: 'Spatial interface allowing buyers to explore ultra-luxury properties in interactive 3D.' },
  { id: 'luminary-web3',    title: 'Luminary Capital',     category: 'Fintech',        year: '2026', client: 'Luminary Ltd',       image: img4, tags: ['Fintech', 'Dashboard', 'Data Viz'],      description: 'Ultra-low latency institutional crypto interface with 3D depth heatmaps.' },
  { id: 'vanguard-arch',    title: 'Vanguard Living',      category: '3D WebGL',       year: '2025', client: 'Vanguard Dev',       image: img5, tags: ['Architecture', 'Real-Estate', '3D'],     description: 'Photorealistic 3D architectural walk-through for modern urban spaces.' },
  { id: 'cyberverse-fashion',title: 'CyberVerse Studio',  category: 'Interactive',    year: '2026', client: 'Cyber Couture',      image: img6, tags: ['Fashion', 'WebGL', 'Metaverse'],          description: 'Direct-to-avatar digital fashion showroom with realtime cloth simulation.' },
  { id: 'quantum-ai',       title: 'Quantum Intelligence', category: 'AI Platform',    year: '2026', client: 'Quantum Labs',       image: img7, tags: ['Generative AI', 'Canvas', 'Neural Net'], description: 'Node-based generative AI workflow engine for creative latent manipulation.' },
  { id: 'nexus-robotics',   title: 'Nexus Robotics',       category: 'Interactive',    year: '2025', client: 'Nexus Heavy Tech',   image: img8, tags: ['Robotics', 'Digital Twin', 'Telemetry'], description: 'Cloud control portal for robotic industrial fleets with sub-millisecond telemetry.' },
];

const CATEGORIES = ['All', 'AI Platform', '3D WebGL', 'Design System', 'Fintech', 'Interactive'];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      className="work-card"
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="work-card__media">
        <img src={project.image} alt={project.title} className="work-card__img" loading="lazy" />
        <div className={`work-card__overlay ${hovered ? 'work-card__overlay--visible' : ''}`}>
          <div className="work-card__overlay-tags">
            {project.tags.map((t) => (
              <span key={t} className="page-chip">{t}</span>
            ))}
          </div>
          <p className="work-card__overlay-desc">{project.description}</p>
        </div>
        <div className="work-card__index">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
      <div className="work-card__footer">
        <div className="work-card__meta">
          <span className="work-card__category">{project.category}</span>
          <span className="work-card__sep">·</span>
          <span className="work-card__year">{project.year}</span>
        </div>
        <h3 className="work-card__title">{project.title}</h3>
        <div className="work-card__client">{project.client}</div>
      </div>
    </motion.article>
  );
}

export default function WorkPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="page-hero__noise" />
        <div className="page-hero__glow" />

        <motion.div className="page-hero__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="page-hero__tag-dot" /> Selected Work
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          Projects that<br/><em>define</em> categories.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          Hand-picked explorations and client engagements spanning AI, 3D WebGL, fintech, and immersive brand design.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">{ALL_PROJECTS.length} Projects</span>
          <span className="page-hero__meta-line">2024–2026</span>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="work-filter-bar">
        <div className="work-filter-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`work-filter-btn ${activeFilter === cat ? 'work-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className="work-filter-count">
                  {ALL_PROJECTS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="page-section work-grid-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="work-projects-grid"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={stagger}
          >
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="page-section about-cta-section">
        <motion.div className="about-cta-inner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="about-cta-heading">Have a project in mind?</h2>
          <p className="about-cta-sub">Let's talk about what we can build together.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a conversation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
